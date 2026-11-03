import { Router } from "express";
import interactController from "./interact.controller";
import { asUser, asTeacher, asStudent, selfOrTeacher, bindIdentity } from "../middleware/auth";
const router = Router();

router.get("/", asTeacher, interactController.getAllInteractions as any);
router.get("/lecture/:lectureId", asTeacher, interactController.getInteractionsByLectureId as any);
router.get("/student/:studentId", asUser, selfOrTeacher("studentId"), interactController.getInteractionsByStudentId as any);
router.get("/lecture/:lectureId/student/:studentId", asUser, selfOrTeacher("studentId"), interactController.getInteractionsByLectureIdAndStudentId as any);
router.post("/create", asStudent, bindIdentity("studentId"), interactController.createInteraction as any);
router.delete("/delete", asStudent, interactController.deleteInteraction as any);

export default router;