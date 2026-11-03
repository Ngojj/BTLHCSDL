import dotenv from "dotenv";
import { z } from "zod";

// .env.local (gitignored) overrides .env, so local dev never touches production credentials
dotenv.config({ path: [".env.local", ".env"] });

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  TOKEN_SECRET: z.string().min(1, "TOKEN_SECRET is required"),
  DATABASE_HOST: z.string().default("localhost"),
  DATABASE_PORT: z.coerce.number().int().positive().default(3306),
  DATABASE_USER: z.string().default("root"),
  DATABASE_PASSWORD: z.string().default(""),
  DATABASE: z.string().min(1, "DATABASE is required"),
  DATABASE_SSL: z.enum(["true", "false"]).default("false"),
  // apply pending migrations/*.sql when the server boots (handy on hosts without a release command)
  RUN_MIGRATIONS: z.enum(["true", "false"]).default("false"),
  CORS_ORIGIN: z.string().default(""),
  FRONTEND_URL: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().default(""),
  PAYOS_CLIENT_ID: z.string().default(""),
  PAYOS_API_KEY: z.string().default(""),
  PAYOS_CHECKSUM_KEY: z.string().default(""),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const problems = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
  throw new Error(`Invalid environment configuration:\n${problems}`);
}

const raw = parsed.data;

const corsOrigins = raw.CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean);

export const env = {
  ...raw,
  isProduction: raw.NODE_ENV === "production",
  isTest: raw.NODE_ENV === "test",
  corsOrigins,
  // where PayOS sends the user back to; first concrete CORS origin when not set explicitly
  frontendUrl:
    raw.FRONTEND_URL ?? corsOrigins.find((o) => o !== "*" && !o.includes("*")) ?? "http://localhost:3000",
  logLevel: raw.LOG_LEVEL ?? (raw.NODE_ENV === "test" ? "silent" : "info"),
};
