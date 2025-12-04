import { Router } from "express";
import viewRoadMapController from "./viewRoadMap.controller";
const router = Router();

router.get("/", viewRoadMapController.getAllRoadMap as any);
router.get("/rmId/:rmId", viewRoadMapController.getRoadMapById as any);
router.get("/studentId/:studentId", viewRoadMapController.getRoadMapByStudentId as any);
router.get("/studentId/:studentId/rmId/:rmId", viewRoadMapController.getRoadMapByStudentIdAndRmId as any);
router.post("/create", viewRoadMapController.createRoadMap as any);
router.patch("/update", viewRoadMapController.updateRoadMap as any);
router.delete("/delete/studentId/:studentId/rmId/:rmId", viewRoadMapController.deleteRoadMap as any);
export default router;