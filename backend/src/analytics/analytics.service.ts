import type { RowDataPacket } from "mysql2/promise";
import { pool } from "../db/db";

const num = (value: unknown) => (value === null || value === undefined ? 0 : Number(value));

/**
 * Everything the teacher dashboard needs, computed in the database.
 * Uses a recursive CTE for a gap-free month series, LAG() for month-over-month growth and
 * RANK() for ranking courses by revenue — instead of shipping every row to the browser and summing there.
 */
export async function teacherOverview(teacherId: number, months: number) {
  const [totalsRows] = await pool.query<RowDataPacket[]>(
    `SELECT
       (SELECT COUNT(*) FROM \`course\` WHERE \`teacherId\` = ?) AS courses,
       COUNT(j.\`studentId\`) AS enrollments,
       COUNT(DISTINCT j.\`studentId\`) AS students,
       COALESCE(SUM(c.\`price\`), 0) AS revenue,
       COALESCE(SUM(j.\`progress\` = 100), 0) AS completed,
       COALESCE(ROUND(AVG(j.\`progress\`)), 0) AS avgProgress
     FROM \`course\` c
     JOIN \`join\` j ON j.\`courseId\` = c.\`id\`
     WHERE c.\`teacherId\` = ?`,
    [teacherId, teacherId]
  );

  const [scoreTotals] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS attempts, ROUND(AVG(d.\`score\`), 2) AS avgScore
       FROM \`dO\` d JOIN \`quiz\` q ON q.\`id\` = d.\`quizId\`
       JOIN \`section\` s ON s.\`id\` = q.\`sectionId\` JOIN \`course\` c ON c.\`id\` = s.\`courseId\`
      WHERE c.\`teacherId\` = ?`,
    [teacherId]
  );

  const [monthRows] = await pool.query<RowDataPacket[]>(
    `WITH RECURSIVE m (month_start, n) AS (
         SELECT DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL ? MONTH), 1
         UNION ALL
         SELECT DATE_ADD(month_start, INTERVAL 1 MONTH), n + 1 FROM m WHERE n < ?
       ),
       rev AS (
         SELECT DATE_FORMAT(j.\`dateStart\`, '%Y-%m-01') AS month_start,
                SUM(c.\`price\`) AS revenue, COUNT(*) AS enrollments
           FROM \`join\` j JOIN \`course\` c ON c.\`id\` = j.\`courseId\`
          WHERE c.\`teacherId\` = ?
          GROUP BY 1
       )
     SELECT DATE_FORMAT(m.month_start, '%Y-%m') AS month,
            COALESCE(rev.revenue, 0) AS revenue,
            COALESCE(rev.enrollments, 0) AS enrollments,
            LAG(COALESCE(rev.revenue, 0)) OVER (ORDER BY m.month_start) AS previousRevenue
       FROM m LEFT JOIN rev ON rev.month_start = DATE_FORMAT(m.month_start, '%Y-%m-01')
      ORDER BY m.month_start`,
    [months - 1, months, teacherId]
  );

  const [courseRows] = await pool.query<RowDataPacket[]>(
    `SELECT c.\`id\` AS courseId, c.\`name\`, c.\`price\`,
            COUNT(j.\`studentId\`) AS students,
            COUNT(j.\`studentId\`) * c.\`price\` AS revenue,
            COALESCE(ROUND(100 * SUM(j.\`progress\` = 100) / NULLIF(COUNT(j.\`studentId\`), 0)), 0) AS completionRate,
            qs.avgScore,
            RANK() OVER (ORDER BY COUNT(j.\`studentId\`) * c.\`price\` DESC) AS revenueRank
       FROM \`course\` c
       LEFT JOIN \`join\` j ON j.\`courseId\` = c.\`id\`
       LEFT JOIN (
            SELECT s.\`courseId\`, ROUND(AVG(d.\`score\`), 2) AS avgScore
              FROM \`dO\` d JOIN \`quiz\` q ON q.\`id\` = d.\`quizId\` JOIN \`section\` s ON s.\`id\` = q.\`sectionId\`
             GROUP BY s.\`courseId\`
       ) qs ON qs.\`courseId\` = c.\`id\`
      WHERE c.\`teacherId\` = ?
      GROUP BY c.\`id\`, c.\`name\`, c.\`price\`, qs.avgScore
      ORDER BY revenueRank, c.\`id\``,
    [teacherId]
  );

  const [scoreRows] = await pool.query<RowDataPacket[]>(
    `SELECT LEAST(GREATEST(FLOOR(d.\`score\`), 4), 10) AS bucket, COUNT(*) AS count
       FROM \`dO\` d JOIN \`quiz\` q ON q.\`id\` = d.\`quizId\`
       JOIN \`section\` s ON s.\`id\` = q.\`sectionId\` JOIN \`course\` c ON c.\`id\` = s.\`courseId\`
      WHERE c.\`teacherId\` = ? GROUP BY bucket`,
    [teacherId]
  );

  const [progressRows] = await pool.query<RowDataPacket[]>(
    `SELECT LEAST(FLOOR(j.\`progress\` / 20), 5) AS bucket, COUNT(*) AS count
       FROM \`join\` j JOIN \`course\` c ON c.\`id\` = j.\`courseId\`
      WHERE c.\`teacherId\` = ? GROUP BY bucket`,
    [teacherId]
  );

  const [activityRows] = await pool.query<RowDataPacket[]>(
    `(SELECT 'enroll' AS type, j.\`dateStart\` AS at, CONCAT(u.\`firstName\`, ' ', u.\`lastName\`) AS student, c.\`name\` AS course
        FROM \`join\` j JOIN \`course\` c ON c.\`id\` = j.\`courseId\` JOIN \`user\` u ON u.\`id\` = j.\`studentId\`
       WHERE c.\`teacherId\` = ?)
     UNION ALL
     (SELECT 'complete', j.\`dateComplete\`, CONCAT(u.\`firstName\`, ' ', u.\`lastName\`), c.\`name\`
        FROM \`join\` j JOIN \`course\` c ON c.\`id\` = j.\`courseId\` JOIN \`user\` u ON u.\`id\` = j.\`studentId\`
       WHERE c.\`teacherId\` = ? AND j.\`dateComplete\` IS NOT NULL)
     ORDER BY at DESC LIMIT 10`,
    [teacherId, teacherId]
  );

  const totals = totalsRows[0];
  const byScore = new Map(scoreRows.map((r) => [num(r.bucket), num(r.count)]));
  const byProgress = new Map(progressRows.map((r) => [num(r.bucket), num(r.count)]));

  const revenueByMonth = monthRows.map((row) => {
    const revenue = num(row.revenue);
    const previous = row.previousRevenue === null ? null : num(row.previousRevenue);
    return {
      month: row.month as string,
      revenue,
      enrollments: num(row.enrollments),
      // null when there is no previous month to compare with (first month, or previous month was zero)
      growthPct: previous ? Math.round(((revenue - previous) / previous) * 1000) / 10 : null,
    };
  });

  const best = revenueByMonth.reduce((top, row) => (row.revenue > (top?.revenue ?? 0) ? row : top), null as null | (typeof revenueByMonth)[number]);

  return {
    months,
    totals: {
      courses: num(totals.courses),
      enrollments: num(totals.enrollments),
      students: num(totals.students),
      revenue: num(totals.revenue),
      completed: num(totals.completed),
      avgProgress: num(totals.avgProgress),
      quizAttempts: num(scoreTotals[0].attempts),
      avgQuizScore: scoreTotals[0].avgScore === null ? null : num(scoreTotals[0].avgScore),
    },
    revenueByMonth,
    bestMonth: best ? { month: best.month, revenue: best.revenue } : null,
    courses: courseRows.map((r) => ({
      courseId: num(r.courseId),
      name: r.name as string,
      price: num(r.price),
      students: num(r.students),
      revenue: num(r.revenue),
      completionRate: num(r.completionRate),
      avgScore: r.avgScore === null ? null : num(r.avgScore),
      revenueRank: num(r.revenueRank),
    })),
    scoreDistribution: [4, 5, 6, 7, 8, 9, 10].map((bucket) => ({ bucket: bucket === 4 ? "<5" : String(bucket), count: byScore.get(bucket) ?? 0 })),
    progressDistribution: [0, 1, 2, 3, 4, 5].map((bucket) => ({ from: bucket * 20, count: byProgress.get(bucket) ?? 0 })),
    recentActivity: activityRows.map((r) => ({ type: r.type as string, at: r.at as string | Date, student: r.student as string, course: r.course as string })),
  };
}
