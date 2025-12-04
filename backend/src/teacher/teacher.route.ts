import { Router } from "express";
import teacherController from "./teacher.controller";

const router = Router()

// get all teacher
router.get('/',  teacherController.getAllTeachers as any)

// get teacher by id
router.get('/:id', teacherController.getTeacherById as any)

// create new teacher
router.post('/create', teacherController.createNewTeacher as any)

// update teacher
router.put('/update', teacherController.updateTeacher as any)

// delete teacher
router.delete('/delete/:id', teacherController.deleteTeacher as any)
export default router