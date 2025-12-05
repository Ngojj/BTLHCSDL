"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("./auth.controller"));
const student_controller_1 = __importDefault(require("../student/student.controller"));
const teacher_controller_1 = __importDefault(require("../teacher/teacher.controller"));
const router = (0, express_1.Router)();
router.post('/login', auth_controller_1.default.login);
router.post('/register-as-student', student_controller_1.default.createNewStudent);
router.post('/register-as-teacher', teacher_controller_1.default.createNewTeacher);
exports.default = router;
