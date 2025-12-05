"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const course_controller_1 = __importDefault(require("./course.controller"));
const router = (0, express_1.Router)();
//  get all courses
router.get('/', course_controller_1.default.getAllCourses);
// get all courses with teacher info
router.get('/teacher', course_controller_1.default.getAllCourseWithTeacherInfo);
router.get('/teacher/');
// get all courses by teacher id
router.get('/teacherId/:teacherId', course_controller_1.default.getAllCourseByTeacherId);
// get course by id
router.get('/id/:id', course_controller_1.default.getCourseById);
// get course by name
router.get('/name/:name', course_controller_1.default.getCourseByName);
// create new course
router.post('/create', course_controller_1.default.createNewCourse);
// delete course by id
router.delete('/delete/id/:id', course_controller_1.default.deleteCourseById);
// delete course by name
router.delete('/delete/name/:name', course_controller_1.default.deleteCourseByName);
// update course by id
router.put('/update/id/:id', course_controller_1.default.updateCourseById);
// update course by name
router.put('/update/name/:name', course_controller_1.default.updateCourseByName);
exports.default = router;
