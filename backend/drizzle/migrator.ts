import { migrate } from "drizzle-orm/mysql2/migrator";
import { db } from "../src/db/db";
import path from "path";

async function main() {
  try {
    await migrate(db, {
      migrationsFolder: path.resolve("drizzle"),
    });
    console.log("Migrations completed!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed!", err);
    process.exit(1);
  }
}

main();
