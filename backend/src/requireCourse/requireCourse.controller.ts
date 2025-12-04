import { Request, Response } from "express";
import requireCourseService from "./requireCourse.service";
class requireCourseController {
    public async getRequireCourses(req: Request, res: Response) {
        try {
            const response = await requireCourseService.getAllRequireCourses();

            return res.status(response.status).send(response);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getRequireCourseById(req: Request, res: Response) {
        try {
            const response = await requireCourseService.getRequireCourseById(Number(req.params.courseId));

            return res.status(response.status).send(response);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }


    public async insertRequireCourse(req: Request, res: Response) {
        try {
            const response = await requireCourseService.insertRequireCourse(req.body.courseId, req.body.rCourseId);

            return res.status(response.status).send(response);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async updateRequireCourse(req: Request, res: Response) {
        try {
            const response = await requireCourseService.updateRequireCourse(req.body.courseId, req.body.rCourseId, req.body.newCourseId);

            return res.status(response.status).send(response);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async deleteRequireCourse(req: Request, res: Response) {
        try {
            const response = await requireCourseService.deleteRequireCourse(req.body.courseId, req.body.rCourseId);

            return res.status(response.status).send(response);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async deleteAllRequireCourses(req: Request, res: Response) {
        try {
            const response = await requireCourseService.deleteAllRequireCourses();

            return res.status(response.status).send(response);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }   

    
}

export default new requireCourseController();