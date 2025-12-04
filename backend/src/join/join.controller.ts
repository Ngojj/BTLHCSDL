import { Request, Response } from 'express';
import joinService from './join.service';
class joinController {
    public async getJoins(req: Request, res: Response) {
        try {
            const response = await joinService.getAllJoin();

            return res.status(response.status).send(response);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getJoinById(req: Request, res: Response) {
        try {
            const response = await joinService.getJoinById(Number(req.params.courseId), Number(req.params.studentId));

            return res.status(response.status).send(response);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getJoinByCourseId(req: Request, res: Response) {
        try {
            const response = await joinService.getJoinByCourseId(Number(req.params.courseId));

            return res.status(response.status).send(response);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getJoinByTeacherId(req: Request, res: Response) {
        try {
            const response = await joinService.getJoinByTeacherId(Number(req.params.teacherId));

            return res.status(response.status).send(response);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }
    public async getJoinByStudentId(req: Request, res: Response) {
        try {
            const response = await joinService.getJoinByStudentId(Number(req.params.studentId));

            return res.status(response.status).send(response);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async createJoin(req: Request, res: Response) {
        
        const { courseId, studentId } = req.body

        try {
            const response = await joinService.createJoin(courseId, studentId);

            return res.status(response.status).send(response);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async updateJoin(req: Request, res: Response) {
        try {
            const response = await joinService.updateJoin(req.body);

            return res.status(response.status).send(response);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async deleteJoin(req: Request, res: Response) {
        try {
            const response = await joinService.deleteJoin(Number(req.params.courseId), Number(req.params.studentId));

            return res.status(response.status).send(response);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }
}

export default new joinController();