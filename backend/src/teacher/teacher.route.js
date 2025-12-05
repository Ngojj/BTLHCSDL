"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teacher_controller_1 = __importDefault(require("./teacher.controller"));
const router = (0, express_1.Router)();
// get all teacher
router.get('/', teacher_controller_1.default.getAllTeachers);
// get teacher by id
router.get('/:id', teacher_controller_1.default.getTeacherById);
// create new teacher
router.post('/create', teacher_controller_1.default.createNewTeacher);
// update teacher
router.put('/update', teacher_controller_1.default.updateTeacher);
// delete teacher
router.delete('/delete/:id', teacher_controller_1.default.deleteTeacher);
exports.default = router;
