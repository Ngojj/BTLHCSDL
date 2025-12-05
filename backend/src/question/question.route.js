"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const question_controller_1 = __importDefault(require("./question.controller"));
const router = (0, express_1.Router)();
// get all questions
router.get("/", question_controller_1.default.getAllQuestions);
// get question by id
router.get("/id/:id", question_controller_1.default.getQuestionById);
// get question by quiz id
router.get("/quiz/:quizId", question_controller_1.default.getQuestionByQuizId);
// get question and options by quiz id
router.get("/quiz/:quizId/options", question_controller_1.default.getQuestionAndAnswerByQuizId);
// create question
router.post("/create", question_controller_1.default.createQuestion);
// update question
router.patch("/update", question_controller_1.default.updateQuestion);
// delet question by id
router.delete("/delete/id/:id", question_controller_1.default.deleteQuestionById);
// delete question in quiz
router.delete("/delete/quiz/:quizId", question_controller_1.default.deleteAllQuestionsInQuiz);
exports.default = router;
