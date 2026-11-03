import jwt from "jsonwebtoken";
import { describe, expect, it } from "vitest";
import { api, bearer, enroll, insertCourse, insertLecture, insertQuestion, insertQuiz, insertSection, register, rows, unique } from "./helpers";

describe("system", () => {
  it("reports health with a live database", async () => {
    const res = await api().get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: "ok", database: "up" });
  });

  it("returns JSON 404 for unknown routes and 400 for malformed JSON", async () => {
    expect((await api().get("/nope")).body.message).toMatch(/Route not found/);
    const bad = await api().post("/auth/login").set("content-type", "application/json").send("{oops");
    expect(bad.status).toBe(400);
  });

  it("sets security headers, hides the framework and tags requests", async () => {
    const res = await api().get("/");
    expect(res.headers["x-powered-by"]).toBeUndefined();
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    expect(res.headers["x-request-id"]).toBeTruthy();
  });

  it("serves OpenAPI docs", async () => {
    const res = await api().get("/docs.json");
    expect(res.body.openapi).toBe("3.0.3");
    expect(Object.keys(res.body.paths)).toContain("/quiz/{quizId}/submit");
  });
});

describe("CORS", () => {
  it("allows configured origins and wildcard preview domains only", async () => {
    const allowed = ["http://localhost:3000", "https://my-preview-abc.vercel.app"];
    for (const origin of allowed) {
      expect((await api().get("/").set("Origin", origin)).headers["access-control-allow-origin"]).toBe(origin);
    }
    for (const origin of ["https://evil.com", "https://evil.vercel.app.attacker.com", "http://localhost:3001"]) {
      expect((await api().get("/").set("Origin", origin)).headers["access-control-allow-origin"]).toBeUndefined();
    }
  });
});

describe("authentication", () => {
  it("rejects missing, malformed, expired and wrongly signed tokens", async () => {
    const secret = process.env.TOKEN_SECRET!;
    const claims = { sub: 1, role: "teacher", firstName: "A", lastName: "B", email: "a@b.c" };
    expect((await api().get("/join/teacherId/1")).status).toBe(401);
    expect((await api().get("/join/teacherId/1").set(bearer("garbage"))).status).toBe(401);
    expect((await api().get("/join/teacherId/1").set(bearer(jwt.sign(claims, secret, { expiresIn: -10 })))).status).toBe(401);
    expect((await api().get("/join/teacherId/1").set(bearer(jwt.sign(claims, "another-secret-value-123456")))).status).toBe(401);
  });

  it("validates registration input and rejects duplicate usernames", async () => {
    const weak = await api().post("/auth/register-as-student").send({ username: "ab", password: "short" });
    expect(weak.status).toBe(400);
    expect(weak.body.details.map((d: any) => d.path)).toEqual(expect.arrayContaining(["body.password", "body.username"]));

    const user = await register("student");
    const dup = await api()
      .post("/auth/register-as-student")
      .send({ firstName: "T", lastName: "U", username: user.username, password: "Passw0rd!", email: `x${unique()}@test.dev`, bankName: "ACB", bankAccount: "1" });
    expect(dup.status).toBe(400);
  });

  it("logs in with the right password only and never returns the hash", async () => {
    const user = await register("teacher");
    const ok = await api().post("/auth/login").send({ username: user.username, password: "Passw0rd!" });
    expect(ok.status).toBe(200);
    expect(ok.body.token).toBeTruthy();
    expect(JSON.stringify(ok.body)).not.toMatch(/\$2[aby]\$/);
    expect((await api().post("/auth/login").send({ username: user.username, password: "wrong-password" })).status).toBe(401);
  });

  it("stores passwords as bcrypt hashes", async () => {
    const user = await register("student");
    const [row] = await rows<{ password: string }>("SELECT `password` FROM `user` WHERE `id` = ?", [user.id]);
    expect(row.password).toMatch(/^\$2[aby]\$/);
  });
});

describe("authorization", () => {
  it("keeps teacher-only actions away from students and removed endpoints gone", async () => {
    const student = await register("student");
    const res = await api().post("/course/create").set(bearer(student.token)).send({ courseName: "x" });
    expect(res.status).toBe(403);
    expect((await api().get("/course/debug")).status).toBe(404);
    expect((await api().post("/dO/create").set(bearer(student.token)).send({ quizId: 1, studentId: student.id, score: 10, attemptOrder: 1 })).status).toBe(404);
    expect((await api().patch("/join/update").set(bearer(student.token)).send({ courseId: 1, studentId: student.id, progress: 100, GPA: 10 })).status).toBe(403);
  });

  it("lets a teacher create content through the API and binds identity from the token", async () => {
    const teacher = await register("teacher");
    const other = await register("teacher");

    const created = await api()
      .post("/course/create")
      .set(bearer(teacher.token))
      .send({ courseName: `API course ${unique()}`, language: "English", description: "d", teacherId: other.id, price: 120000, topics: ["SQL"] });
    expect(created.status).toBe(200);

    const mine = await api().get(`/course/teacherId/${teacher.id}`).set(bearer(teacher.token));
    expect(mine.body.data).toHaveLength(1); // the forged teacherId in the body was ignored
    const courseId = mine.body.data[0].courseId;

    const section = await api().post("/section/create").set(bearer(teacher.token)).send({ name: "S1", numOfLecture: 0, timeToComplete: 12, teacherId: other.id, courseId });
    expect(section.status).toBe(200);
    const [row] = await rows<{ teacherId: number }>("SELECT `teacherId` FROM `section` WHERE `courseId` = ?", [courseId]);
    expect(row.teacherId).toBe(teacher.id);
  });

  it("stops a teacher from touching another teacher's course", async () => {
    const owner = await register("teacher");
    const intruder = await register("teacher");
    const courseId = await insertCourse(owner.id);
    const sectionId = await insertSection(courseId, owner.id);
    const quizId = await insertQuiz(sectionId, owner.id);
    const questionId = await insertQuestion(quizId, owner.id, { answer: "A", options: ["A", "B"] });

    const attempts = [
      api().delete(`/course/delete/id/${courseId}`),
      api().put(`/course/update/id/${courseId}`).send({ courseName: "hijacked" }),
      api().post("/section/create").send({ name: "evil", numOfLecture: 0, timeToComplete: 12, courseId }),
      api().patch("/section/update").send({ id: sectionId, name: "evil", courseId }),
      api().delete(`/section/delete/${sectionId}`),
      api().patch("/quiz/update").send({ id: quizId, name: "evil" }),
      api().post("/question/create").send({ quizId, type: "multiple choice", answer: "A", content: "evil", options: ["A"] }),
      api().patch("/question/update").send({ id: questionId, content: "evil" }),
      api().post("/option/create").send({ questionId, option: "evil" }),
      api().get(`/join/courseId/${courseId}`),
    ];
    for (const attempt of attempts) expect((await attempt.set(bearer(intruder.token))).status).toBe(403);

    expect(await rows("SELECT 1 FROM `course` WHERE `id` = ?", [courseId])).toHaveLength(1);
    expect((await api().delete(`/course/delete/id/${courseId}`).set(bearer(owner.token))).status).toBeLessThan(300);
  });

  it("reports 404 for a resource that does not exist", async () => {
    const teacher = await register("teacher");
    expect((await api().delete("/course/delete/id/99999999").set(bearer(teacher.token))).status).toBe(404);
  });
});

describe("content gating", () => {
  it("shows lectures, quizzes and questions only to the owner and enrolled students", async () => {
    const teacher = await register("teacher");
    const enrolled = await register("student");
    const outsider = await register("student");
    const courseId = await insertCourse(teacher.id, { price: 100000 });
    const sectionId = await insertSection(courseId, teacher.id);
    await insertLecture(sectionId);
    const quizId = await insertQuiz(sectionId, teacher.id);
    await insertQuestion(quizId, teacher.id, { answer: "A", options: ["A", "B"] });
    await enroll(enrolled.id, courseId);

    const urls = [`/lecture/section/${sectionId}`, `/quiz/section/${sectionId}`, `/question/quiz/${quizId}`, `/section/id/${sectionId}`];
    for (const url of urls) {
      expect((await api().get(url).set(bearer(enrolled.token))).status, url).toBe(200);
      expect((await api().get(url).set(bearer(teacher.token))).status, url).toBe(200);
      expect((await api().get(url).set(bearer(outsider.token))).status, url).toBe(403);
      expect((await api().get(url)).status, url).toBe(401);
    }
  });

  it("keeps the public catalog and course outline readable without logging in", async () => {
    const teacher = await register("teacher");
    const courseId = await insertCourse(teacher.id);
    await insertSection(courseId, teacher.id);
    expect((await api().get("/course/teacher")).status).toBe(200);
    expect((await api().get(`/course/id/${courseId}`)).status).toBe(200);
    expect((await api().get(`/section/course/${courseId}`)).status).toBe(200);
  });

  it("never sends correct answers to students, but does to the owning teacher", async () => {
    const teacher = await register("teacher");
    const student = await register("student");
    const courseId = await insertCourse(teacher.id);
    const sectionId = await insertSection(courseId, teacher.id);
    const quizId = await insertQuiz(sectionId, teacher.id);
    const questionId = await insertQuestion(quizId, teacher.id, { answer: "SECRET-ANSWER", options: ["SECRET-ANSWER", "other"] });
    await enroll(student.id, courseId);

    for (const url of [`/question/quiz/${quizId}`, `/question/quiz/${quizId}/options`, `/question/id/${questionId}`]) {
      const asStudent = await api().get(url).set(bearer(student.token));
      // the option text may equal the answer; what must never reach a student is the "answer" field itself
      expect(JSON.stringify(asStudent.body), url).not.toMatch(/"answer"\s*:/);
      const asTeacher = await api().get(url).set(bearer(teacher.token));
      expect(JSON.stringify(asTeacher.body), url).toContain('"answer":"SECRET-ANSWER"');
    }
  });
});
