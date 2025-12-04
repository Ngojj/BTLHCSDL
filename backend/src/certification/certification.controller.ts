import { Request, response, Response } from 'express';
import certificationService from './certification.service';
class certificationController{
    public async getCertifications(req: Request, res: Response) {
        try {
            const response = await certificationService.getAllCertifications();
            return res.status(response.status).send(response);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getCertificationById(req: Request, res: Response) {
        try {
            const response = await certificationService.getCertificationById(Number(req.params.id));
            return res.status(response.status).send(response);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

     public async getCertificationByCourseId(req: Request, res: Response) {
        try {
            const response = await certificationService.getCertificationByCourseId(Number(req.params.courseId));
            return res.status(response.status).send(response);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }
    
    public async getCertificationByStudentId(req: Request, res: Response) {
        try {
            const response = await certificationService.getCertificationByStudentId(Number(req.params.studentId));
            return res.status(response.status).send(response);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async createCertification(req: Request, res: Response) {
        try {
            const response = await certificationService.createCertification(req.body);
            return res.status(response.status).send(response);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async updateCertification(req: Request, res: Response) {
        try {
            const response = await certificationService.updateCertification(req.body);
            return res.status(response.status).send(response);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async deleteCertification(req: Request, res: Response) {
        try {
            const response = await certificationService.deleteCertification(Number(req.params.id));
            return res.status(response.status).send(response);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async deleteCertificationByCourseId(req: Request, res: Response) {
        try {
            const response = await certificationService.deleteCertificationByCourseId(Number(req.params.courseId));
            return res.status(response.status).send(response);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async deleteCertificationByStudentId(req: Request, res: Response) {
        try {
            const response = await certificationService.deleteCertificationByStudentId(Number(req.params.studentId));
            return res.status(response.status).send(response);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }
}

export default new certificationController();