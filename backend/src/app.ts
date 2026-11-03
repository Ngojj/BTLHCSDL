import { randomUUID } from "crypto";
import cors from "cors";
import express, { Express, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import pinoHttp from "pino-http";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { pool } from "./db/db";
import { logger } from "./lib/logger";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { loadOpenApiSpec } from "./docs/openapi";

import userRoutes from "./user/user.route";
import authRoutes from "./auth/auth.route";
import teacherRoutes from "./teacher/teacher.route";
import studentRoutes from "./student/student.route";
import courseRoutes from "./course/course.route";
import teacherQualificationRoutes from "./teacherQualification/teacherQualification.route";
import courseTopicRoutes from "./courseTopic/courseTopic.route";
import sectionRoutes from "./section/section.route";
import quizRoutes from "./quiz/quiz.route";
import questionRoutes from "./question/question.route";
import optionRoutes from "./option/option.route";
import roadMapRoutes from "./roadMap/roadMap.route";
import requireCourseRoutes from "./requireCourse/requireCourse.route";
import certificateRoutes from "./certificate/certificate.route";
import progressRoutes from "./progress/progress.route";
import joinRoutes from "./join/join.route";
import dORoutes from "./dO/dO.route";
import answerRecordRoutes from "./answerRecord/answerRecord.route";
import lectureRoutes from "./lecture/lecture.route";
import interactRoutes from "./interact/interact.route";
import includeCourseRoutes from "./includeCourse/includeCourse.route";
import viewRoadMapRoutes from "./viewRoadMap/viewRoadMap.route";
import paymentRoutes from "./payment/payment.route";
import analyticsRoutes from "./analytics/analytics.route";

/** `https://*.vercel.app` style wildcards are supported so preview deployments keep working. */
const escapeRegex = (text: string) => text.replace(/[.+?^$()|[\]\\{}]/g, "\\$&");

const originMatchers = env.corsOrigins.map((pattern) => {
  if (pattern === "*") return () => true;
  if (!pattern.includes("*")) return (origin: string) => origin === pattern;
  const regex = new RegExp(`^${escapeRegex(pattern).replace(/\*/g, "[^.]+")}$`);
  return (origin: string) => regex.test(origin);
});

const isOriginAllowed = (origin: string | undefined) => {
  if (!origin) return true; // curl, server-to-server, webhooks
  if (originMatchers.length === 0) return !env.isProduction; // open in dev, closed in prod until configured
  return originMatchers.some((match) => match(origin));
};

export function createApp(): Express {
  const app = express();

  if (env.isProduction) app.set("trust proxy", 1);
  app.disable("x-powered-by");

  app.use(
    pinoHttp({
      logger,
      genReqId: (req, res) => {
        const id = (req.headers["x-request-id"] as string) || randomUUID();
        res.setHeader("X-Request-Id", id);
        return id;
      },
      autoLogging: { ignore: (req) => req.url === "/health" },
    })
  );
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(cors({ origin: (origin, cb) => cb(null, isOriginAllowed(origin)) }));
  app.use(express.json({ limit: "1mb" }));

  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      limit: 300,
      standardHeaders: "draft-7",
      legacyHeaders: false,
      skip: () => env.isTest,
      message: { message: "Too many requests, please slow down" },
    })
  );

  app.get("/", (_req: Request, res: Response) => {
    res.json({ message: "Backend API is running", docs: "/docs", health: "/health" });
  });

  app.get("/health", async (_req: Request, res: Response) => {
    try {
      await pool.query("SELECT 1");
      res.json({ status: "ok", uptime: Math.round(process.uptime()), database: "up" });
    } catch {
      res.status(503).json({ status: "degraded", database: "down" });
    }
  });

  const spec = loadOpenApiSpec();
  app.get("/docs.json", (_req, res) => res.json(spec));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec, { customSiteTitle: "BK E-Learning API" }));

  app.use("/user", userRoutes);
  app.use("/student", studentRoutes);
  app.use("/teacher", teacherRoutes);
  app.use("/auth", authRoutes);
  app.use("/course", courseRoutes);
  app.use("/teacherQualification", teacherQualificationRoutes);
  app.use("/courseTopic", courseTopicRoutes);
  app.use("/section", sectionRoutes);
  app.use("/quiz", quizRoutes);
  app.use("/question", questionRoutes);
  app.use("/option", optionRoutes);
  app.use("/roadMap", roadMapRoutes);
  app.use("/requireCourse", requireCourseRoutes);
  app.use("/certificate", certificateRoutes);
  app.use("/progress", progressRoutes);
  app.use("/join", joinRoutes);
  app.use("/dO", dORoutes);
  app.use("/answerRecord", answerRecordRoutes);
  app.use("/lecture", lectureRoutes);
  app.use("/interact", interactRoutes);
  app.use("/includeCourse", includeCourseRoutes);
  app.use("/viewRoadMap", viewRoadMapRoutes);
  app.use("/payment", paymentRoutes);
  app.use("/analytics", analyticsRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
