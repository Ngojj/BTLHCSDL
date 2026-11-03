import type { RowDataPacket } from "mysql2/promise";
import { pool, withTransaction } from "../db/db";
import { issueCertificate } from "../certificate/certificate.service";
import { notFound } from "../lib/errors";

/** Minimum average quiz score (0-10) needed to earn a certificate. */
export const PASS_GPA = 5;

export interface ProgressSummary {
  progress: number;
  gpa: number | null;
  completed: boolean;
  certificateCode: string | null;
}

const round2 = (value: number) => Math.round(value * 100) / 100;

/**
 * A course is a list of items — every lecture and every quiz weighs the same. An item is done when the
 * student finished the lecture, or attempted the quiz. progress = done / total.
 * GPA is the average of the per-quiz average scores (retakes are averaged, not cherry-picked).
 * The course is complete at 100%; it earns a certificate when the GPA reaches PASS_GPA
 * (courses without quizzes have no grade to pass, so completing them is enough).
 *
 * Runs under a lock on the enrollment row, so the quiz endpoint, the lecture endpoint and a
 * concurrent retry cannot interleave their read-modify-write and issue two certificates.
 */
export async function recalculateProgress(studentId: number, courseId: number): Promise<ProgressSummary | null> {
  return withTransaction(
    async (conn) => {
      const [enrollment] = await conn.query<RowDataPacket[]>(
        "SELECT 1 FROM `join` WHERE `courseId` = ? AND `studentId` = ? FOR UPDATE",
        [courseId, studentId]
      );
      if (enrollment.length === 0) return null;

      const [counted] = await conn.query<RowDataPacket[]>(
        `SELECT
           (SELECT COUNT(*) FROM \`lecture\` l JOIN \`section\` s ON s.\`id\` = l.\`sectionId\` WHERE s.\`courseId\` = ?) AS lectures,
           (SELECT COUNT(*) FROM \`interact\` i JOIN \`lecture\` l ON l.\`id\` = i.\`lectureId\` JOIN \`section\` s ON s.\`id\` = l.\`sectionId\`
             WHERE s.\`courseId\` = ? AND i.\`studentId\` = ? AND i.\`completedAt\` IS NOT NULL) AS lecturesDone,
           (SELECT COUNT(*) FROM \`quiz\` q JOIN \`section\` s ON s.\`id\` = q.\`sectionId\` WHERE s.\`courseId\` = ?) AS quizzes,
           (SELECT COUNT(DISTINCT d.\`quizId\`) FROM \`dO\` d JOIN \`quiz\` q ON q.\`id\` = d.\`quizId\` JOIN \`section\` s ON s.\`id\` = q.\`sectionId\`
             WHERE s.\`courseId\` = ? AND d.\`studentId\` = ?) AS quizzesDone`,
        [courseId, courseId, studentId, courseId, courseId, studentId]
      );
      const c = counted[0];
      const total = Number(c.lectures) + Number(c.quizzes);
      const done = Number(c.lecturesDone) + Number(c.quizzesDone);
      const progress = total > 0 ? Math.round((100 * done) / total) : 0;
      const completed = total > 0 && done >= total;

      const [graded] = await conn.query<RowDataPacket[]>(
        `SELECT AVG(per_quiz.avgScore) AS gpa FROM (
           SELECT AVG(d.\`score\`) AS avgScore FROM \`dO\` d
             JOIN \`quiz\` q ON q.\`id\` = d.\`quizId\` JOIN \`section\` s ON s.\`id\` = q.\`sectionId\`
            WHERE s.\`courseId\` = ? AND d.\`studentId\` = ? GROUP BY d.\`quizId\`) per_quiz`,
        [courseId, studentId]
      );
      const gpa = graded[0].gpa === null ? null : round2(Number(graded[0].gpa));

      await conn.query(
        `UPDATE \`join\` SET \`progress\` = ?, \`GPA\` = ?,
                \`dateComplete\` = CASE WHEN ? THEN COALESCE(\`dateComplete\`, CURDATE()) ELSE NULL END
          WHERE \`courseId\` = ? AND \`studentId\` = ?`,
        [progress, gpa, completed ? 1 : 0, courseId, studentId]
      );
      await conn.query(
        `UPDATE \`student\` SET
           \`numberCoursesEnrolled\` = (SELECT COUNT(*) FROM \`join\` WHERE \`studentId\` = ?),
           \`numberCoursesCompleted\` = (SELECT COUNT(*) FROM \`join\` WHERE \`studentId\` = ? AND \`progress\` = 100)
         WHERE \`userId\` = ?`,
        [studentId, studentId, studentId]
      );

      const passed = Number(c.quizzes) === 0 || (gpa !== null && gpa >= PASS_GPA);
      const certificateCode = completed && passed ? await issueCertificate(conn, studentId, courseId, gpa) : null;

      return { progress, gpa, completed, certificateCode };
    },
    { isolation: "READ COMMITTED" }
  );
}

export interface LectureProgressResult {
  lectureId: number;
  positionSeconds: number;
  completed: boolean;
  /** present only when this call finished the lecture and the course totals were recomputed */
  course?: ProgressSummary | null;
}

/**
 * Called every few seconds while a video plays (just remembers the position) and once when the lecture ends.
 * Only the first completion triggers the heavier recalculation.
 * Note that completion is reported by the player: like most LMSs this trusts the client's "I finished it".
 */
export async function saveLectureProgress(studentId: number, lectureId: number, positionSeconds: number, completed: boolean): Promise<LectureProgressResult> {
  const [lectures] = await pool.query<RowDataPacket[]>(
    "SELECT s.`courseId` FROM `lecture` l JOIN `section` s ON s.`id` = l.`sectionId` WHERE l.`id` = ?",
    [lectureId]
  );
  if (!lectures[0]) throw notFound("Lecture not found");

  const [before] = await pool.query<RowDataPacket[]>(
    "SELECT `completedAt` IS NOT NULL AS done FROM `interact` WHERE `lectureId` = ? AND `studentId` = ?",
    [lectureId, studentId]
  );
  const alreadyDone = Boolean(before[0]?.done);

  await pool.query(
    `INSERT INTO \`interact\` (\`lectureId\`, \`studentId\`, \`positionSeconds\`, \`completedAt\`) VALUES (?, ?, ?, IF(?, NOW(), NULL))
     ON DUPLICATE KEY UPDATE \`positionSeconds\` = VALUES(\`positionSeconds\`), \`completedAt\` = COALESCE(\`completedAt\`, VALUES(\`completedAt\`))`,
    [lectureId, studentId, positionSeconds, completed ? 1 : 0]
  );

  const result: LectureProgressResult = { lectureId, positionSeconds, completed: alreadyDone || completed };
  if (completed && !alreadyDone) result.course = await recalculateProgress(studentId, lectures[0].courseId);
  return result;
}

export interface CourseProgress {
  courseId: number;
  progress: number;
  gpa: number | null;
  completed: boolean;
  passGpa: number;
  totals: { lectures: number; lecturesDone: number; quizzes: number; quizzesDone: number };
  sections: {
    id: number;
    name: string;
    lectures: { id: number; name: string; completed: boolean; positionSeconds: number }[];
    quizzes: { id: number; name: string; attemptsUsed: number; attemptsAllowed: number; bestScore: number | null }[];
  }[];
  /** the first thing the student has not done yet, in course order: lectures before the section's quiz */
  next: { type: "lecture" | "quiz"; id: number; name: string; sectionId: number; sectionName: string; positionSeconds: number } | null;
  certificate: { code: string; issuedAt: string } | null;
}

export async function getCourseProgress(studentId: number, courseId: number): Promise<CourseProgress> {
  const [enrollment] = await pool.query<RowDataPacket[]>(
    "SELECT `progress`, `GPA` FROM `join` WHERE `courseId` = ? AND `studentId` = ?",
    [courseId, studentId]
  );
  if (!enrollment[0]) throw notFound("You are not enrolled in this course");

  const [sections] = await pool.query<RowDataPacket[]>("SELECT `id`, `name` FROM `section` WHERE `courseId` = ? ORDER BY `id`", [courseId]);
  const [lectures] = await pool.query<RowDataPacket[]>(
    `SELECT l.\`id\`, l.\`name\`, l.\`sectionId\`, COALESCE(i.\`positionSeconds\`, 0) AS positionSeconds, (i.\`completedAt\` IS NOT NULL) AS completed
       FROM \`lecture\` l JOIN \`section\` s ON s.\`id\` = l.\`sectionId\`
       LEFT JOIN \`interact\` i ON i.\`lectureId\` = l.\`id\` AND i.\`studentId\` = ?
      WHERE s.\`courseId\` = ? ORDER BY l.\`sectionId\`, l.\`id\``,
    [studentId, courseId]
  );
  const [quizzes] = await pool.query<RowDataPacket[]>(
    `SELECT q.\`id\`, q.\`name\`, q.\`sectionId\`, q.\`attempt\` AS attemptsAllowed, COUNT(d.\`attemptOrder\`) AS attemptsUsed, MAX(d.\`score\`) AS bestScore
       FROM \`quiz\` q JOIN \`section\` s ON s.\`id\` = q.\`sectionId\`
       LEFT JOIN \`dO\` d ON d.\`quizId\` = q.\`id\` AND d.\`studentId\` = ?
      WHERE s.\`courseId\` = ? GROUP BY q.\`id\`, q.\`name\`, q.\`sectionId\`, q.\`attempt\` ORDER BY q.\`sectionId\`, q.\`id\``,
    [studentId, courseId]
  );
  const [certs] = await pool.query<RowDataPacket[]>(
    "SELECT `code`, DATE_FORMAT(`issueDate`, '%Y-%m-%d') AS issuedAt FROM `certification` WHERE `studentId` = ? AND `courseId` = ? AND `code` IS NOT NULL",
    [studentId, courseId]
  );

  const outline = sections.map((section) => ({
    id: section.id as number,
    name: section.name as string,
    lectures: lectures
      .filter((l) => l.sectionId === section.id)
      .map((l) => ({ id: l.id as number, name: l.name as string, completed: Boolean(l.completed), positionSeconds: Number(l.positionSeconds) })),
    quizzes: quizzes
      .filter((q) => q.sectionId === section.id)
      .map((q) => ({
        id: q.id as number,
        name: q.name as string,
        attemptsUsed: Number(q.attemptsUsed),
        attemptsAllowed: Number(q.attemptsAllowed),
        bestScore: q.bestScore === null ? null : Number(q.bestScore),
      })),
  }));

  let next: CourseProgress["next"] = null;
  for (const section of outline) {
    const lecture = section.lectures.find((l) => !l.completed);
    if (lecture) {
      next = { type: "lecture", id: lecture.id, name: lecture.name, sectionId: section.id, sectionName: section.name, positionSeconds: lecture.positionSeconds };
      break;
    }
    const quiz = section.quizzes.find((q) => q.attemptsUsed === 0);
    if (quiz) {
      next = { type: "quiz", id: quiz.id, name: quiz.name, sectionId: section.id, sectionName: section.name, positionSeconds: 0 };
      break;
    }
  }

  const lecturesDone = lectures.filter((l) => l.completed).length;
  const quizzesDone = quizzes.filter((q) => Number(q.attemptsUsed) > 0).length;
  const total = lectures.length + quizzes.length;

  return {
    courseId,
    progress: enrollment[0].progress,
    gpa: enrollment[0].GPA === null ? null : Number(enrollment[0].GPA),
    completed: total > 0 && lecturesDone + quizzesDone >= total,
    passGpa: PASS_GPA,
    totals: { lectures: lectures.length, lecturesDone, quizzes: quizzes.length, quizzesDone },
    sections: outline,
    next,
    certificate: certs[0] ? { code: certs[0].code, issuedAt: certs[0].issuedAt } : null,
  };
}
