"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const section_controller_1 = __importDefault(require("./section.controller"));
const router = (0, express_1.Router)();
// get all sections
router.get('/', section_controller_1.default.getAllSections);
// get section by id
router.get('/id/:id', section_controller_1.default.getSectionById);
// get sections in course
router.get('/course/:courseId', section_controller_1.default.getSectionsInCourse);
// create section
router.post('/create', section_controller_1.default.createSection);
// update section
router.patch('/update', section_controller_1.default.updateSection);
// delete section
router.delete('/delete/:id', section_controller_1.default.deleteSection);
// delete sections in course
router.delete('/delete/course/:courseId', section_controller_1.default.deleteSectionsInCourse);
exports.default = router;
