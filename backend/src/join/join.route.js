"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const join_controller_1 = __importDefault(require("./join.controller"));
const verifyToken_1 = require("../middleware/verifyToken");
const router = (0, express_1.Router)();
router.get('/', verifyToken_1.verifyToken, join_controller_1.default.getJoins);
router.get('/courseId/:courseId/studentId/:studentId', verifyToken_1.verifyToken, join_controller_1.default.getJoinById);
router.get('/courseId/:courseId', verifyToken_1.verifyToken, join_controller_1.default.getJoinByCourseId);
router.get('/studentId/:studentId', verifyToken_1.verifyToken, join_controller_1.default.getJoinByStudentId);
router.get('/teacherId/:teacherId', verifyToken_1.verifyToken, join_controller_1.default.getJoinByTeacherId);
router.post('/create', verifyToken_1.verifyToken, join_controller_1.default.createJoin);
router.patch('/update', verifyToken_1.verifyToken, join_controller_1.default.updateJoin);
router.delete('/delete/courseId/:courseId/studentId/:studentId', verifyToken_1.verifyToken, join_controller_1.default.deleteJoin);
exports.default = router;
