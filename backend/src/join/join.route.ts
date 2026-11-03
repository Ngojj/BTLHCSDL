import { Router } from "express";
import joinController from './join.controller';
import { asUser, asTeacher, asStudent, selfOrTeacher, onlySelf, bindIdentity } from "../middleware/auth";
import { owns } from "../middleware/access";
import { freeCourseOnly } from "./join.guards";

const router = Router();

router.get('/', asTeacher, joinController.getJoins as any);
router.get('/courseId/:courseId/studentId/:studentId', asUser, selfOrTeacher("studentId"), joinController.getJoinById as any);
router.get('/courseId/:courseId', asTeacher, owns("course", "params.courseId"), joinController.getJoinByCourseId as any);
router.get('/studentId/:studentId', asUser, selfOrTeacher("studentId"), joinController.getJoinByStudentId as any);
router.get('/teacherId/:teacherId', asTeacher, onlySelf("teacherId"), joinController.getJoinByTeacherId as any);
router.post('/create', asStudent, bindIdentity("studentId"), freeCourseOnly, joinController.createJoin as any);
router.patch('/update', asTeacher, owns("course", "body.courseId"), joinController.updateJoin as any);
router.delete('/delete/courseId/:courseId/studentId/:studentId', asUser, selfOrTeacher("studentId"), joinController.deleteJoin as any);
export default router;