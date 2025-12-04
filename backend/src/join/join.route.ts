import { Router } from "express";
import joinController from './join.controller';

const router = Router();

router.get('/', joinController.getJoins as any);
router.get('/courseId/:courseId/studentId/:studentId', joinController.getJoinById as any);
router.get('/courseId/:courseId', joinController.getJoinByCourseId as any);
router.get('/studentId/:studentId', joinController.getJoinByStudentId as any);
router.get('/teacherId/:teacherId', joinController.getJoinByTeacherId as any);
router.post('/create', joinController.createJoin as any);
router.patch('/update', joinController.updateJoin as any);
router.delete('/delete/courseId/:courseId/studentId/:studentId', joinController.deleteJoin as any);
export default router;