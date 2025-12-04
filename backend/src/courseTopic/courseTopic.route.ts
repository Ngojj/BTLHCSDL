import { Router } from "express";
import courseTopicController from "./courseTopic.controller";
const router =  Router();

// get all course topic
router.get('/', courseTopicController.getAllCourseTopic as any)

// get course topic by courseId
router.get('/:courseId', courseTopicController.getCourseTopicById as any)

// create course topic
router.post('/create', courseTopicController.createCourseTopic as any)


// update course topic
router.patch('/update', courseTopicController.updateCourseTopic as any)

// delete course topic
router.delete('/delete/:courseId', courseTopicController.deleteCourseTopic as any)
export default router;