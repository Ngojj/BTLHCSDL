import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { includeCourse, roadMap } from "../db/schema";
import { roadMapDto } from "../dtos/roadMap.dto";
import { includeCourseDto } from "../dtos/includeCourse.dto";

class roadMapService {
    public async getAllRoadMaps(){ 
        // Get all roadmaps
        try {
            const roadMaps = await db.select(
                {
                    id: roadMap.id,
                    instruction: roadMap.instruction,
                    description: roadMap.description,
                    name: roadMap.name,
                    teacherId: roadMap.teacherId
                }
            ).
            from(roadMap);

            return {
                data: roadMaps,
                status: 200,
                message: "Roadmaps fetched successfully"
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getRoadMapById(id: number){
        // Get roadmap by id
        try {
            const roadMapById = await db.select(
                {
                    id: roadMap.id,
                    instruction: roadMap.instruction,
                    description: roadMap.description,
                    name: roadMap.name,
                    teacherId: roadMap.teacherId
                }
            ).
            from(roadMap).
            where(eq(roadMap.id, id));

            return {
                data: roadMapById,
                status: 200,
                message: "Roadmap fetched successfully"
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async createRoadMap(roadMapData: roadMapDto, includeCourseDto: includeCourseDto[]){
        // Create roadmap
        try {

            // print out the roadMapData and includeCourseDto
            console.log(roadMapData);
            console.log(includeCourseDto);

            const newRoadMap = await db.insert(roadMap).
            values({
                instruction: roadMapData.instruction,
                description: roadMapData.description,
                name: roadMapData.name,
                teacherId: roadMapData.teacherId
            })
            .returning({
                id: roadMap.id
            });


            // Add courses to roadmap
            let order = 1;

            includeCourseDto.forEach(async (course) => {
                await db.insert(
                    includeCourse
                )
                .values({
                    rmId: newRoadMap[0].id,
                    courseId: course.courseId,
                    order: order++
                })
                .returning({
                    rmId: includeCourse.rmId,
                    courseId: includeCourse.courseId,
                    order: includeCourse.order
                });
            });

            return {
                status: 200,
                message: "Roadmap created successfully"
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async updateRoadMap(roadMapData: roadMapDto){
        // Update roadmap
        try {
            await db.update(roadMap).
            set({
                instruction: roadMapData.instruction,
                description: roadMapData.description,
                name: roadMapData.name,
                teacherId: roadMapData.teacherId
            }).
            where(eq(roadMap.id, roadMapData.id));

            return {
                status: 200,
                message: "Roadmap updated successfully"
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async deleteRoadMap(id: number){
        // Delete roadmap
        try {
            await db.delete(roadMap).
            where(eq(roadMap.id, id));

            return {
                status: 200,
                message: "Roadmap deleted successfully"
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    
}

export default new roadMapService();