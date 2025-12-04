import sectionService from "./section.service";
import { Request, Response } from "express";
class sectionController {
    public getAllSections = async (req: Request, res: Response) => {
        try {
            const response = await sectionService.getSections();

            return res.status(response.status).send(response);
            
        } catch (error) {
            return{
                message: error,
                status: 500
            }
        }
    }

    public getSectionById = async (req: Request, res: Response) => {
        try {
            const response = await sectionService.getSectionById(Number(req.params.id));

            return res.status(response.status).send(response);
        } catch (error) {
            return{
                message: error,
                status: 500
            }
        }
    }

    public getSectionsInCourse = async (req: Request, res: Response) => {
        try {
            const response = await sectionService.getSectionsInCourse(Number(req.params.courseId));

            return res.status(response.status).send(response);
        } catch (error) {
            return{
                message: error,
                status: 500
            }
        }
    }
    public createSection = async (req: Request, res: Response) => {
        try {
            const name = req.body.name;
            const numOfLecture = req.body.numOfLecture;
            const timeToComplete = req.body.timeToComplete;
            const teacherId = req.body.teacherId;
            const courseId = req.body.courseId;

            const response = await sectionService.createSection(name, numOfLecture, timeToComplete, teacherId, courseId);
            return res.status(response.status).send(response);
        } catch (error) {
            return{
                message: error,
                status: 500
            }
        }
    }

    public updateSection = async (req: Request, res: Response) => {
        try {
            const id = req.body.id;
            const name = req.body.name;
            const numOfLecture = req.body.numOfLecture;
            const timeToComplete = req.body.timeToComplete;
            const teacherId = req.body.teacherId;
            const courseId = req.body.courseId;

            const response = await sectionService.updateSection(id, name, numOfLecture, timeToComplete, teacherId, courseId);
            return res.status(response.status).send(response);
        } catch (error) {
            return{
                message: error,
                status: 500
            }
        }
    }

    public deleteSection = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;

            const response = await sectionService.deleteSection(Number(id));
            return res.status(response.status).send(response);
        } catch (error) {
            return{
                message: error,
                status: 500
            }
        }
    }

    public deleteSectionsInCourse = async (req: Request, res: Response) => {
        try {
            const id = req.params.courseId;

            const response = await sectionService.deleteSectionsInCourse(Number(id));
            return res.status(response.status).send(response);
        } catch (error) {
            return{
                message: error,
                status: 500
            }
        }
    }
}

export default new sectionController();