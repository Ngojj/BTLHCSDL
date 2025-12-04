import { Router } from "express";
import teacherQualificationController from "./teacherQualification.controller";
const router = Router()

// get all teacherQualification
router.get('/', teacherQualificationController.getAllTeacherQualification as any)

// get qualification by userId
router.get('/:userId', teacherQualificationController.getTeacherQualificationByUserId as any)

// get qualification by teacher email
router.get('/email/:email', teacherQualificationController.findTeacherQualificationByTeacherEmail as any)

// create qualification
router.post('/create', teacherQualificationController.createTeacherQualification as any)

// update qualification
router.patch('/update', teacherQualificationController.updateTeacherQualification as any)

// delete qualification
router.delete('/delete', teacherQualificationController.deleteTeacherQualification as any)
export default router;