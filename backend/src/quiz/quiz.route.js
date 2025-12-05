"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quiz_controller_1 = __importDefault(require("./quiz.controller"));
const router = (0, express_1.Router)();
// get all quizzes
router.get('/', quiz_controller_1.default.getAllQuiz);
// get quiz by id
router.get('/id/:id', quiz_controller_1.default.getQuizById);
// get quiz by name
router.get('/name/:name', quiz_controller_1.default.getQuizByName);
// get quiz by section id
router.get('/section/:sectionId', quiz_controller_1.default.getQuizBySectionId);
// create new quiz
router.post('/create', quiz_controller_1.default.createQuiz);
// update quiz
router.patch('/update', quiz_controller_1.default.updateQuiz);
// delete  quiz by name
router.delete('/delete/name/:name', quiz_controller_1.default.deleteQuizByName);
// delete quiz by id
router.delete('/delete/id/:id', quiz_controller_1.default.deleteQuizById);
exports.default = router;
