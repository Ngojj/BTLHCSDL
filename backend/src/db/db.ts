import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import dotenv from "dotenv";

dotenv.config();

// Tạo connection pool chung cho cả Drizzle ORM và raw SQL queries (stored procedures/functions)
export const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  port: Number(process.env.DATABASE_PORT) || 3306,
  connectionLimit: 10,
});

// Export drizzle instance để dùng ORM
export const db = drizzle(pool);
