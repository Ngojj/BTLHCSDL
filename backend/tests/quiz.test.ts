import { beforeAll, describe, expect, it } from "vitest";
import { api, bearer, enroll, insertCourse, insertQuestion, insertQuiz, insertSection, register, rows } from "./helpers";

type Fixture = {
  teacher: { id: number; token: string };
  student: { id: number; token: string };
  courseId: number;
  quizId: number;
  q: { mc1: number; mc2: number; fill: number };
};

async function makeQuiz(o: { attempt?: number; state?: string; enrolled?: boolean } = {}): Promise<Fixture> {
  const teacher = await register("teacher");
  const student = await register("student");
  const courseId = await insertCourse(teacher.id);
  const sectionId = await insertSection(courseId, teacher.id);
  const quizId = await insertQuiz(sectionId, teacher.id, { attempt: o.attempt ?? 2, state: o.state });
  const mc1 = await insertQuestion(quizId, teacher.id, { answer: "2NF", options: ["1NF", "2NF", "3NF"] });
  const mc2 = await insertQuestion(quizId, teacher.id, { answer: "HAVING", options: ["WHERE", "HAVING"] });
  const fill = await insertQuestion(quizId, teacher.id, { type: "fill in blank", answer: "DISTINCT" });
  if (o.enrolled !== false) await enroll(student.id, courseId);
  return { teacher, student, courseId, quizId, q: { mc1, mc2, fill } };
}

const submit = (f: Fixture, answers: Record<string, string>) =>
  api().post(`/quiz/${f.quizId}/submit`).set(bearer(f.student.token)).send({ answers });

describe("server-side quiz grading", () => {
  let f: Fixture;
  beforeAll(async () => {
    f = await makeQuiz({ attempt: 3 });
  });

  it("grades from the database and ignores any score the client sends", async () => {
    const res = await api()
      .post(`/quiz/${f.quizId}/submit`)
      .set(bearer(f.student.token))
      .send({ score: 10, answers: { [f.q.mc1]: "1NF", [f.q.mc2]: "HAVING", [f.q.fill]: "wrong" } });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ attemptOrder: 1, correct: 1, total: 3, score: 3.33, remainingAttempts: 2 });
    const stored = await rows<{ score: number }>("SELECT `score` FROM `dO` WHERE `quizId` = ? AND `studentId` = ?", [f.quizId, f.student.id]);
    expect(stored.map((r) => r.score)).toEqual([3.33]);
  });

  it("treats fill-in-the-blank answers case- and whitespace-insensitively but multiple choice strictly", async () => {
    const res = await submit(f, { [f.q.mc1]: "2nf", [f.q.mc2]: "HAVING", [f.q.fill]: "  distinct  " });
    expect(res.body).toMatchObject({ attemptOrder: 2, correct: 2, score: 6.67 });
  });

  it("refreshes progress, GPA and the course average after grading", async () => {
    const perfect = await submit(f, { [f.q.mc1]: "2NF", [f.q.mc2]: "HAVING", [f.q.fill]: "DISTINCT" });
    expect(perfect.body.score).toBe(10);
    const [join] = await rows<{ progress: number; GPA: number }>("SELECT `progress`, `GPA` FROM `join` WHERE `courseId` = ? AND `studentId` = ?", [f.courseId, f.student.id]);
    expect(join.progress).toBe(100); // the course has a single quiz and it has been attempted
    expect(join.GPA).toBeCloseTo((3.33 + 6.67 + 10) / 3, 1);
    const [course] = await rows<{ avgQuiz: number }>("SELECT `avgQuiz` FROM `course` WHERE `id` = ?", [f.courseId]);
    expect(course.avgQuiz).toBe(7);
  });

  it("refuses attempts beyond the limit", async () => {
    const res = await submit(f, { [f.q.mc1]: "2NF" });
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/No attempts left/);
  });

  it("validates the payload shape", async () => {
    expect((await api().post(`/quiz/${f.quizId}/submit`).set(bearer(f.student.token)).send({})).status).toBe(400);
    expect((await api().post(`/quiz/${f.quizId}/submit`).set(bearer(f.student.token)).send({ answers: { 1: 5 } })).status).toBe(400);
    expect((await api().post(`/quiz/abc/submit`).set(bearer(f.student.token)).send({ answers: {} })).status).toBe(400);
  });
});

describe("quiz access rules", () => {
  it("blocks students who are not enrolled", async () => {
    const f = await makeQuiz({ enrolled: false });
    const res = await submit(f, { [f.q.mc1]: "2NF" });
    expect(res.status).toBe(403);
    expect(await rows("SELECT 1 FROM `dO` WHERE `quizId` = ?", [f.quizId])).toHaveLength(0);
  });

  it("blocks teachers and anonymous callers from submitting", async () => {
    const f = await makeQuiz();
    expect((await api().post(`/quiz/${f.quizId}/submit`).set(bearer(f.teacher.token)).send({ answers: {} })).status).toBe(403);
    expect((await api().post(`/quiz/${f.quizId}/submit`).send({ answers: {} })).status).toBe(401);
  });

  it("rejects closed quizzes and unknown quizzes", async () => {
    const closed = await makeQuiz({ state: "closed" });
    expect((await submit(closed, {})).status).toBe(409);
    const f = await makeQuiz();
    const missing = await api().post("/quiz/99999999/submit").set(bearer(f.student.token)).send({ answers: {} });
    expect(missing.status).toBe(404);
  });

  it("lets only the right number of parallel submissions through", async () => {
    const f = await makeQuiz({ attempt: 2 });
    const results = await Promise.all(Array.from({ length: 6 }, () => submit(f, { [f.q.mc1]: "2NF" })));
    expect(results.filter((r) => r.status === 200)).toHaveLength(2);
    expect(results.filter((r) => r.status === 409)).toHaveLength(4);
    const attempts = await rows<{ attemptOrder: number }>("SELECT `attemptOrder` FROM `dO` WHERE `quizId` = ? ORDER BY `attemptOrder`", [f.quizId]);
    expect(attempts.map((a) => a.attemptOrder)).toEqual([1, 2]);
  });
});

describe("quiz review", () => {
  it("shows the student's answers and reveals correct answers only after the last attempt", async () => {
    const f = await makeQuiz({ attempt: 2 });
    const review = () => api().get(`/quiz/${f.quizId}/review`).set(bearer(f.student.token));

    expect((await review()).status).toBe(404); // nothing to review yet

    await submit(f, { [f.q.mc1]: "1NF", [f.q.mc2]: "HAVING" });
    const first = (await review()).body;
    expect(first.answersRevealed).toBe(false);
    expect(first.attempts).toEqual({ used: 1, allowed: 2 });
    expect(first.questions.find((q: any) => q.id === f.q.mc1)).toMatchObject({ studentAnswer: "1NF", isCorrect: false });
    expect(first.questions.find((q: any) => q.id === f.q.mc2)).toMatchObject({ studentAnswer: "HAVING", isCorrect: true });
    expect(JSON.stringify(first)).not.toContain("2NF");

    await submit(f, { [f.q.mc1]: "2NF" });
    const last = (await review()).body;
    expect(last.answersRevealed).toBe(true);
    expect(last.questions.find((q: any) => q.id === f.q.mc1)).toMatchObject({ studentAnswer: "2NF", isCorrect: true, correctAnswer: "2NF" });
  });
});
