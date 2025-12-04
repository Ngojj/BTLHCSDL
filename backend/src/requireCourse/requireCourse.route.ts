import { Router } from "express";
import requireCourseController from "./requireCourse.controller";
const router = Router();

router.get('/', requireCourseController.getRequireCourses as any);
router.get('/courseId/:courseId', requireCourseController.getRequireCourseById as any);
router.post('/create', requireCourseController.insertRequireCourse as any);
router.patch('/update', requireCourseController.updateRequireCourse as any);
router.delete('/delete', requireCourseController.deleteRequireCourse as any);
router.delete('/deleteAll', requireCourseController.deleteAllRequireCourses as any);
export default router;