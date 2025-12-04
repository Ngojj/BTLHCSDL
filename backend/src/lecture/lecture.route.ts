import { Router } from "express";
import lectureController from "./lecture.controller";

const router = Router();

router.get("/", lectureController.getAllLectures as any);
router.get("/name/:name", lectureController.getLectureByName as any);
router.get("/section/:sectionId", lectureController.getLectureBySectionId as any);
router.post("/create", lectureController.addLecture as any);
router.patch("/update", lectureController.updateLecture as any);
router.delete("/delete/:id", lectureController.deleteLecture as any);
export default router;