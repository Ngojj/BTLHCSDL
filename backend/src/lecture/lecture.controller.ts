import { Request, Response } from "express";
import lectureService from "./lecture.service";
class lectureController{
    public async getAllLectures(req: Request, res: Response){
        try {
            const All = await lectureService.getAllLectures();

            return res.status(All.status).send(All);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getLectureByName(req: Request, res: Response){
        try {
            const name = req.params.name;
            const lecture = await lectureService.getLectureByName(name);

            return res.status(lecture.status).send(lecture);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getLectureBySectionId(req: Request, res: Response){
        try {
            const sectionId = req.params.sectionId;
            const lecture = await lectureService.getLectureBySectionId(Number(sectionId));

            return res.status(lecture.status).send(lecture);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async addLecture(req: Request, res: Response){
        try {
            const lecture = req.body;
            const newLecture = await lectureService.createLecture(lecture);

            return res.status(newLecture.status).send(newLecture);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async updateLecture(req: Request, res: Response){
        try {
            const lecture = req.body;
            const updateLecture = await lectureService.updateLecture(lecture);

            return res.status(updateLecture.status).send(updateLecture);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async deleteLecture(req: Request, res: Response){
        try {
            const id = req.params.id;
            const deleteLecture = await lectureService.deleteLecture(Number(id));

            return res.status(deleteLecture.status).send(deleteLecture);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }
}

export default new lectureController();