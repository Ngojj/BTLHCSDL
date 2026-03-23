import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { lecture } from "../db/schema";
import { lectureDto } from "../dtos/lecture.dto";

class lectureService {
    public async getAllLectures(){
        try {
            const lectures = await db.select({
                id: lecture.id,
                name: lecture.name,
                state: lecture.state,
                material: lecture.material,
                reference: lecture.reference,
                sectionId: lecture.sectionId
            })

            return {
                data: lectures,
                status: 200,
                message: "Lectures fetched successfully"
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }    
        }

    }

    public async getLectureByName(name: string){
        try {
            const lectures = await db.select({
                id: lecture.id,
                name: lecture.name,
                state: lecture.state,
                material: lecture.material,
                reference: lecture.reference,
                sectionId: lecture.sectionId
            })
            .from(lecture)
            .where(eq(lecture.name, name))

            return {
                data: lectures,
                status: 200,
                message: "Lecture fetched successfully"
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }    
        }
    }

    public async getLectureBySectionId(sectionId: number){
        try {
            console.log(sectionId)
            const lectures = await db.select({
                id: lecture.id,
                name: lecture.name,
                state: lecture.state,
                material: lecture.material,
                reference: lecture.reference,
                sectionId: lecture.sectionId
            })
            .from(lecture)
            .where(eq(lecture.sectionId, sectionId))

            return {
                data: lectures,
                status: 200,
                message: "Lecture fetched successfully"
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }    
        }
    }

    public async createLecture(lectureDto: lectureDto){
        try {
            await db.insert(lecture).values(lectureDto)
            
            // Query lại để lấy lectureId (dùng name và sectionId để tìm)
            const createdLecture = await db.select({
                id: lecture.id
            })
            .from(lecture)
            .where(eq(lecture.name, lectureDto.name))
            .limit(1)

            if (!createdLecture || createdLecture.length === 0) {
                return {
                    message: "Failed to create lecture",
                    status: 500
                }
            }

            return {
                data: createdLecture[0].id,
                message: "Lecture created successfully",
                status: 200
            }
        } catch (error) {
            console.log(error);
            return {
                message: error,
                status: 500
            }
        }
    }

    public async updateLecture(lectureDto: lectureDto){
        try {
            const returnVal = await db.update(lecture).set(lectureDto).where(eq(lecture.id, lectureDto.id))

            return {
                data: returnVal,
                message: "Lecture updated successfully",
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async deleteLecture(id: number){
        try {
            const returnVal = await db.delete(lecture).where(eq(lecture.id, id))

            return {
                data: returnVal,
                message: "Lecture deleted successfully",
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

export default new lectureService();