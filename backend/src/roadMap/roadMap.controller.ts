import roadMapService from "./roadMap.service";
import { Request, Response } from "express";
class roadMapController{
    public async getRoadMaps(req: Request, res: Response){
        // Get all roadmaps
        try {
            const roadMaps = await roadMapService.getAllRoadMaps();

            return res.status(roadMaps.status).send(roadMaps);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getRoadMapById(req: Request, res: Response){
        // Get roadmap by id
        try {
            const id = req.params.id;
            const roadMapById = await roadMapService.getRoadMapById(Number(id));

            return res.status(roadMapById.status).send(roadMapById);
            
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async createRoadMap(req: Request, res: Response){
        // Create a new roadmap
        try {
            const roadMap = req.body;
            const includeCourse = req.body.includeCourse;
            const newRoadMap = await roadMapService.createRoadMap(roadMap, includeCourse);

            return res.status(newRoadMap.status).send(newRoadMap);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async updateRoadMap(req: Request, res: Response){
        // Update roadmap
        try {
            const roadMap = req.body;
            const updatedRoadMap = await roadMapService.updateRoadMap(roadMap);

            return res.status(updatedRoadMap.status).send(updatedRoadMap);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async deleteRoadMap(req: Request, res: Response){
        // Delete roadmap
        try {
            const id = req.params.id;
            const deletedRoadMap = await roadMapService.deleteRoadMap(Number(id));

            return res.status(deletedRoadMap.status).send(deletedRoadMap);
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }
}

export default new roadMapController();