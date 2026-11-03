import { Router } from "express";
import roadMapController from "./roadMap.controller";
import { asUser, asTeacher, bindIdentity } from "../middleware/auth";
import { owns } from "../middleware/access";

const router = Router();

router.get("/", asUser, roadMapController.getRoadMaps as any);

router.get("/id/:id", asUser, roadMapController.getRoadMapById as any);

router.post("/create", asTeacher, bindIdentity("teacherId"), roadMapController.createRoadMap as any);

router.patch("/update", asTeacher, owns("roadMap", "body.id"), roadMapController.updateRoadMap as any);

router.delete("/delete/:id", asTeacher, owns("roadMap", "params.id"), roadMapController.deleteRoadMap as any);
export default router;
