import { Router } from "express";
import storedProceduresController from "./storedProcedures.controller";

const router = Router();

// PHẦN 2.1: CRUD cho bảng course
router.post("/course/insert", storedProceduresController.courseInsert as any);
router.put("/course/update/:courseId", storedProceduresController.courseUpdate as any);
router.delete("/course/delete/:courseId", storedProceduresController.courseDelete as any);

// PHẦN 2.3: Thủ tục truy vấn
router.get("/courses/by-teacher", storedProceduresController.listCoursesByTeacher as any);
router.get("/students/progress-summary", storedProceduresController.studentProgressSummary as any);

// PHẦN 2.4: Hàm
router.get("/students/:studentId/total-spent", storedProceduresController.getTotalSpent as any);
router.get("/courses/check-prereq", storedProceduresController.checkPrereqMet as any);

export default router;

