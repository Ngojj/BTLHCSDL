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
        const { courseId, studentId, progress, GPA, dateComplete, dateStart } = req.body;

        if (!courseId || !studentId || progress === undefined) {
            return res.status(400).json({
                message: "Thiếu thông tin bắt buộc: courseId, studentId, progress",
                status: 400
            });
        }

        // Validate progress
        if (progress < 0 || progress > 100) {
            return res.status(400).json({
                message: "Tiến độ phải từ 0 đến 100",
                status: 400
            });
        }

        // Validate GPA
        if (GPA !== null && GPA !== undefined && (GPA < 0 || GPA > 10)) {
            return res.status(400).json({
                message: "GPA phải từ 0 đến 10",
                status: 400
            });
        }

        try {
            const response = await joinService.updateJoin({
                courseId: Number(courseId),
                studentId: Number(studentId),
                progress: Number(progress),
                GPA: GPA !== null && GPA !== undefined ? Number(GPA) : null,
                dateComplete: dateComplete || null,
                dateStart: dateStart || new Date().toISOString().split('T')[0]
            });

            return res.status(response.status).json(response);
        } catch (error: any) {
            return res.status(500).json({
                message: error?.message || "Lỗi server khi cập nhật",
                status: 500
            });
        }
    }

    public async deleteJoin(req: Request, res: Response) {
        const { courseId, studentId } = req.params;

        if (!courseId || !studentId) {
            return res.status(400).json({
                message: "Thiếu courseId hoặc studentId",
                status: 400
            });
        }

        try {
            const response = await joinService.deleteJoin(Number(courseId), Number(studentId));

            return res.status(response.status).json(response);
        } catch (error: any) {
            return res.status(500).json({
                message: error?.message || "Lỗi server khi xóa",
                status: 500
            });
        }
    }
}

export default new joinController();
