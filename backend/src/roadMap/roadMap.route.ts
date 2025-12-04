import { Router } from "express";
import roadMapController from "./roadMap.controller";

const router = Router();

router.get("/", roadMapController.getRoadMaps as any);

router.get("/id/:id", roadMapController.getRoadMapById as any);

router.post("/create", roadMapController.createRoadMap as any);

router.patch("/update", roadMapController.updateRoadMap as any);

router.delete("/delete/:id", roadMapController.deleteRoadMap as any);
export default router;
