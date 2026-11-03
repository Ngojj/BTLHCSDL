import { Router } from "express";
import lectureController from "./lecture.controller";
import { asUser, asTeacher } from "../middleware/auth";
import { owns, canViewContent } from "../middleware/access";

const router = Router();

router.get("/", asTeacher, lectureController.getAllLectures as any);
router.get("/name/:name", asTeacher, lectureController.getLectureByName as any);
router.get("/section/:sectionId", asUser, canViewContent("section", "params.sectionId"), lectureController.getLectureBySectionId as any);
router.post("/create", asTeacher, owns("section", "body.sectionId"), lectureController.addLecture as any);
router.patch("/update", asTeacher, owns("lecture", "body.id"), lectureController.updateLecture as any);
router.delete("/delete/:id", asTeacher, owns("lecture", "params.id"), lectureController.deleteLecture as any);
export default router;