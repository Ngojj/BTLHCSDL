import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/errors";
import { canViewContent } from "../middleware/access";
import { asStudent } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { getCourseProgress, saveLectureProgress } from "./progress.service";

const router = Router();

// Outline of an enrolled course with the student's progress and the next thing to do.
router.get(
  "/course/:courseId",
  asStudent,
  validate({ params: z.object({ courseId: z.coerce.number().int().positive() }) }),
  canViewContent("course", "params.courseId"),
  asyncHandler(async (req, res) => {
    res.json(await getCourseProgress(req.user!.sub, Number(req.params.courseId)));
  })
);

// The player reports where the student is (every few seconds) and when the lecture is finished.
router.put(
  "/lecture/:lectureId",
  asStudent,
  validate({
    params: z.object({ lectureId: z.coerce.number().int().positive() }),
    body: z.object({
      positionSeconds: z.coerce.number().int().min(0).max(172_800),
      completed: z.boolean().default(false),
    }),
  }),
  canViewContent("lecture", "params.lectureId"),
  asyncHandler(async (req, res) => {
    res.json(await saveLectureProgress(req.user!.sub, Number(req.params.lectureId), req.body.positionSeconds, req.body.completed));
  })
);

export default router;
