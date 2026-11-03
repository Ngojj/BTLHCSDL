import { and, desc, eq } from "drizzle-orm";
import type { PoolConnection, RowDataPacket } from "mysql2/promise";
import { env } from "../config/env";
import { db, withTransaction } from "../db/db";
import { course, join, payment } from "../db/schema";
import { HttpError, badRequest, conflict, notFound } from "../lib/errors";
import { logger } from "../lib/logger";
import { getGateway } from "./payment.gateway";

export const MAX_ACTIVE_COURSES = 3;

export type PaymentStatus = "PENDING" | "PAID" | "CANCELLED" | "EXPIRED" | "ENROLL_FAILED";

const newOrderCode = () => Date.now() * 1000 + Math.floor(Math.random() * 1000); // < 2^53, unique per ms

/** Checked before taking money so a student at the limit is not charged for an enrollment that would be refused. */
export async function assertCanEnroll(studentId: number, courseId: number) {
  const [existing] = await db
    .select({ courseId: join.courseId })
    .from(join)
    .where(and(eq(join.courseId, courseId), eq(join.studentId, studentId)))
    .limit(1);
  if (existing) throw conflict("You are already enrolled in this course");

  const rows = await db.select({ progress: join.progress }).from(join).where(eq(join.studentId, studentId));
  if (rows.filter((r) => r.progress < 100).length >= MAX_ACTIVE_COURSES) {
    throw new HttpError(
      409,
      `You can have at most ${MAX_ACTIVE_COURSES} courses in progress; finish one before enrolling in another`
    );
  }
}

export async function createCheckout(studentId: number, courseId: number) {
  const [target] = await db
    .select({ id: course.id, name: course.name, price: course.price })
    .from(course)
    .where(eq(course.id, courseId))
    .limit(1);
  if (!target) throw notFound("Course not found");
  if (target.price <= 0) throw badRequest("This course is free; enroll directly instead of paying");

  await assertCanEnroll(studentId, courseId);

  const orderCode = newOrderCode();
  // the amount always comes from the database — never from the client
  await db.insert(payment).values({ orderCode, studentId, courseId, amount: target.price });

  try {
    const { checkoutUrl } = await getGateway().createCheckout({
      orderCode,
      amount: target.price,
      description: "Thanh toan khoa hoc",
      returnUrl: `${env.frontendUrl}/payment-success?orderCode=${orderCode}`,
      cancelUrl: `${env.frontendUrl}/payment-success?orderCode=${orderCode}&status=CANCEL`,
    });
    await db.update(payment).set({ checkoutUrl }).where(eq(payment.orderCode, orderCode));
    return { orderCode, checkoutUrl };
  } catch (error) {
    await db.update(payment).set({ status: "CANCELLED" }).where(eq(payment.orderCode, orderCode));
    logger.error({ err: error, orderCode }, "payment gateway rejected checkout");
    throw new HttpError(502, "Payment provider is unavailable, please try again");
  }
}

type PaymentRow = typeof payment.$inferSelect;

const lockPayment = async (conn: PoolConnection, orderCode: number) => {
  const [rows] = await conn.query<RowDataPacket[]>("SELECT * FROM `payment` WHERE `orderCode` = ? FOR UPDATE", [orderCode]);
  return rows[0] as (PaymentRow & RowDataPacket) | undefined;
};

/**
 * Marks an order PAID and enrolls the student — exactly once. Safe to call from the webhook and
 * from the status poll at the same time: the row lock serialises them and the second caller sees PAID.
 */
export async function settlePaid(orderCode: number, amountPaid: number) {
  return withTransaction(async (conn) => {
    const row = await lockPayment(conn, orderCode);
    if (!row) return null;
    if (row.status === "PAID" || row.status === "ENROLL_FAILED") return row;

    if (amountPaid !== row.amount) {
      logger.error({ orderCode, expected: row.amount, got: amountPaid }, "payment amount mismatch, not enrolling");
      throw badRequest("Paid amount does not match the order");
    }

    try {
      // the trigger trg_join_limit_active_courses can still veto the insert under a race
      await conn.query("INSERT IGNORE INTO `join` (`courseId`, `studentId`, `dateStart`) VALUES (?, ?, CURRENT_DATE())", [
        row.courseId,
        row.studentId,
      ]);
    } catch (error: any) {
      if (error?.sqlState === "45000") {
        logger.error({ orderCode, studentId: row.studentId }, "paid but enrollment rejected, needs refund");
        await conn.query("UPDATE `payment` SET `status` = 'ENROLL_FAILED', `paidAt` = NOW() WHERE `orderCode` = ?", [orderCode]);
        return { ...row, status: "ENROLL_FAILED" as const };
      }
      throw error;
    }

    await conn.query(
      "UPDATE `student` SET `numberCoursesEnrolled` = (SELECT COUNT(*) FROM `join` WHERE `studentId` = ?) WHERE `userId` = ?",
      [row.studentId, row.studentId]
    );
    await conn.query("UPDATE `payment` SET `status` = 'PAID', `paidAt` = NOW() WHERE `orderCode` = ?", [orderCode]);
    return { ...row, status: "PAID" as const };
  }, { isolation: "READ COMMITTED" });
}

export async function markClosed(orderCode: number, status: "CANCELLED" | "EXPIRED") {
  await db.update(payment).set({ status }).where(and(eq(payment.orderCode, orderCode), eq(payment.status, "PENDING")));
}

/** Webhook entry point: the signature is verified by the gateway SDK before anything is trusted. */
export async function handleWebhook(body: unknown) {
  let event;
  try {
    event = await getGateway().verifyWebhook(body);
  } catch {
    throw badRequest("Invalid webhook signature");
  }
  if (event.success) await settlePaid(event.orderCode, event.amount);
  return { received: true };
}

/** Status of one of the student's own orders; asks the gateway when still pending (works without a public webhook URL). */
export async function getOrder(orderCode: number, studentId: number) {
  const [row] = await db
    .select()
    .from(payment)
    .where(and(eq(payment.orderCode, orderCode), eq(payment.studentId, studentId)))
    .limit(1);
  if (!row) throw notFound("Order not found");

  let current: PaymentRow = row;
  if (row.status === "PENDING") {
    try {
      const remote = await getGateway().getStatus(orderCode);
      if (remote.status === "PAID") current = ((await settlePaid(orderCode, remote.amountPaid)) as PaymentRow) ?? row;
      else if (remote.status === "CANCELLED" || remote.status === "EXPIRED") {
        await markClosed(orderCode, remote.status);
        current = { ...row, status: remote.status };
      }
    } catch (error) {
      if (error instanceof HttpError) throw error;
      logger.warn({ err: error, orderCode }, "could not reach payment gateway for status sync");
    }
  }

  return {
    orderCode: current.orderCode,
    courseId: current.courseId,
    amount: current.amount,
    status: current.status as PaymentStatus,
    paidAt: current.paidAt,
  };
}

export async function listPayments(studentId: number) {
  return db
    .select({
      orderCode: payment.orderCode,
      courseId: payment.courseId,
      courseName: course.name,
      amount: payment.amount,
      status: payment.status,
      createdAt: payment.createdAt,
      paidAt: payment.paidAt,
    })
    .from(payment)
    .innerJoin(course, eq(payment.courseId, course.id))
    .where(eq(payment.studentId, studentId))
    .orderBy(desc(payment.createdAt));
}
