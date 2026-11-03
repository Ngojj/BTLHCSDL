import type { RowDataPacket } from "mysql2/promise";
import { pool, withTransaction } from "../db/db";
import { conflict, forbidden, notFound } from "../lib/errors";
import { recalculateProgress } from "../progress/progress.service";

const normalize = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase();

/** Multiple choice must match exactly; fill-in-the-blank ignores case and extra whitespace. */
export const isCorrect = (type: string, given: string | undefined, expected: string) => {
  if (given === undefined) return false;
  return type === "multiple choice" ? given === expected : normalize(given) === normalize(expected);
};

export const toScore = (correct: number, total: number) => (total === 0 ? 0 : Math.round((correct / total) * 1000) / 100);

export interface AttemptResult {
  quizId: number;
  attemptOrder: number;
  score: number;
  correct: number;
  total: number;
  remainingAttempts: number;
}

/**
 * Grades a submission on the server. The client only ever sends what the student chose; the correct
 * answers never leave the database, and the score cannot be forged.
 * Everything happens in one transaction, and the enrollment row is locked so two parallel submissions
 * of the same student cannot both slip through the attempt limit.
 */
export async function submitAttempt(studentId: number, quizId: number, answers: Record<string, string>): Promise<AttemptResult> {
  const result = await withTransaction(async (conn) => {
    const [quizzes] = await conn.query<RowDataPacket[]>(
      "SELECT q.`id`, q.`state`, q.`attempt`, s.`courseId` FROM `quiz` q JOIN `section` s ON s.`id` = q.`sectionId` WHERE q.`id` = ?",
      [quizId]
    );
    const quiz = quizzes[0];
    if (!quiz) throw notFound("Quiz not found");
    if (String(quiz.state).toLowerCase() === "closed") throw conflict("This quiz is closed");

    const [enrollment] = await conn.query<RowDataPacket[]>(
      "SELECT 1 FROM `join` WHERE `courseId` = ? AND `studentId` = ? FOR UPDATE",
      [quiz.courseId, studentId]
    );
    if (enrollment.length === 0) throw forbidden("Enroll in this course to take the quiz");

    const [counted] = await conn.query<RowDataPacket[]>(
      "SELECT COUNT(*) AS used FROM `dO` WHERE `quizId` = ? AND `studentId` = ?",
      [quizId, studentId]
    );
    const used = Number(counted[0].used);
    if (used >= quiz.attempt) throw conflict("No attempts left for this quiz");

    const [questions] = await conn.query<RowDataPacket[]>(
      "SELECT `id`, `type`, `answer` FROM `question` WHERE `quizId` = ?",
      [quizId]
    );
    if (questions.length === 0) throw conflict("This quiz has no questions yet");

    const correct = questions.filter((q) => isCorrect(q.type, answers[String(q.id)], q.answer)).length;
    const score = toScore(correct, questions.length);
    const attemptOrder = used + 1;

    await conn.query("INSERT INTO `dO` (`quizId`, `studentId`, `score`, `attemptOrder`) VALUES (?, ?, ?, ?)", [
      quizId,
      studentId,
      score,
      attemptOrder,
    ]);

    // keep the answers of the latest attempt so the student can review them
    await conn.query("DELETE FROM `answerRecord` WHERE `quizId` = ? AND `studentId` = ?", [quizId, studentId]);
    for (const q of questions) {
      const given = answers[String(q.id)];
      if (given === undefined) continue;
      await conn.query(
        "INSERT INTO `answerRecord` (`quizId`, `studentId`, `questionId`, `studentAns`) VALUES (?, ?, ?, ?)",
        [quizId, studentId, q.id, given]
      );
    }

    return {
      quizId,
      attemptOrder,
      score,
      correct,
      total: questions.length,
      remainingAttempts: quiz.attempt - attemptOrder,
      courseId: quiz.courseId as number,
    };
  }, { isolation: "READ COMMITTED" });

  // derived figures are refreshed after the commit; a failure here must not lose the attempt
  try {
    await recalculateProgress(studentId, result.courseId);
    await pool.query(
      `UPDATE \`course\` c SET c.\`avgQuiz\` = COALESCE((
         SELECT ROUND(AVG(d.\`score\`)) FROM \`dO\` d
         JOIN \`quiz\` q ON q.\`id\` = d.\`quizId\` JOIN \`section\` s ON s.\`id\` = q.\`sectionId\`
         WHERE s.\`courseId\` = c.\`id\`), 0)
       WHERE c.\`id\` = ?`,
      [result.courseId]
    );
  } catch (error) {
    console.error("failed to refresh progress after quiz attempt", error);
  }

  const { courseId: _courseId, ...attempt } = result;
  return attempt;
}

/**
 * What the student answered in the latest attempt and whether it was right.
 * The correct answers are only revealed once the student has no attempts left.
 */
export async function getReview(studentId: number, quizId: number) {
  const [quizzes] = await pool.query<RowDataPacket[]>("SELECT `attempt` FROM `quiz` WHERE `id` = ?", [quizId]);
  if (!quizzes[0]) throw notFound("Quiz not found");

  const [attempts] = await pool.query<RowDataPacket[]>(
    "SELECT `score`, `attemptOrder` FROM `dO` WHERE `quizId` = ? AND `studentId` = ? ORDER BY `attemptOrder` DESC",
    [quizId, studentId]
  );
  if (attempts.length === 0) throw notFound("You have not attempted this quiz yet");

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT qu.\`id\`, qu.\`type\`, qu.\`content\`, qu.\`answer\`, ar.\`studentAns\`
       FROM \`question\` qu
       LEFT JOIN \`answerRecord\` ar ON ar.\`questionId\` = qu.\`id\` AND ar.\`quizId\` = qu.\`quizId\` AND ar.\`studentId\` = ?
      WHERE qu.\`quizId\` = ? ORDER BY qu.\`id\``,
    [studentId, quizId]
  );

  const reveal = attempts.length >= quizzes[0].attempt;
  return {
    quizId,
    latestScore: attempts[0].score as number,
    attempts: { used: attempts.length, allowed: quizzes[0].attempt as number },
    answersRevealed: reveal,
    questions: rows.map((row) => ({
      id: row.id as number,
      type: row.type as string,
      content: row.content as string,
      studentAnswer: (row.studentAns as string | null) ?? null,
      isCorrect: isCorrect(row.type, row.studentAns ?? undefined, row.answer),
      ...(reveal ? { correctAnswer: row.answer as string } : {}),
    })),
  };
}
