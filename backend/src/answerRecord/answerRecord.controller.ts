import { Request, Response } from 'express';
import answerRecordService from './answerRecord.service';
class answerRecordController {
    public async getRecordByquestionIdAndStudentId(req: Request, res: Response){
        try {
            const record = await answerRecordService.getRecordByQuestionIdAndStudentId(Number(req.params.questionId), Number(req.params.studentId))
            
            return res.status(record.status).send(record)
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }
    public async getRecordByQuizIdAndStudentId(req: Request, res: Response){
        try {
            const record = await answerRecordService.getRecordByQuizIdAndStudentId(Number(req.params.quizId), Number(req.params.studentId))
            return res.status(record.status).send(record)
        } catch (error) {
            return {
                message: error,
                status: 500
            }   
        }
    }

    public async createRecord(req: Request, res: Response){
        try {
            const record = await answerRecordService.createRecord(req.body)
            return res.status(record.status).send(record)
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async updateRecord(req: Request, res: Response){
        try {
            const record = await answerRecordService.updateRecord(req.body)
            return res.status(record.status).send(record)
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async deleteRecord(req: Request, res: Response){
        try {
            const record = await answerRecordService.deleteRecord(req.body.quizId, req.body.studentId, req.body.questionId)
            return res.status(record.status).send(record)
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

}

export default new answerRecordController();