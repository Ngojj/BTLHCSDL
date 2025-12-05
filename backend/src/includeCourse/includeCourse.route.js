"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const includeCourse_controller_1 = __importDefault(require("./includeCourse.controller"));
const router = (0, express_1.Router)();
router.get('/student/:studentId', includeCourse_controller_1.default.getGetRoadmapOfStudentByStudentId);
router.get("/", includeCourse_controller_1.default.getAllIncludeCourse);
router.get('/rmId/:rmId', includeCourse_controller_1.default.getIncludeCourseByrmId);
router.get("/rmId/:rmId/courseId/:courseId", includeCourse_controller_1.default.getIncludeCourseById);
router.post("/create", includeCourse_controller_1.default.createIncludeCourse);
router.patch("/update", includeCourse_controller_1.default.updateIncludeCourse);
router.delete("/rmId/:rmId/courseId/:courseId", includeCourse_controller_1.default.deleteIncludeCourse);
exports.default = router;
