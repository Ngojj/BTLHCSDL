import { Router } from "express";
import teacherQualificationController from "./teacherQualification.controller";
import { asUser, asTeacher, bindIdentity } from "../middleware/auth";
const router = Router()

// get all teacherQualification
router.get('/', asUser, teacherQualificationController.getAllTeacherQualification as any);

// get qualification by userId
router.get('/:userId', asUser, teacherQualificationController.getTeacherQualificationByUserId as any);

// get qualification by teacher email
router.get('/email/:email', asUser, teacherQualificationController.findTeacherQualificationByTeacherEmail as any);

// create qualification
router.post('/create', asTeacher, bindIdentity("userId"), teacherQualificationController.createTeacherQualification as any);

// update qualification
router.patch('/update', asTeacher, bindIdentity("userId"), teacherQualificationController.updateTeacherQualification as any);

// delete qualification
router.delete('/delete', asTeacher, bindIdentity("userId"), teacherQualificationController.deleteTeacherQualification as any);
export default router;