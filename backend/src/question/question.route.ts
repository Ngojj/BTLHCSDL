import { Router } from "express";
import questionController from "./question.controller";
import { asUser, asTeacher, bindIdentity } from "../middleware/auth";
import { owns, canViewContent } from "../middleware/access";
import { hideAnswersFromStudents } from "../middleware/hideAnswers";

const router = Router();

// get all questions
router.get("/", asTeacher, questionController.getAllQuestions as any);

// get question by id
router.get("/id/:id", asUser, canViewContent("question", "params.id"), hideAnswersFromStudents, questionController.getQuestionById as any);

// get question by quiz id
router.get("/quiz/:quizId", asUser, canViewContent("quiz", "params.quizId"), hideAnswersFromStudents, questionController.getQuestionByQuizId as any);

// get question and options by quiz id
router.get("/quiz/:quizId/options", asUser, canViewContent("quiz", "params.quizId"), hideAnswersFromStudents, questionController.getQuestionAndAnswerByQuizId as any);

// create question
router.post("/create", asTeacher, owns("quiz", "body.quizId"), bindIdentity("teacherId"), questionController.createQuestion as any);

// update question
router.patch("/update", asTeacher, owns("question", "body.id"), questionController.updateQuestion as any);

// delet question by id
router.delete("/delete/id/:id", asTeacher, owns("question", "params.id"), questionController.deleteQuestionById as any);

// delete question in quiz
router.delete("/delete/quiz/:quizId", asTeacher, owns("quiz", "params.quizId"), questionController.deleteAllQuestionsInQuiz as any);
export default router;