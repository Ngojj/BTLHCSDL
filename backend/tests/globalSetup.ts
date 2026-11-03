import mysql from "mysql2/promise";
import { runMigrations } from "../src/db/migrate";
import { testDb } from "./testEnv";

/** Recreates the test database from the migration files so tests always start from the real schema (triggers included). */
export default async function setup() {
  const admin = await mysql.createConnection({ host: testDb.host, port: testDb.port, user: testDb.user, password: testDb.password });
  await admin.query(`DROP DATABASE IF EXISTS \`${testDb.database}\``);
  await admin.query(`CREATE DATABASE \`${testDb.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await admin.end();

  const pool = mysql.createPool({ ...testDb, connectionLimit: 2 });
  await runMigrations(pool);
  await pool.end();
}
