import { Router } from "express";
import authController from "./auth.controller";
import studentService from "../student/student.service";
import studentController from "../student/student.controller";
import teacherController from "../teacher/teacher.controller";

const router = Router()

router.post('/login', authController.login as any)
router.post('/register-as-student', studentController.createNewStudent as any)
router.post('/register-as-teacher', teacherController.createNewTeacher as any)


export default router