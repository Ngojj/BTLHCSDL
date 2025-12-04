import { Request, Response } from "express";
import teacherQualificationService from "./teacherQualification.service";
import { stat } from "fs";
class teacherQualificationController {
    public getAllTeacherQualification = async (req: Request, res: Response) => {
        const result =  teacherQualificationService.getAllTeacherQualification();

        if ((await result).status === 200){
            return res.status(200).json({
                status: 200,
                message: 'success',
                data: (await result).data
            })
        }else{
            return res.status(500).json({
                message: 'Internal server error'
            })
        }
    }

    public async getTeacherQualificationByUserId(req: Request, res: Response){
        const {userId }= req.params;
        const result = teacherQualificationService.getTeacherQualificationByUserId(Number(userId));

        if ((await result).status === 200){
            return res.status(200).json({
                status: 200,
                message: 'success',
                data: (await result).data
            })
        }
        else{
            return res.status(500).json({
                message: (await result).message,
                status: (await result).status
            })
        }
    }

    public async findTeacherQualificationByTeacherEmail(req: Request, res: Response){
        const email = req.params.email;
        const result = teacherQualificationService.findTeacherQualificationByTeacherEmail(email);

        if ((await result).status === 200){
            return res.status(200).json({
                status: 200,
                message: 'success',
                data: (await result).data
            })
        }
        else{
            return res.status(500).json({
                message: (await result).message,
                status: (await result).status
            })
        }
    }

    public async createTeacherQualification(req: Request, res: Response){
        const teacherId = req.body.userId
        const qualification = req.body.qualification

        const result = await teacherQualificationService.createTeacherQualification(teacherId, qualification)

        if (result.status === 200){
            return res.status(200).json({
                status: 200,
                message: 'Successfully',
                data: result.data
            })
        }
        else{
            return res.status(500).json({
                message: result.message,
                status: result.status
            })
        }
    }

    public async updateTeacherQualification(req: Request, res: Response){
        const teacherId = req.body.userId
        const qualification = req.body.qualification

        const result = await teacherQualificationService.updateTeacherQualification(teacherId, qualification)

        if (result.status === 200){
            return res.status(200).json({
                status: 200,
                message: 'Successfully',
                data: result.data
            })
        }
        else{
            return res.status(500).json({
                message: result.message,
                status: result.status
            })
        }
    }


    public async deleteTeacherQualification(req: Request, res: Response){
        const userId = req.body.userId;

        const result = await teacherQualificationService.deleteTeacherQualification(userId);

        if (result.status === 200){
            return res.status(200).json({
                status: 200,
                message: 'Successfully'
            })
        }
        else{
            return res.status(500).json({
                message: result.message,
                status: result.status
            })
        }
    }
}

export default new teacherQualificationController();