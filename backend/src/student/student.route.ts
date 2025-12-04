import { Router } from "express";
import studentController from "./student.controller";

const router = Router()

router.get('/', studentController.getAllStudents as any)
router.get('/:id', studentController.getStudentById as any)
router.post('/create', studentController.createNewStudent as any)
router.put('/update', studentController.updateStudent as any)
router.delete('/delete/:id', studentController.deleteStudent as any)

export default router