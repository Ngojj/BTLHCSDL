import { Router } from "express";
import viewRoadMapController from "./viewRoadMap.controller";
import { asUser, asTeacher, asStudent, selfOrTeacher, onlySelf, bindIdentity } from "../middleware/auth";
const router = Router();

router.get("/", asTeacher, viewRoadMapController.getAllRoadMap as any);
router.get("/rmId/:rmId", asTeacher, viewRoadMapController.getRoadMapById as any);
router.get("/studentId/:studentId", asUser, selfOrTeacher("studentId"), viewRoadMapController.getRoadMapByStudentId as any);
router.get("/studentId/:studentId/rmId/:rmId", asUser, selfOrTeacher("studentId"), viewRoadMapController.getRoadMapByStudentIdAndRmId as any);
router.post("/create", asStudent, bindIdentity("studentId"), viewRoadMapController.createRoadMap as any);
router.patch("/update", asStudent, bindIdentity("studentId"), viewRoadMapController.updateRoadMap as any);
router.delete("/delete/studentId/:studentId/rmId/:rmId", asStudent, onlySelf("studentId"), viewRoadMapController.deleteRoadMap as any);
export default router;