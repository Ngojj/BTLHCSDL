import { Router } from "express";
import dOController from "./dO.controller";
import { asUser, selfOrTeacher } from "../middleware/auth";

const router = Router();

router.get(`/quiz/:quizId/student/:studentId`, asUser, selfOrTeacher("studentId"), dOController.getDOByQuizIdAndStudentId as any);
router.get(`/quiz/:quizId/student/:studentId/attemptOrder/:attemptOrder`, asUser, selfOrTeacher("studentId"), dOController.getDOByQuizIdAndStudentIdAndAttemptOrder as any);

export default router;