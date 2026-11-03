import { Router } from "express";
import { asyncHandler } from "../lib/errors";
import { validate } from "../middleware/validate";
import { searchCourses, searchQuerySchema } from "./course.search";
import courseController from "./course.controller";
import { asUser, asTeacher, bindIdentity } from "../middleware/auth";
import { owns } from "../middleware/access";
const router = Router();

//  get all courses
router.get('/', courseController.getAllCourses as any);
// search the catalog: ?q=&language=&minPrice=&maxPrice=&teacherId=&sort=newest|popular|rating|price_asc|price_desc&page=&limit=
router.get("/search", validate({ query: searchQuerySchema }), asyncHandler(async (req, res) => {
    res.json(await searchCourses(req.query as any));
}));
// get all courses with teacher info
router.get('/teacher', courseController.getAllCourseWithTeacherInfo as any);
// get all courses by teacher id
router.get('/teacherId/:teacherId', asUser, courseController.getAllCourseByTeacherId as any);
// get course by id
router.get('/id/:id', courseController.getCourseById as any);
// get course by name
router.get('/name/:name', courseController.getCourseByName as any);
// create new course
router.post('/create', asTeacher, bindIdentity("teacherId"), courseController.createNewCourse as any);
// delete course by id
router.delete('/delete/id/:id', asTeacher, owns("course", "params.id"), courseController.deleteCourseById as any);
// update course by id
router.put('/update/id/:id', asTeacher, owns("course", "params.id"), courseController.updateCourseById as any);
export default router