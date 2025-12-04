import { Router } from "express";
import questionController from "./question.controller";

const router = Router();

// get all questions
router.get("/", questionController.getAllQuestions as any);

// get question by id
router.get("/id/:id", questionController.getQuestionById as any);

// get question by quiz id
router.get("/quiz/:quizId", questionController.getQuestionByQuizId as any);

// get question and options by quiz id
router.get("/quiz/:quizId/options", questionController.getQuestionAndAnswerByQuizId as any);

// create question
router.post("/create", questionController.createQuestion as any);

// update question
router.patch("/update", questionController.updateQuestion as any);

// delet question by id
router.delete("/delete/id/:id", questionController.deleteQuestionById as any);

// delete question in quiz
router.delete("/delete/quiz/:quizId", questionController.deleteAllQuestionsInQuiz as any);
export default router;