"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const join_controller_1 = __importDefault(require("./join.controller"));
const router = (0, express_1.Router)();
router.get('/', join_controller_1.default.getJoins);
router.get('/courseId/:courseId/studentId/:studentId', join_controller_1.default.getJoinById);
router.get('/courseId/:courseId', join_controller_1.default.getJoinByCourseId);
router.get('/studentId/:studentId', join_controller_1.default.getJoinByStudentId);
router.get('/teacherId/:teacherId', join_controller_1.default.getJoinByTeacherId);
router.post('/create', join_controller_1.default.createJoin);
router.patch('/update', join_controller_1.default.updateJoin);
router.delete('/delete/courseId/:courseId/studentId/:studentId', join_controller_1.default.deleteJoin);
exports.default = router;
