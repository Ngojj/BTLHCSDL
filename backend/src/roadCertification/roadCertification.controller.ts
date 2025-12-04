
import {Request, Response} from 'express';
import roadCertificationService from './roadCertification.service';
class roadCertificationController {
    public async getALLRoadCertification(req: Request, res: Response){
        try {
            const result = await roadCertificationService.getALLRoadCertification();

            return res.status(result.status).json(result.message);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getRoadCertificationById(req: Request, res: Response){
        try {
            const result = await roadCertificationService.getRoadCertificationById(Number(req.params.id));

            return res.status(result.status).json(result.message);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async createRoadCertification(req: Request, res: Response){
        try {
            const result = await roadCertificationService.createRoadCertification(req.body);

            return res.status(result.status).json(result.message);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async updateRoadCertification(req: Request, res: Response){
        try {
            const result = await roadCertificationService.updateRoadCertification(req.body);

            return res.status(result.status).json(result.message);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }
    
    public async deleteRoadCertification(req: Request, res: Response){
        try {
            const result = await roadCertificationService.deleteRoadCertification(Number(req.params.id));

            return res.status(result.status).json(result.message);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }
}

export default new roadCertificationController();