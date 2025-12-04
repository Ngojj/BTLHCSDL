import includeCourseService from "./includeCourse.service";
import { Request, Response } from "express";
class includeCourseController {
    public async getAllIncludeCourse(req: Request, res: Response) {
        try {
            const All = await includeCourseService.getAllIncludeCourse();

            return res.status(All.status).send(All);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getIncludeCourseById(req: Request, res: Response) {
        try {
            const All = await includeCourseService.getIncludeCourseById(Number(req.params.rmId), Number(req.params.courseId));

            return res.status(All.status).send(All);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getIncludeCourseByrmId(req: Request, res: Response) {
        try {
            const All = await includeCourseService.getIncludeCourseByrmId(Number(req.params.rmId));

            return res.status(All.status).send(All);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getGetRoadmapOfStudentByStudentId(req: Request, res: Response) {
        try {
            const response = await includeCourseService.getRoadmapOfStudentByStudentId(Number(req.params.studentId));

            return res.status(response.status).send(response);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async createIncludeCourse(req: Request, res: Response) {
        try {
            const resonse = await includeCourseService.createIncludeCourse(req.body);

            return res.status(resonse.status).send(resonse);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async updateIncludeCourse(req: Request, res: Response) {
        try {
            await includeCourseService.updateIncludeCourse(req.body);

            return res.status(200).send();
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }
    public async  deleteIncludeCourse(req: Request, res: Response) {
        try {
            await includeCourseService.deleteIncludeCourse(Number(req.params.rmId), Number(req.params.courseId));

            return res.status(200).send();
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

}

export default new includeCourseController();