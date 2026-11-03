import { Router } from "express";
import teacherController from "./teacher.controller";
import { asUser, asTeacher, onlySelf, bindIdentity } from "../middleware/auth";

const router = Router()

// get all teacher
router.get('/', asUser, teacherController.getAllTeachers as any);

// get teacher by id
router.get('/:id', asUser, teacherController.getTeacherById as any);

// create new teacher

// update teacher
router.put('/update', asTeacher, bindIdentity("id"), teacherController.updateTeacher as any);

// delete teacher
router.delete('/delete/:id', asTeacher, onlySelf("id"), teacherController.deleteTeacher as any);
export default router