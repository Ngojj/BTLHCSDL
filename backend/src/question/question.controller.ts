import questionService from "./question.service";
import { Request, Response } from "express";
class questionController{
    public async getAllQuestions(req: Request, res: Response) {
        try {
            const questions = await questionService.getAllQuestions();
            
            return res.status(questions.status).send(questions.data || questions.message);
            
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }

    public async getQuestionById(req: Request, res: Response) {
        try {
            const questionById = await questionService.getQuestionById(Number(req.params.id));
            
            return res.status(questionById.status).send(questionById.data || questionById.message);
            
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }

    public async getQuestionByQuizId(req: Request, res: Response) {
        try {
            const questionByQuizId = await questionService.getQuestionByQuizId(Number(req.params.quizId));
            
            return res.status(questionByQuizId.status).send(questionByQuizId.data || questionByQuizId.message);
            
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }

    public async getQuestionAndAnswerByQuizId(req: Request, res: Response) {
        try {
            const questionByQuizId = await questionService.getQuestionAndOptionsByQuizId(Number(req.params.quizId));

            return res.status(questionByQuizId.status).send(questionByQuizId.data || questionByQuizId.message);
        } catch (error) {
            return {
                status: 500,
                message: error
            }
            
        }
    }
    public async createQuestion(req: Request, res: Response) {
        try {
            const quizId = req.body.quizId;
            const type = req.body.type;
            const answer = req.body.answer;
            const content = req.body.content;
            const teacherId = req.body.teacherId;
            const options = req.body.options;
            const question = await questionService.createQuestion(quizId, type, answer, content, teacherId, options);
            return res.status(question.status).send(question.message);
            
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }

    public async updateQuestion(req: Request, res: Response) {
        try {
            const id = req.body.id;
            const quizId = req.body.quizId;
            const type = req.body.type;
            const answer = req.body.answer;
            const content = req.body.content;
            const teacherId = req.body.teacherId;
            
            const question = await questionService.updateQuestion(id, quizId, type, answer, content, teacherId);
            return res.status(question.status).send(question.message);
            
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }

    public async deleteQuestionById(req: Request, res: Response) {
        try {
            const question = await questionService.deleteQuestionById(Number(req.params.id));
            return res.status(question.status).send(question.message);
            
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }
    public async deleteAllQuestionsInQuiz(req: Request, res: Response) {
        try {
            const question = await questionService.deleteAllQuestionsInQuiz(Number(req.params.quizId));
            return res.status(question.status).send(question.message);
            
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }
}

export default new questionController();