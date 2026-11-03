import { pool } from "../src/db/db";
import { runMigrations } from "../src/db/migrate";

async function main() {
  try {
    const ran = await runMigrations(pool, (message) => console.log(message));
    console.log(ran.length ? "Migrations completed!" : "Database is up to date.");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed!", err);
    process.exit(1);
  }
}

main();
