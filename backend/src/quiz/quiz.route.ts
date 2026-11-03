import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/errors";
import { validate } from "../middleware/validate";
import { getReview, submitAttempt } from "./quiz.attempt";
import quizController from "./quiz.controller";
import { asUser, asTeacher, asStudent, bindIdentity } from "../middleware/auth";
import { owns, canViewContent } from "../middleware/access";
const router = Router();

// get all quizzes
router.get('/', asTeacher, quizController.getAllQuiz as any);

// get quiz by id
router.get('/id/:id', asUser, canViewContent("quiz", "params.id"), quizController.getQuizById as any);

// get quiz by name
router.get('/name/:name', asTeacher, quizController.getQuizByName as any);

// get quiz by section id
router.get('/section/:sectionId', asUser, canViewContent("section", "params.sectionId"), quizController.getQuizBySectionId as any);

// create new quiz
router.post('/create', asTeacher, owns("section", "body.sectionId"), bindIdentity("teacherId"), quizController.createQuiz as any);

// update quiz
router.patch('/update', asTeacher, owns("quiz", "body.id"), quizController.updateQuiz as any);

// delete quiz by id
router.delete('/delete/id/:id', asTeacher, owns("quiz", "params.id"), quizController.deleteQuizById as any);

const quizIdParam = z.object({ quizId: z.coerce.number().int().positive() });

// Server-side grading: the client sends its choices, never a score.
router.post(
  "/:quizId/submit",
  asStudent,
  validate({
    params: quizIdParam,
    body: z.object({ answers: z.record(z.string(), z.string().max(2000)) }),
  }),
  asyncHandler(async (req, res) => {
    res.status(200).json(await submitAttempt(req.user!.sub, Number(req.params.quizId), req.body.answers));
  })
);

// Review of the latest attempt; correct answers appear only after the last attempt is used.
router.get(
  "/:quizId/review",
  asStudent,
  validate({ params: quizIdParam }),
  canViewContent("quiz", "params.quizId"),
  asyncHandler(async (req, res) => {
    res.json(await getReview(req.user!.sub, Number(req.params.quizId)));
  })
);

export default router;