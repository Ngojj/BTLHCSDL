import exp from "constants";
import { Router } from "express";
import roadcertificationController from "./roadCertification.controller";
const router = Router();

router.get('/', roadcertificationController.getALLRoadCertification as any);

router.get('/id/:id', roadcertificationController.getRoadCertificationById as any);

router.post('/create', roadcertificationController.createRoadCertification as any);

router.patch('/update', roadcertificationController.updateRoadCertification as any);

router.delete('/delete/:id', roadcertificationController.deleteRoadCertification as any);
export default router;