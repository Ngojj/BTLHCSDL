import { Router } from "express";
import requireCourseController from "./requireCourse.controller";
import { asUser, asTeacher } from "../middleware/auth";
import { owns } from "../middleware/access";
const router = Router();

router.get('/', asUser, requireCourseController.getRequireCourses as any);
router.get('/courseId/:courseId', asUser, requireCourseController.getRequireCourseById as any);
router.post('/create', asTeacher, owns("course", "body.courseId"), requireCourseController.insertRequireCourse as any);
router.patch('/update', asTeacher, owns("course", "body.courseId"), requireCourseController.updateRequireCourse as any);
router.delete('/delete', asTeacher, owns("course", "body.courseId"), requireCourseController.deleteRequireCourse as any);
export default router;