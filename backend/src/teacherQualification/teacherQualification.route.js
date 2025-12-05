"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teacherQualification_controller_1 = __importDefault(require("./teacherQualification.controller"));
const router = (0, express_1.Router)();
// get all teacherQualification
router.get('/', teacherQualification_controller_1.default.getAllTeacherQualification);
// get qualification by userId
router.get('/:userId', teacherQualification_controller_1.default.getTeacherQualificationByUserId);
// get qualification by teacher email
router.get('/email/:email', teacherQualification_controller_1.default.findTeacherQualificationByTeacherEmail);
// create qualification
router.post('/create', teacherQualification_controller_1.default.createTeacherQualification);
// update qualification
router.patch('/update', teacherQualification_controller_1.default.updateTeacherQualification);
// delete qualification
router.delete('/delete', teacherQualification_controller_1.default.deleteTeacherQualification);
exports.default = router;
