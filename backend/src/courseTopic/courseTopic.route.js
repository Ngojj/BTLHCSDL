"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courseTopic_controller_1 = __importDefault(require("./courseTopic.controller"));
const router = (0, express_1.Router)();
// get all course topic
router.get('/', courseTopic_controller_1.default.getAllCourseTopic);
// get course topic by courseId
router.get('/:courseId', courseTopic_controller_1.default.getCourseTopicById);
// create course topic
router.post('/create', courseTopic_controller_1.default.createCourseTopic);
// update course topic
router.patch('/update', courseTopic_controller_1.default.updateCourseTopic);
// delete course topic
router.delete('/delete/:courseId', courseTopic_controller_1.default.deleteCourseTopic);
exports.default = router;
