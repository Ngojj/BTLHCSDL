import { Request, Response } from "express";
import interactService from "./interact.service";

class interactController{
    public async getAllInteractions(req: Request, res: Response){
        try {
            const All = await interactService.getAllInteractions();

            return res.status(All.status).send(All);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getInteractionsByLectureId(req: Request, res: Response){
        try {
            const All = await interactService.getInteractionsByLectureId(Number(req.params.lectureId));

            return res.status(All.status).send(All);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getInteractionsByStudentId(req: Request, res: Response){
        try {
            const All = await interactService.getInteractionsByStudentId(Number(req.params.studentId));

            return res.status(All.status).send(All);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getInteractionsByLectureIdAndStudentId(req: Request, res: Response){
        try {
            const All = await interactService.getInteractionsByLectureIdAndStudentId(Number(req.params.lectureId), Number(req.params.studentId));

            return res.status(All.status).send(All);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async createInteraction(req: Request, res: Response){
        try {
            const All = await interactService.createInteraction(req.body.lectureId, req.body.studentId);

            return res.status(All.status).send(All);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async deleteInteraction(req: Request, res: Response){
        try {
            const All = await interactService.deleteInteraction(Number(req.params.lectureId), Number(req.params.studentId));

            return res.status(All.status).send(All);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }
}

export default new interactController();