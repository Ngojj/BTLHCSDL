"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requireCourse_controller_1 = __importDefault(require("./requireCourse.controller"));
const router = (0, express_1.Router)();
router.get('/', requireCourse_controller_1.default.getRequireCourses);
router.get('/courseId/:courseId', requireCourse_controller_1.default.getRequireCourseById);
router.post('/create', requireCourse_controller_1.default.insertRequireCourse);
router.patch('/update', requireCourse_controller_1.default.updateRequireCourse);
router.delete('/delete', requireCourse_controller_1.default.deleteRequireCourse);
router.delete('/deleteAll', requireCourse_controller_1.default.deleteAllRequireCourses);
exports.default = router;
