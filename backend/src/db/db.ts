import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { env } from "../config/env";

// One pool shared by Drizzle and raw SQL (analytics / transactions)
export const pool = mysql.createPool({
  host: env.DATABASE_HOST,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE,
  port: env.DATABASE_PORT,
  connectionLimit: 10,
  ssl: env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  charset: "utf8mb4",
});

export const db = drizzle(pool);

export type DbExecutor = Pick<mysql.Pool | mysql.PoolConnection, "query" | "execute">;

/**
 * Runs `fn` in a transaction; rolls back on any thrown error.
 * Callers that take a row lock first and then read (attempt limits, payment settlement) use READ COMMITTED:
 * under the default REPEATABLE READ the snapshot is fixed at the first plain read, so a waiter would
 * keep seeing the data from before the lock holder committed.
 */
export async function withTransaction<T>(
  fn: (conn: mysql.PoolConnection) => Promise<T>,
  options: { isolation?: "READ COMMITTED" } = {}
): Promise<T> {
  const conn = await pool.getConnection();
  try {
    if (options.isolation) await conn.query(`SET TRANSACTION ISOLATION LEVEL ${options.isolation}`);
    await conn.beginTransaction();
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}
