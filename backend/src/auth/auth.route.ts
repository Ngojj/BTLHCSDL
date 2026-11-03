import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { env } from "../config/env";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import authController from "./auth.controller";
import studentController from "../student/student.controller";
import teacherController from "../teacher/teacher.controller";

const router = Router();

// brute-force protection: 20 attempts per 15 minutes per IP on anything that checks or creates credentials
const credentialsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: () => env.isTest,
  message: { message: "Too many attempts, try again in a few minutes" },
});

const registerSchema = z.object({
  firstName: z.string().trim().min(1).max(255),
  lastName: z.string().trim().min(1).max(255),
  username: z.string().trim().min(4, "Username must be at least 4 characters").max(64).regex(/^\w+$/, "Username may contain only letters, numbers and underscores"),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  email: z.string().trim().email().max(255),
  bankName: z.string().trim().min(1).max(20),
  bankAccount: z.coerce.string().trim().min(1).max(64),
});

const loginSchema = z.object({ username: z.string().min(1).max(64), password: z.string().min(1).max(72) });

const googleSchema = z.object({
  token: z.string().min(1),
  role: z.string().default("student").transform((r) => r.toLowerCase()).pipe(z.enum(["student", "teacher"])),
});

// Who is this token? Lets other services (e.g. the frontend's upload route) ask this API instead of sharing the JWT secret.
router.get("/me", authenticate, (req, res) => {
  const { sub, role, firstName, lastName, email } = req.user!;
  res.json({ id: sub, role, firstName, lastName, email });
});

router.post("/login", credentialsLimiter, validate({ body: loginSchema }), authController.login as any);
router.post("/google-login", credentialsLimiter, validate({ body: googleSchema }), authController.googleLogin as any);
router.post("/register-as-student", credentialsLimiter, validate({ body: registerSchema }), studentController.createNewStudent as any);
router.post("/register-as-teacher", credentialsLimiter, validate({ body: registerSchema }), teacherController.createNewTeacher as any);

export default router;
