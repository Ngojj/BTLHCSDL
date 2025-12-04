import { Router } from "express";
import interactController from "./interact.controller";
const router = Router();

router.get("/", interactController.getAllInteractions as any);
router.get("/lecture/:lectureId", interactController.getInteractionsByLectureId as any);
router.get("/student/:studentId", interactController.getInteractionsByStudentId as any);
router.get("/lecture/:lectureId/student/:studentId", interactController.getInteractionsByLectureIdAndStudentId as any);
router.post("/create", interactController.createInteraction as any);
router.delete("/delete", interactController.deleteInteraction as any);

export default router;