import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import request from "supertest";
import { createApp } from "../src/app";
import { pool } from "../src/db/db";
import type { CreateCheckoutInput, PaymentGateway } from "../src/payment/payment.gateway";

export const app = createApp();
export const api = () => request(app);
export const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });

let seq = 0;
export const unique = () => `${Date.now().toString(36)}${(++seq).toString(36)}`;

export async function register(role: "student" | "teacher") {
  const username = `${role}_${unique()}`;
  const res = await api()
    .post(`/auth/register-as-${role}`)
    .send({ firstName: "Test", lastName: "User", username, password: "Passw0rd!", email: `${username}@test.dev`, bankName: "ACB", bankAccount: "123456789" });
  if (res.status !== 200) throw new Error(`register failed: ${res.status} ${JSON.stringify(res.body)}`);
  return { id: res.body.user.id as number, token: res.body.token as string, username };
}

type CourseOptions = { price?: number; name?: string; description?: string; language?: string };

export async function insertCourse(teacherId: number, o: CourseOptions = {}) {
  const [r] = await pool.query<ResultSetHeader>(
    "INSERT INTO `course` (`name`, `language`, `description`, `teacherId`, `price`) VALUES (?, ?, ?, ?, ?)",
    [o.name ?? `Course ${unique()}`, o.language ?? "Tiếng Việt", o.description ?? "A test course", teacherId, o.price ?? 0]
  );
  return r.insertId;
}

export async function insertSection(courseId: number, teacherId: number) {
  const [r] = await pool.query<ResultSetHeader>("INSERT INTO `section` (`name`, `teacherId`, `courseId`) VALUES (?, ?, ?)", [`Section ${unique()}`, teacherId, courseId]);
  return r.insertId;
}

export async function insertLecture(sectionId: number) {
  const [r] = await pool.query<ResultSetHeader>("INSERT INTO `lecture` (`name`, `material`, `sectionId`) VALUES (?, ?, ?)", [`Lecture ${unique()}`, "https://example.com/video.mp4", sectionId]);
  return r.insertId;
}

export async function insertQuiz(sectionId: number, teacherId: number, o: { attempt?: number; state?: string } = {}) {
  const [r] = await pool.query<ResultSetHeader>(
    "INSERT INTO `quiz` (`name`, `state`, `attempt`, `teacherId`, `sectionId`) VALUES (?, ?, ?, ?, ?)",
    [`Quiz ${unique()}`, o.state ?? "opened", o.attempt ?? 2, teacherId, sectionId]
  );
  return r.insertId;
}

/** Question ids are global (max + 1), exactly like the application assigns them. */
export async function insertQuestion(quizId: number, teacherId: number, o: { type?: string; answer: string; content?: string; options?: string[] }) {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT COALESCE(MAX(`id`), 0) + 1 AS id FROM `question`");
  const id = rows[0].id as number;
  await pool.query("INSERT INTO `question` (`id`, `quizId`, `type`, `answer`, `content`, `teacherId`) VALUES (?, ?, ?, ?, ?, ?)", [
    id, quizId, o.type ?? "multiple choice", o.answer, o.content ?? `Question ${id}`, teacherId,
  ]);
  for (const option of o.options ?? []) await pool.query("INSERT INTO `option` (`questionId`, `option`) VALUES (?, ?)", [id, option]);
  return id;
}

export async function enroll(studentId: number, courseId: number, daysAgo = 0) {
  await pool.query("INSERT INTO `join` (`courseId`, `studentId`, `dateStart`) VALUES (?, ?, DATE_SUB(CURDATE(), INTERVAL ? DAY))", [courseId, studentId, daysAgo]);
  await pool.query("UPDATE `student` SET `numberCoursesEnrolled` = (SELECT COUNT(*) FROM `join` WHERE `studentId` = ?) WHERE `userId` = ?", [studentId, studentId]);
}

export const rows = async <T = RowDataPacket>(sql: string, params: unknown[] = []) => (await pool.query<RowDataPacket[]>(sql, params))[0] as unknown as T[];

/** In-memory stand-in for PayOS; "valid" is the only signature it accepts. */
export class FakeGateway implements PaymentGateway {
  created: CreateCheckoutInput[] = [];
  remote = new Map<number, { status: "PENDING" | "PAID" | "CANCELLED" | "EXPIRED" | "OTHER"; amountPaid: number }>();
  failCreate = false;

  async createCheckout(input: CreateCheckoutInput) {
    if (this.failCreate) throw new Error("gateway down");
    this.created.push(input);
    return { checkoutUrl: `https://pay.test/${input.orderCode}` };
  }
  async getStatus(orderCode: number) {
    return this.remote.get(orderCode) ?? { status: "PENDING" as const, amountPaid: 0 };
  }
  async verifyWebhook(body: any) {
    if (body?.signature !== "valid") throw new Error("invalid signature");
    return { orderCode: body.data.orderCode, amount: body.data.amount, success: body.success === true && body.data.code === "00" };
  }
}

export const webhookBody = (orderCode: number, amount: number, signature = "valid") => ({
  code: "00", desc: "success", success: true, signature, data: { orderCode, amount, code: "00" },
});
