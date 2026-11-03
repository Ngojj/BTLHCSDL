import { createServer } from "http";
import { createApp } from "./src/app";
import { env } from "./src/config/env";
import { pool } from "./src/db/db";
import { runMigrations } from "./src/db/migrate";
import { logger } from "./src/lib/logger";

if (env.TOKEN_SECRET.length < 16) {
  logger.warn("TOKEN_SECRET is shorter than 16 characters; use a long random value in production");
}

const server = createServer(createApp());

const start = async () => {
  if (env.RUN_MIGRATIONS === "true") {
    const applied = await runMigrations(pool, (message) => logger.info(`migration: ${message}`));
    logger.info(applied.length ? `${applied.length} migration(s) applied` : "database schema is up to date");
  }
  server.listen(env.PORT, () => {
    logger.info(`Server is running at http://localhost:${env.PORT} (docs: /docs)`);
  });
};

start().catch((error) => {
  logger.fatal({ err: error }, "failed to start");
  process.exit(1);
});

const shutdown = (signal: string) => {
  logger.info(`${signal} received, shutting down`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
