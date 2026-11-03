import fs from "fs";
import path from "path";
import type { Pool } from "mysql2/promise";

const MIGRATIONS_DIR = path.resolve(process.cwd(), "migrations");

/**
 * Splits a .sql migration into statements. Understands `DELIMITER`, drizzle's
 * `--> statement-breakpoint` markers and `--` comments, and keeps trigger bodies intact.
 */
export function splitStatements(sql: string): string[] {
  const statements: string[] = [];
  let delimiter = ";";
  let buffer = "";

  for (const sourceLine of sql.replace(/\r\n/g, "\n").split("\n")) {
    // drizzle sometimes puts the marker right after the semicolon on the same line
    const rawLine = sourceLine.replace(/--> statement-breakpoint\s*$/, "");
    const line = rawLine.trim();
    if (line.startsWith("-->") || (line.startsWith("--") && buffer.trim() === "")) continue;

    const delimiterCommand = line.match(/^DELIMITER\s+(\S+)$/i);
    if (delimiterCommand) {
      delimiter = delimiterCommand[1];
      continue;
    }

    buffer += `${rawLine}\n`;
    if (line.endsWith(delimiter)) {
      const statement = buffer.trim().slice(0, -delimiter.length).trim();
      if (statement) statements.push(statement);
      buffer = "";
    }
  }
  if (buffer.trim()) statements.push(buffer.trim());
  return statements;
}

/** Applies every pending migrations/*.sql file once, in filename order. Safe to re-run. */
export async function runMigrations(pool: Pool, log: (message: string) => void = () => {}) {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS `__migrations` (`name` varchar(255) PRIMARY KEY, `appliedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP)"
  );
  const [done] = await pool.query<any[]>("SELECT name FROM `__migrations`");
  const applied = new Set(done.map((row) => row.name));

  const files = fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql")).sort();
  const ran: string[] = [];

  for (const file of files) {
    if (applied.has(file)) continue;
    const statements = splitStatements(fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8"));
    for (const statement of statements) await pool.query(statement);
    await pool.query("INSERT INTO `__migrations` (name) VALUES (?)", [file]);
    log(`applied ${file} (${statements.length} statements)`);
    ran.push(file);
  }
  return ran;
}
