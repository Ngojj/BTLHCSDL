import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { setGateway } from "../src/payment/payment.gateway";
import { api, bearer, enroll, FakeGateway, insertCourse, register, rows, webhookBody } from "./helpers";

const gateway = new FakeGateway();
beforeAll(() => setGateway(gateway));
afterAll(() => setGateway(undefined));
beforeEach(() => {
  gateway.created = [];
  gateway.remote.clear();
  gateway.failCreate = false;
});

const PRICE = 500000;

async function setup() {
  const teacher = await register("teacher");
  const student = await register("student");
  const courseId = await insertCourse(teacher.id, { price: PRICE });
  return { teacher, student, courseId };
}

const checkout = (token: string, courseId: number, extra: object = {}) =>
  api().post("/payment/create-link").set(bearer(token)).send({ courseId, ...extra });

const enrollments = (studentId: number, courseId: number) =>
  rows("SELECT 1 FROM `join` WHERE `studentId` = ? AND `courseId` = ?", [studentId, courseId]);

describe("creating a checkout", () => {
  it("charges the price stored in the database, whatever the client claims", async () => {
    const { student, courseId } = await setup();
    const res = await checkout(student.token, courseId, { price: 1, amount: 1, studentId: 999999 });
    expect(res.status).toBe(200);
    expect(res.body.checkoutUrl).toBe(`https://pay.test/${res.body.orderCode}`);
    expect(gateway.created[0]).toMatchObject({ orderCode: res.body.orderCode, amount: PRICE });
    expect(gateway.created[0].returnUrl).toContain(`orderCode=${res.body.orderCode}`);
    const [order] = await rows<any>("SELECT * FROM `payment` WHERE `orderCode` = ?", [res.body.orderCode]);
    expect(order).toMatchObject({ studentId: student.id, courseId, amount: PRICE, status: "PENDING" });
  });

  it("requires a student and a valid course", async () => {
    const { teacher, student, courseId } = await setup();
    expect((await api().post("/payment/create-link").send({ courseId })).status).toBe(401);
    expect((await checkout(teacher.token, courseId)).status).toBe(403);
    expect((await checkout(student.token, 99999999)).status).toBe(404);
    expect((await api().post("/payment/create-link").set(bearer(student.token)).send({})).status).toBe(400);
  });

  it("refuses free courses, repeat purchases and a 4th course in progress", async () => {
    const { teacher, student, courseId } = await setup();
    const free = await insertCourse(teacher.id, { price: 0 });
    expect((await checkout(student.token, free)).status).toBe(400);

    for (let i = 0; i < 3; i++) await enroll(student.id, await insertCourse(teacher.id));
    const atLimit = await checkout(student.token, courseId);
    expect(atLimit.status).toBe(409);
    expect(atLimit.body.message).toMatch(/at most 3 courses/);
    expect(gateway.created).toHaveLength(0); // nobody was sent to the payment page

    const other = await register("student");
    await enroll(other.id, courseId);
    expect((await checkout(other.token, courseId)).body.message).toMatch(/already enrolled/);
  });

  it("cancels the order and reports 502 when the gateway is down", async () => {
    const { student, courseId } = await setup();
    gateway.failCreate = true;
    expect((await checkout(student.token, courseId)).status).toBe(502);
    const orders = await rows<any>("SELECT `status` FROM `payment` WHERE `studentId` = ?", [student.id]);
    expect(orders.map((o) => o.status)).toEqual(["CANCELLED"]);
  });
});

describe("webhook", () => {
  it("rejects an invalid signature without enrolling anyone", async () => {
    const { student, courseId } = await setup();
    const { orderCode } = (await checkout(student.token, courseId)).body;
    const res = await api().post("/payment/webhook").send(webhookBody(orderCode, PRICE, "forged"));
    expect(res.status).toBe(400);
    expect(await enrollments(student.id, courseId)).toHaveLength(0);
  });

  it("enrolls the student when a signed payment event arrives", async () => {
    const { student, courseId } = await setup();
    const { orderCode } = (await checkout(student.token, courseId)).body;
    const res = await api().post("/payment/webhook").send(webhookBody(orderCode, PRICE));
    expect(res.status).toBe(200);
    expect(await enrollments(student.id, courseId)).toHaveLength(1);
    const [order] = await rows<any>("SELECT `status`, `paidAt` FROM `payment` WHERE `orderCode` = ?", [orderCode]);
    expect(order.status).toBe("PAID");
    expect(order.paidAt).toBeTruthy();
    const [s] = await rows<any>("SELECT `numberCoursesEnrolled` AS n FROM `student` WHERE `userId` = ?", [student.id]);
    expect(s.n).toBe(1);
  });

  it("is idempotent, even when the same event is delivered concurrently", async () => {
    const { student, courseId } = await setup();
    const { orderCode } = (await checkout(student.token, courseId)).body;
    const results = await Promise.all(Array.from({ length: 5 }, () => api().post("/payment/webhook").send(webhookBody(orderCode, PRICE))));
    expect(results.every((r) => r.status === 200)).toBe(true);
    expect(await enrollments(student.id, courseId)).toHaveLength(1);
  });

  it("refuses to enroll when the paid amount differs from the order", async () => {
    const { student, courseId } = await setup();
    const { orderCode } = (await checkout(student.token, courseId)).body;
    expect((await api().post("/payment/webhook").send(webhookBody(orderCode, PRICE - 1))).status).toBe(400);
    expect(await enrollments(student.id, courseId)).toHaveLength(0);
    const [order] = await rows<any>("SELECT `status` FROM `payment` WHERE `orderCode` = ?", [orderCode]);
    expect(order.status).toBe("PENDING");
  });

  it("acknowledges events for orders it has never seen (PayOS sends a test event on registration)", async () => {
    const res = await api().post("/payment/webhook").send(webhookBody(123, 2000));
    expect(res.status).toBe(200);
  });

  it("flags a paid order for refund when the 3-course limit is hit in the meantime", async () => {
    const { teacher, student, courseId } = await setup();
    const { orderCode } = (await checkout(student.token, courseId)).body;
    for (let i = 0; i < 3; i++) await enroll(student.id, await insertCourse(teacher.id)); // filled up after checkout started
    expect((await api().post("/payment/webhook").send(webhookBody(orderCode, PRICE))).status).toBe(200);
    expect(await enrollments(student.id, courseId)).toHaveLength(0);
    const [order] = await rows<any>("SELECT `status` FROM `payment` WHERE `orderCode` = ?", [orderCode]);
    expect(order.status).toBe("ENROLL_FAILED");
  });
});

describe("order status", () => {
  it("settles a paid order by asking the gateway when no webhook arrived", async () => {
    const { student, courseId } = await setup();
    const { orderCode } = (await checkout(student.token, courseId)).body;

    const pending = await api().get(`/payment/order/${orderCode}`).set(bearer(student.token));
    expect(pending.body.status).toBe("PENDING");
    expect(await enrollments(student.id, courseId)).toHaveLength(0);

    gateway.remote.set(orderCode, { status: "PAID", amountPaid: PRICE });
    const paid = await api().get(`/payment/order/${orderCode}`).set(bearer(student.token));
    expect(paid.body).toMatchObject({ status: "PAID", courseId, amount: PRICE });
    expect(await enrollments(student.id, courseId)).toHaveLength(1);
  });

  it("marks cancelled orders and never enrolls them", async () => {
    const { student, courseId } = await setup();
    const { orderCode } = (await checkout(student.token, courseId)).body;
    gateway.remote.set(orderCode, { status: "CANCELLED", amountPaid: 0 });
    expect((await api().get(`/payment/order/${orderCode}`).set(bearer(student.token))).body.status).toBe("CANCELLED");
    expect(await enrollments(student.id, courseId)).toHaveLength(0);
  });

  it("does not show one student's order to another", async () => {
    const { student, courseId } = await setup();
    const stranger = await register("student");
    const { orderCode } = (await checkout(student.token, courseId)).body;
    expect((await api().get(`/payment/order/${orderCode}`).set(bearer(stranger.token))).status).toBe(404);
  });

  it("lists my payment history", async () => {
    const { student, courseId } = await setup();
    await checkout(student.token, courseId);
    const res = await api().get("/payment/history").set(bearer(student.token));
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0]).toMatchObject({ courseId, amount: PRICE, status: "PENDING" });
  });
});

describe("direct enrollment", () => {
  it("is allowed for free courses and enrolls the caller, not whoever the body names", async () => {
    const teacher = await register("teacher");
    const student = await register("student");
    const victim = await register("student");
    const free = await insertCourse(teacher.id, { price: 0 });
    const res = await api().post("/join/create").set(bearer(student.token)).send({ courseId: free, studentId: victim.id });
    expect(res.status).toBeLessThan(300);
    expect(await enrollments(student.id, free)).toHaveLength(1);
    expect(await enrollments(victim.id, free)).toHaveLength(0);
  });

  it("is refused for paid courses (402) — payment is the only way in", async () => {
    const { student, courseId } = await setup();
    const res = await api().post("/join/create").set(bearer(student.token)).send({ courseId });
    expect(res.status).toBe(402);
    expect(await enrollments(student.id, courseId)).toHaveLength(0);
  });
});
