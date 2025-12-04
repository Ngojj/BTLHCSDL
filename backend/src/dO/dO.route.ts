import { Router } from "express";
import dOController from "./dO.controller";

const router = Router();

router.get(`/quiz/:quizId/student/:studentId`, dOController.getDOByQuizIdAndStudentId as any)
router.get(`/quiz/:quizId/student/:studentId/attemptOrder/:attemptOrder`, dOController.getDOByQuizIdAndStudentIdAndAttemptOrder as any)
router.post(`/create`, dOController.createDO as any)

export default router;