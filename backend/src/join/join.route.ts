import { Router } from "express";
import joinController from './join.controller';
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.get('/', verifyToken as any, joinController.getJoins as any);
router.get('/courseId/:courseId/studentId/:studentId', verifyToken as any, joinController.getJoinById as any);
router.get('/courseId/:courseId', verifyToken as any, joinController.getJoinByCourseId as any);
router.get('/studentId/:studentId', verifyToken as any, joinController.getJoinByStudentId as any);
router.get('/teacherId/:teacherId', verifyToken as any, joinController.getJoinByTeacherId as any);
router.post('/create', verifyToken as any, joinController.createJoin as any);
router.patch('/update', verifyToken as any, joinController.updateJoin as any);
router.delete('/delete/courseId/:courseId/studentId/:studentId', verifyToken as any, joinController.deleteJoin as any);
export default router;