import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/errors";
import { asTeacher } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { teacherOverview } from "./analytics.service";

const router = Router();

router.get(
  "/teacher/overview",
  asTeacher,
  validate({ query: z.object({ months: z.coerce.number().int().min(1).max(36).default(12) }) }),
  asyncHandler(async (req, res) => {
    res.json(await teacherOverview(req.user!.sub, Number(req.query.months)));
  })
);

export default router;
