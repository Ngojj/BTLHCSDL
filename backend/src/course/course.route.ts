import { Router } from "express";
import courseController from "./course.controller";
import { course } from "../db/schema";
const router = Router();

//  get all courses
router.get('/', courseController.getAllCourses as any)
// get all courses with teacher info
router.get('/teacher', courseController.getAllCourseWithTeacherInfo as any)
router.get('/teacher/')
// get all courses by teacher id
router.get('/teacherId/:teacherId', courseController.getAllCourseByTeacherId as any)
// get course by id
router.get('/id/:id', courseController.getCourseById as any)
// get course by name
router.get('/name/:name', courseController.getCourseByName as any)
// create new course
router.post('/create', courseController.createNewCourse as any)
// delete course by id
router.delete('/delete/id/:id', courseController.deleteCourseById as any)
// delete course by name
router.delete('/delete/name/:name', courseController.deleteCourseByName as any)
// update course by id
router.put('/update/id/:id', courseController.updateCourseById as any)
// update course by name
router.put('/update/name/:name', courseController.updateCourseByName as any)
export default router