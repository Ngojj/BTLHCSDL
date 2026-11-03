import { defineConfig } from "vitest/config";
import { testDb } from "./tests/testEnv";

// Integration tests run against a real MySQL (default: localhost:3306, database "bk_test",
// recreated from migrations/ on every run). Override with TEST_DB_HOST / _PORT / _USER / _PASSWORD / _NAME.
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    globalSetup: ["tests/globalSetup.ts"],
    setupFiles: ["tests/setup.ts"],
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 60_000,
    env: {
      NODE_ENV: "test",
      TOKEN_SECRET: "test-secret-at-least-16-chars",
      DATABASE_HOST: testDb.host,
      DATABASE_PORT: String(testDb.port),
      DATABASE_USER: testDb.user,
      DATABASE_PASSWORD: testDb.password,
      DATABASE: testDb.database,
      CORS_ORIGIN: "http://localhost:3000,https://*.vercel.app",
      FRONTEND_URL: "http://localhost:3000",
    },
  },
});
