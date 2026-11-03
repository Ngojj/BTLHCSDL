import { Router } from "express";
import answerRecordController from "./answerRecord.controller";
import { asUser, asStudent, selfOrTeacher, bindIdentity } from "../middleware/auth";
const router = Router();

router.get('/question/:questionId/student/:studentId', asUser, selfOrTeacher("studentId"), answerRecordController.getRecordByquestionIdAndStudentId as any);
router.get('/quiz/:quizId/student/:studentId', asUser, selfOrTeacher("studentId"), answerRecordController.getRecordByQuizIdAndStudentId as any);
router.post('/create', asStudent, bindIdentity("studentId"), answerRecordController.createRecord as any);
router.patch('/update', asStudent, bindIdentity("studentId"), answerRecordController.updateRecord as any);
router.delete('/delete', asStudent, bindIdentity("studentId"), answerRecordController.deleteRecord as any);

export default router;