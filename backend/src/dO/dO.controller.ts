import { Request, Response } from 'express';
import dOService from './dO.service';
class dOController{
    public async getAllDO(req: Request, res: Response){
        try {

            const dOData = await dOService.getAllDO();

            return res.status(dOData.status).send(dOData);
        } catch (error) {
            return {
                error: error,
                status: 500
            }
        }
    }

    public async getDOByQuizIdAndStudentIdAndAttemptOrder(req: Request, res: Response){
        try {
            const quizId = req.params.quizId;
            const studentId = req.params.studentId
            const attemptOrder = req.params.attemptOrder
            const dOData = await dOService.getDOByQuizIdAndStudentIdAndAttemptOrder(Number(quizId), Number(studentId), Number(attemptOrder));

            return res.status(dOData.status).send(dOData);
        } catch (error) {
            return {
                error: error,
                status: 500
            }
        }
    }

    public async getDOByStudentId(req: Request, res: Response){
        try {
            const studentId = req.params.studentId;
            const dOData = await dOService.getDOByStudentId(Number(studentId));

            return res.status(dOData.status).send(dOData);
        } catch (error) {
            return {
                error: error,
                status: 500
            }
        }
    }

    public async getDOByQuizIdAndStudentId(req: Request, res: Response){
        try {
            const quizId = req.params.quizId;
            const studentId = req.params.studentId;
            const dOData = await dOService.getDOByQuizIdAndStudentId(Number(quizId), Number(studentId));

            return res.status(dOData.status).send(dOData);
        } catch (error) {
            return {
                error: error,
                status: 500
            }
        }
    }

    public async createDO(req: Request, res: Response){
        try {
            const data = req.body;
            const dOData = await dOService.createDO(data);

            return res.status(dOData.status).send(dOData);
        } catch (error) {
            return {
                error: error,
                status: 500
            }
        }
    }

    public async updateDO(req: Request, res: Response){
        try {
            const data = req.body;
            const dOData = await dOService.updateDO(data);

            return res.status(dOData.status).send(dOData);
        } catch (error) {
            return {
                error: error,
                status: 500
            }
        }
    }

    public async deleteDO(req: Request, res: Response){
        try {
            const quizId = req.params.quizId;
            const studentId = req.params.studentId;
            const dOData = await dOService.deleteDO(Number(quizId), Number(studentId));

            return res.status(dOData.status).send(dOData);
        } catch (error) {
            return {
                error: error,
                status: 500
            }
        }
    }
}


export default new dOController();