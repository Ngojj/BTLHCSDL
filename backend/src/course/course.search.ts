import { z } from "zod";
import { pool } from "../db/db";

export const searchQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  language: z.string().trim().max(50).optional(),
  teacherId: z.coerce.number().int().positive().optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  sort: z.enum(["newest", "popular", "rating", "price_asc", "price_desc"]).default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

// whitelist: the sort key is interpolated into SQL, so it must never come from the client verbatim
const ORDER_BY: Record<SearchQuery["sort"], string> = {
  newest: "c.`creTime` DESC, c.`id` DESC",
  popular: "students DESC, c.`id` DESC",
  rating: "c.`avgQuiz` DESC, students DESC, c.`id` DESC",
  price_asc: "c.`price` ASC, c.`id` ASC",
  price_desc: "c.`price` DESC, c.`id` DESC",
};

const escapeLike = (text: string) => text.replace(/[\\%_]/g, "\\$&");

/** Server-side catalog search with filters, sorting and pagination. Field names match the course list DTO. */
export async function searchCourses(query: SearchQuery) {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (query.q) {
    const like = `%${escapeLike(query.q)}%`;
    conditions.push("(c.`name` LIKE ? OR c.`description` LIKE ? OR CONCAT(u.`firstName`, ' ', u.`lastName`) LIKE ?)");
    params.push(like, like, like);
  }
  if (query.language) {
    conditions.push("c.`language` = ?");
    params.push(query.language);
  }
  if (query.teacherId) {
    conditions.push("c.`teacherId` = ?");
    params.push(query.teacherId);
  }
  if (query.minPrice !== undefined) {
    conditions.push("c.`price` >= ?");
    params.push(query.minPrice);
  }
  if (query.maxPrice !== undefined) {
    conditions.push("c.`price` <= ?");
    params.push(query.maxPrice);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const from = "FROM `course` c JOIN `user` u ON u.`id` = c.`teacherId`";

  const [[counted]] = (await pool.query(`SELECT COUNT(*) AS total ${from} ${where}`, params)) as any;
  const total = Number(counted.total);

  const [rows] = await pool.query(
    `SELECT c.\`id\` AS courseId, c.\`name\` AS courseName, c.\`description\`, c.\`language\` AS languege,
            c.\`creTime\` AS creationTime, c.\`price\`, c.\`avgQuiz\`, c.\`teacherId\`,
            u.\`firstName\` AS teacherFirstName, u.\`lastName\` AS teacherLastName,
            (SELECT COUNT(*) FROM \`join\` j WHERE j.\`courseId\` = c.\`id\`) AS students
       ${from} ${where}
      ORDER BY ${ORDER_BY[query.sort]}
      LIMIT ? OFFSET ?`,
    [...params, query.limit, (query.page - 1) * query.limit]
  );

  return {
    data: rows,
    pagination: { page: query.page, limit: query.limit, total, totalPages: Math.max(1, Math.ceil(total / query.limit)) },
  };
}
