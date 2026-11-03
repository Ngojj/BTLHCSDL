import { Router } from "express";
import courseTopicController from "./courseTopic.controller";
import { asTeacher } from "../middleware/auth";
import { owns } from "../middleware/access";
const router =  Router();

// get all course topic
router.get('/', courseTopicController.getAllCourseTopic as any);

// get course topic by courseId
router.get('/:courseId', courseTopicController.getCourseTopicById as any);

// create course topic
router.post('/create', asTeacher, owns("course", "body.courseId"), courseTopicController.createCourseTopic as any);


// update course topic
router.patch('/update', asTeacher, owns("course", "body.courseId"), courseTopicController.updateCourseTopic as any);

// delete course topic
router.delete('/delete/:courseId', asTeacher, owns("course", "params.courseId"), courseTopicController.deleteCourseTopic as any);
export default router;