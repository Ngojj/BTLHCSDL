"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const answerRecord_controller_1 = __importDefault(require("./answerRecord.controller"));
const router = (0, express_1.Router)();
router.get('/question/:questionId/student/:studentId', answerRecord_controller_1.default.getRecordByquestionIdAndStudentId);
router.get('/quiz/:quizId/student/:studentId', answerRecord_controller_1.default.getRecordByQuizIdAndStudentId);
router.post('/create', answerRecord_controller_1.default.createRecord);
router.patch('/update', answerRecord_controller_1.default.updateRecord);
router.delete('/delete', answerRecord_controller_1.default.deleteRecord);
exports.default = router;
