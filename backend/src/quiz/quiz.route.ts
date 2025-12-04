import { Router } from "express";
import quizController from "./quiz.controller";
const router = Router();

// get all quizzes
router.get('/', quizController.getAllQuiz as any)

// get quiz by id
router.get('/id/:id', quizController.getQuizById as any)

// get quiz by name
router.get('/name/:name', quizController.getQuizByName as any)

// get quiz by section id
router.get('/section/:sectionId', quizController.getQuizBySectionId as any)

// create new quiz
router.post('/create', quizController.createQuiz as any)

// update quiz
router.patch('/update', quizController.updateQuiz as any)

// delete  quiz by name
router.delete('/delete/name/:name', quizController.deleteQuizByName as any)

// delete quiz by id
router.delete('/delete/id/:id', quizController.deleteQuizById as any)
export default router;