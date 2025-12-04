import { and, eq } from "drizzle-orm";
import { db } from "../db/db";
import { viewRoadMap } from "../db/schema";
import { viewRoadMapDto } from "../dtos/viewRoadMap.dto";

class viewRoadMapService {
    public async getAllRoadMap(){
        try {
            const all = db.select({
                rmId: viewRoadMap.rmId,
                studentId: viewRoadMap.studentId,
                suitability: viewRoadMap.suitability,
                timeSuitabilty: viewRoadMap.timeSuitabilty,
                courseSui: viewRoadMap.courseSui
            })
            .from(viewRoadMap)

            return {
                data: all,
                status: 200,
                message: "All RoadMap found"
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getRoadMapById(id: number){
        try {
            const roadMap = db.select({
                rmId: viewRoadMap.rmId,
                studentId: viewRoadMap.studentId,
                suitability: viewRoadMap.suitability,
                timeSuitabilty: viewRoadMap.timeSuitabilty,
                courseSui: viewRoadMap.courseSui
            })
            .from(viewRoadMap)
            .where(eq(viewRoadMap.rmId, id))

            return {
                data: roadMap,
                status: 200,
                message: "RoadMap found"
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getRoadMapByStudentId(id: number){
        try {
            const roadMap = db.select({
                rmId: viewRoadMap.rmId,
                studentId: viewRoadMap.studentId,
                suitability: viewRoadMap.suitability,
                timeSuitabilty: viewRoadMap.timeSuitabilty,
                courseSui: viewRoadMap.courseSui
            })
            .from(viewRoadMap)
            .where(eq(viewRoadMap.studentId, id))

            return {
                data: roadMap,
                status: 200,
                message: "RoadMap found"
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getRoadMapByStudentIdAndRoadMapId(studentId: number, roadMapId: number){
        try {
            const roadMap = db.select({
                rmId: viewRoadMap.rmId,
                studentId: viewRoadMap.studentId,
                suitability: viewRoadMap.suitability,
                timeSuitabilty: viewRoadMap.timeSuitabilty,
                courseSui: viewRoadMap.courseSui
            })
            .from(viewRoadMap)
            .where(and(eq(viewRoadMap.studentId, studentId), eq(viewRoadMap.rmId, roadMapId)))
            return {
                data: roadMap,
                status: 200,
                message: "RoadMap found"
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async createRoadMap(viewRoadMapDto: viewRoadMapDto){
        try {
            const roadMap = db.insert(viewRoadMap)
            .values(viewRoadMapDto)

            return {
                message: "RoadMap created successfully",
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async updateRoadMap(viewRoadMapDto : viewRoadMapDto){
        try {
            const roadMap = db.update(viewRoadMap)
            .set({
                suitability: viewRoadMapDto.suitability,
                timeSuitabilty: viewRoadMapDto.suitability,
                courseSui: viewRoadMapDto.courseSui
            })
            .where(and(eq(viewRoadMap.rmId, viewRoadMapDto.rmId), eq(viewRoadMap.studentId, viewRoadMapDto.studentId)))

            return {
                message: "RoadMap updated successfully",
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }
    public async deleteRoadMap(rmId: number, studentId: number){
        try {
            const roadMap = db.delete(viewRoadMap)
            .where(and(eq(viewRoadMap.rmId, rmId), eq(viewRoadMap.studentId, studentId)))

            return {
                message: "RoadMap deleted successfully",
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }
}

export default new viewRoadMapService();