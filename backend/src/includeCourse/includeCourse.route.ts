import { Router } from "express";
import includeCourseController from "./includeCourse.controller";
import { asUser, asTeacher, selfOrTeacher } from "../middleware/auth";
import { owns } from "../middleware/access";
const router = Router();

router.get('/student/:studentId', asUser, selfOrTeacher("studentId"), includeCourseController.getGetRoadmapOfStudentByStudentId as any);
router.get("/", asUser, includeCourseController.getAllIncludeCourse as any);
router.get('/rmId/:rmId', asUser, includeCourseController.getIncludeCourseByrmId as any);
router.get("/rmId/:rmId/courseId/:courseId", asUser, includeCourseController.getIncludeCourseById as any);
router.post("/create", asTeacher, owns("roadMap", "body.rmId"), includeCourseController.createIncludeCourse as any);
router.patch("/update", asTeacher, owns("roadMap", "body.rmId"), includeCourseController.updateIncludeCourse as any);
router.delete("/rmId/:rmId/courseId/:courseId", asTeacher, owns("roadMap", "params.rmId"), includeCourseController.deleteIncludeCourse as any);
export default router;