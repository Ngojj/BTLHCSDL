import { Router } from "express";
import studentController from "./student.controller";
import { asUser, asTeacher, asStudent, selfOrTeacher, onlySelf, bindIdentity } from "../middleware/auth";

const router = Router()

router.get('/', asTeacher, studentController.getAllStudents as any);
router.get('/:id', asUser, selfOrTeacher("id"), studentController.getStudentById as any);
router.put('/update', asStudent, bindIdentity("id"), studentController.updateStudent as any);
router.delete('/delete/:id', asStudent, onlySelf("id"), studentController.deleteStudent as any);

export default router