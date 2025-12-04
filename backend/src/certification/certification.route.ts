import { Router } from "express";
import certificationController from "./certification.controller";
const router = Router();

router.get('/', certificationController.getCertifications as any);

router.get('/id/:id', certificationController.getCertificationById as any);

router.get('/courseId/:courseId', certificationController.getCertificationByCourseId as any);

router.get('/studentId/:studentId', certificationController.getCertificationByStudentId as any);

router.post('/create', certificationController.createCertification as any);

router.patch('/update', certificationController.updateCertification as any);

router.delete('/delete/:id', certificationController.deleteCertification as any);

router.delete('/delete/courseId/:courseId', certificationController.deleteCertificationByCourseId as any);

router.delete('/delete/studentId/:studentId', certificationController.deleteCertificationByStudentId as any);
export default router;