import { Request, Response } from "express";
import quizService from "./quiz.service";
class quizController {
    public async getAllQuiz(req: Request, res: Response) {
        try {
            const quizzes = await quizService.getAllQuiz();
            
            return res.status(quizzes.status).send(quizzes.data);
            
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }

    public async getQuizById(req: Request, res: Response) {
        try {
            const quizById = await quizService.getQuizById(Number(req.params.id));
            
            return res.status(quizById.status).send(quizById.data);
            
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }

    public async getQuizByName(req: Request, res: Response) {
        try {
            const quizByName = await quizService.getQuizByName(req.params.name);
            
            return res.status(quizByName.status).send(quizByName.data || quizByName.message);
            
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }

    public async getQuizBySectionId(req: Request, res: Response) {
        try {
            const quizBySectionId = await quizService.getQuizBySection(Number(req.params.sectionId));
            
            return res.status(quizBySectionId.status).send(quizBySectionId.data || quizBySectionId.message);
            
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }
    public async createQuiz(req: Request, res: Response) {
        try {
            const name = req.body.name;
            const state = req.body.state;
            const attempt = req.body.attempt;
            const duration = req.body.duration;
            const teacherId = req.body.teacherId;
            const sectionId = req.body.sectionId;

            const quiz = await quizService.createQuiz(name, state, attempt, duration, teacherId, sectionId);
            
            return res.status(quiz.status).send(quiz.message);
            
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }

     public async updateQuiz(req: Request, res: Response) {
        try {
            const id = req.body.id;
            const name = req.body.name;
            const state = req.body.state;
            const attempt = req.body.attempt;
            const duration = req.body.duration;
            const teacherId = req.body.teacherId;
            const sectionId = req.body.sectionId;

            const quiz = await quizService.updateQuiz(id, name, state, attempt, duration, teacherId, sectionId);
            
            return res.status(quiz.status).send(quiz.message);
            
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        } 
    }

    public async deleteQuizById(req: Request, res: Response) {
        try {
            const quiz = await quizService.deleteQuizById(Number(req.params.id));
            
            return res.status(quiz.status).send(quiz.message);
            
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }

    public async deleteQuizByName(req: Request, res: Response) {
        try {
            const quiz = await quizService.deleteQuizByName(req.params.name);
            
            return res.status(quiz.status).send(quiz.message);
            
        } catch (error) {
            return {
                status: 500,
                message: error
            }
        }
    }
}

export default new quizController();