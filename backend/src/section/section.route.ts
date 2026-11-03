import { Router } from "express";
import sectionController from "./section.controller";
import { asUser, asTeacher, bindIdentity } from "../middleware/auth";
import { owns, canViewContent } from "../middleware/access";
const router = Router();

// get all sections
router.get('/', asTeacher, sectionController.getAllSections as any);

// get section by id
router.get('/id/:id', asUser, canViewContent("section", "params.id"), sectionController.getSectionById as any);

// get sections in course
router.get('/course/:courseId', sectionController.getSectionsInCourse as any);

// create section
router.post('/create', asTeacher, owns("course", "body.courseId"), bindIdentity("teacherId"), sectionController.createSection as any);

// update section
router.patch('/update', asTeacher, owns("section", "body.id"), sectionController.updateSection as any);

// delete section
router.delete('/delete/:id', asTeacher, owns("section", "params.id"), sectionController.deleteSection as any);

// delete sections in course
router.delete('/delete/course/:courseId', asTeacher, owns("course", "params.courseId"), sectionController.deleteSectionsInCourse as any);
export default router;