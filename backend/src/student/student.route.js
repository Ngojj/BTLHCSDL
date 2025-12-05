"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const student_controller_1 = __importDefault(require("./student.controller"));
const router = (0, express_1.Router)();
router.get('/', student_controller_1.default.getAllStudents);
router.get('/:id', student_controller_1.default.getStudentById);
router.post('/create', student_controller_1.default.createNewStudent);
router.put('/update', student_controller_1.default.updateStudent);
router.delete('/delete/:id', student_controller_1.default.deleteStudent);
exports.default = router;
