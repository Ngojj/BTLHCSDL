import { Router } from "express";
import sectionController from "./section.controller";
const router = Router();

// get all sections
router.get('/',  sectionController.getAllSections as any)

// get section by id
router.get('/id/:id', sectionController.getSectionById as any)

// get sections in course
router.get('/course/:courseId', sectionController.getSectionsInCourse as any)

// create section
router.post('/create', sectionController.createSection as any)

// update section
router.patch('/update', sectionController.updateSection as any)

// delete section
router.delete('/delete/:id', sectionController.deleteSection as any)

// delete sections in course
router.delete('/delete/course/:courseId', sectionController.deleteSectionsInCourse as any)
export default router;