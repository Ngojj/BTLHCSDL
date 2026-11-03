import { describe, expect, it } from "vitest";
import { pool } from "../src/db/db";
import { recalculateProgress } from "../src/progress/progress.service";
import { api, bearer, enroll, insertCourse, insertLecture, insertQuestion, insertQuiz, insertSection, register, rows } from "./helpers";

type Student = { id: number; token: string };

/** A course with the given number of lectures per section; every section also gets a one-question quiz unless disabled. */
async function buildCourse(o: { lectures: number[]; quiz?: boolean; attempts?: number }) {
  const teacher = await register("teacher");
  const student = await register("student");
  const courseId = await insertCourse(teacher.id);
  const sections: { id: number; lectures: number[]; quizId?: number; questionId?: number }[] = [];
  for (const count of o.lectures) {
    const id = await insertSection(courseId, teacher.id);
    const lectures: number[] = [];
    for (let i = 0; i < count; i++) lectures.push(await insertLecture(id));
    const section: (typeof sections)[number] = { id, lectures };
    if (o.quiz !== false) {
      section.quizId = await insertQuiz(id, teacher.id, { attempt: o.attempts ?? 2 });
      section.questionId = await insertQuestion(section.quizId, teacher.id, { answer: "A", options: ["A", "B"] });
    }
    sections.push(section);
  }
  await enroll(student.id, courseId);
  return { teacher, student, courseId, sections };
}

const progressOf = (student: Student, courseId: number) => api().get(`/progress/course/${courseId}`).set(bearer(student.token));
const watch = (student: Student, lectureId: number, positionSeconds: number, completed = false) =>
  api().put(`/progress/lecture/${lectureId}`).set(bearer(student.token)).send({ positionSeconds, completed });
const answer = (student: Student, quizId: number, questionId: number, choice: string) =>
  api().post(`/quiz/${quizId}/submit`).set(bearer(student.token)).send({ answers: { [questionId]: choice } });

describe("course outline and next step", () => {
  it("starts at the first lecture with 0% and lists every item", async () => {
    const { student, courseId, sections } = await buildCourse({ lectures: [2, 1] });
    const res = await progressOf(student, courseId);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ progress: 0, completed: false, certificate: null, totals: { lectures: 3, lecturesDone: 0, quizzes: 2, quizzesDone: 0 } });
    expect(res.body.sections).toHaveLength(2);
    expect(res.body.next).toMatchObject({ type: "lecture", id: sections[0].lectures[0], sectionId: sections[0].id, positionSeconds: 0 });
  });

  it("remembers where the student stopped so playback can resume", async () => {
    const { student, courseId, sections } = await buildCourse({ lectures: [1] });
    const lecture = sections[0].lectures[0];
    expect((await watch(student, lecture, 95)).body).toMatchObject({ completed: false, positionSeconds: 95 });
    expect((await watch(student, lecture, 140)).body.positionSeconds).toBe(140);

    const res = await progressOf(student, courseId);
    expect(res.body.progress).toBe(0); // watching is not finishing
    expect(res.body.next).toMatchObject({ id: lecture, positionSeconds: 140 });
  });

  it("walks lecture by lecture, then the section's quiz, then the next section", async () => {
    const { student, courseId, sections } = await buildCourse({ lectures: [2, 1] });
    const [s1, s2] = sections;

    const first = await watch(student, s1.lectures[0], 600, true);
    expect(first.body.completed).toBe(true);
    expect(first.body.course).toMatchObject({ progress: 20, completed: false }); // 1 of 5 items
    expect((await progressOf(student, courseId)).body.next).toMatchObject({ type: "lecture", id: s1.lectures[1] });

    await watch(student, s1.lectures[1], 600, true);
    expect((await progressOf(student, courseId)).body.next).toMatchObject({ type: "quiz", id: s1.quizId });

    await answer(student, s1.quizId!, s1.questionId!, "A");
    const afterQuiz = await progressOf(student, courseId);
    expect(afterQuiz.body.progress).toBe(60); // 3 of 5
    expect(afterQuiz.body.next).toMatchObject({ type: "lecture", id: s2.lectures[0], sectionId: s2.id });
    expect(afterQuiz.body.sections[0].quizzes[0]).toMatchObject({ attemptsUsed: 1, bestScore: 10 });
  });

  it("does not recompute again when a finished lecture is reported twice", async () => {
    const { student, sections } = await buildCourse({ lectures: [1] });
    const lecture = sections[0].lectures[0];
    expect((await watch(student, lecture, 100, true)).body).toHaveProperty("course");
    const again = await watch(student, lecture, 5, true);
    expect(again.body).not.toHaveProperty("course");
    expect(again.body.completed).toBe(true);
  });
});

describe("completion and certificates", () => {
  it("completes the course, stamps the date and issues a certificate", async () => {
    const { student, courseId, sections } = await buildCourse({ lectures: [1, 1] });
    for (const s of sections) {
      await watch(student, s.lectures[0], 300, true);
      await answer(student, s.quizId!, s.questionId!, "A");
    }
    const res = await progressOf(student, courseId);
    expect(res.body).toMatchObject({ progress: 100, completed: true, gpa: 10 });
    expect(res.body.certificate.code).toMatch(/^BK-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);

    const [join] = await rows<any>("SELECT `progress`, `dateComplete` FROM `join` WHERE `courseId` = ? AND `studentId` = ?", [courseId, student.id]);
    expect(join.progress).toBe(100);
    expect(join.dateComplete).toBeTruthy();
    const [counters] = await rows<any>("SELECT `numberCoursesEnrolled` AS enrolled, `numberCoursesCompleted` AS completed FROM `student` WHERE `userId` = ?", [student.id]);
    expect(counters).toMatchObject({ enrolled: 1, completed: 1 });
  });

  it("finishes the course without a certificate when the average score is below the pass mark", async () => {
    const { student, courseId, sections } = await buildCourse({ lectures: [1], attempts: 1 });
    const [s] = sections;
    await watch(student, s.lectures[0], 10, true);
    await answer(student, s.quizId!, s.questionId!, "B"); // wrong, and there is no retake
    const res = await progressOf(student, courseId);
    expect(res.body).toMatchObject({ progress: 100, completed: true, gpa: 0, certificate: null });
    expect(await rows("SELECT 1 FROM `certification` WHERE `studentId` = ?", [student.id])).toHaveLength(0);
  });

  it("averages retakes and treats exactly the pass mark as a pass", async () => {
    const { student, courseId, sections } = await buildCourse({ lectures: [1], attempts: 2 });
    const [s] = sections;
    await watch(student, s.lectures[0], 10, true);
    await answer(student, s.quizId!, s.questionId!, "B"); // 0
    expect((await progressOf(student, courseId)).body.certificate).toBeNull();
    await answer(student, s.quizId!, s.questionId!, "A"); // 10 -> average 5.0
    const res = await progressOf(student, courseId);
    expect(res.body.gpa).toBe(5);
    expect(res.body.certificate).not.toBeNull();
  });

  it("lets a course without quizzes be completed by watching alone", async () => {
    const { student, courseId, sections } = await buildCourse({ lectures: [2], quiz: false });
    await watch(student, sections[0].lectures[0], 10, true);
    await watch(student, sections[0].lectures[1], 10, true);
    const res = await progressOf(student, courseId);
    expect(res.body).toMatchObject({ progress: 100, gpa: null });
    expect(res.body.certificate).not.toBeNull();
    const [cert] = await rows<any>("SELECT `grade` FROM `certification` WHERE `studentId` = ?", [student.id]);
    expect(cert.grade).toBeNull();
  });

  it("issues exactly one certificate when the last steps arrive at the same time", async () => {
    // several students at once, each finishing their last two lectures simultaneously, to make the race likely
    const scenarios = await Promise.all(Array.from({ length: 8 }, () => buildCourse({ lectures: [3], quiz: false })));
    await Promise.all(scenarios.map(({ student, sections }) => watch(student, sections[0].lectures[0], 10, true)));

    const results = await Promise.all(
      scenarios.flatMap(({ student, sections }) => [
        watch(student, sections[0].lectures[1], 10, true),
        watch(student, sections[0].lectures[1], 10, true),
        watch(student, sections[0].lectures[2], 10, true),
        watch(student, sections[0].lectures[2], 10, true),
      ])
    );
    expect(results.map((r) => r.status)).toEqual(Array(32).fill(200)); // nobody gets an error from the race

    for (const { student, courseId } of scenarios) {
      expect(await rows("SELECT 1 FROM `certification` WHERE `studentId` = ? AND `courseId` = ?", [student.id, courseId])).toHaveLength(1);
      expect((await progressOf(student, courseId)).body.progress).toBe(100);
    }
  });

  it("serialises recalculations on the enrollment row so a stale result cannot overwrite a fresh one", async () => {
    const { student, courseId, sections } = await buildCourse({ lectures: [1], quiz: false });
    const lecture = sections[0].lectures[0];

    // a concurrent request holds the enrollment lock...
    const holder = await pool.getConnection();
    await holder.beginTransaction();
    await holder.query("SELECT 1 FROM `join` WHERE `courseId` = ? AND `studentId` = ? FOR UPDATE", [courseId, student.id]);

    const pending = recalculateProgress(student.id, courseId);
    await new Promise((resolve) => setTimeout(resolve, 300)); // let it start and block on the lock

    // ...and finishes the lecture while the recalculation is still waiting
    await holder.query("INSERT INTO `interact` (`lectureId`, `studentId`, `positionSeconds`, `completedAt`) VALUES (?, ?, 60, NOW())", [lecture, student.id]);
    await holder.commit();
    holder.release();

    // the waiting calculation must read *after* it got the lock, so it sees the finished lecture.
    // Without the lock it would compute 0% from the earlier view and then overwrite the correct value.
    expect(await pending).toMatchObject({ progress: 100, completed: true });
    const [join] = await rows<any>("SELECT `progress` FROM `join` WHERE `courseId` = ? AND `studentId` = ?", [courseId, student.id]);
    expect(join.progress).toBe(100);
  });

  it("keeps an issued certificate when the teacher later adds content", async () => {
    const { student, courseId, sections } = await buildCourse({ lectures: [1], quiz: false });
    await watch(student, sections[0].lectures[0], 10, true);
    const code = (await progressOf(student, courseId)).body.certificate.code;
    await insertLecture(sections[0].id);
    const res = await progressOf(student, courseId);
    expect(res.body.certificate.code).toBe(code);
    expect(res.body.completed).toBe(false); // the new lecture is not done yet
  });
});

describe("access rules", () => {
  it("only serves enrolled students", async () => {
    const { teacher, courseId, sections } = await buildCourse({ lectures: [1] });
    const outsider = await register("student");
    const lecture = sections[0].lectures[0];
    expect((await progressOf(outsider, courseId)).status).toBe(403);
    expect((await watch(outsider, lecture, 5, true)).status).toBe(403);
    expect((await api().get(`/progress/course/${courseId}`).set(bearer(teacher.token))).status).toBe(403);
    expect((await api().get(`/progress/course/${courseId}`)).status).toBe(401);
    expect(await rows("SELECT 1 FROM `interact` WHERE `studentId` = ?", [outsider.id])).toHaveLength(0);
  });

  it("validates what the player sends", async () => {
    const { student, sections } = await buildCourse({ lectures: [1] });
    const lecture = sections[0].lectures[0];
    expect((await api().put(`/progress/lecture/${lecture}`).set(bearer(student.token)).send({ positionSeconds: -1 })).status).toBe(400);
    expect((await api().put(`/progress/lecture/${lecture}`).set(bearer(student.token)).send({ positionSeconds: 5, completed: "yes" })).status).toBe(400);
    expect((await api().put(`/progress/lecture/${lecture}`).set(bearer(student.token)).send({})).status).toBe(400);
    expect((await api().put("/progress/lecture/99999999").set(bearer(student.token)).send({ positionSeconds: 1 })).status).toBe(404);
  });
});
