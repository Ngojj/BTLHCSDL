import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { roadCertification } from "../db/schema";
import { roadCertificationDto } from "../dtos/roadCertification.dto";

class roadCertificationService {
  public async getRoadCertificationById(id: number) {
    // Your code here
    try {
        const returnVal = await db.select({
            id: roadCertification.id,
            name: roadCertification.name,
            expDate: roadCertification.expDate,
            issueDate: roadCertification.issueDate,
            courseId: roadCertification.courseId,
            studentId: roadCertification.studentId
        })
        .from(roadCertification)
        .where(eq(roadCertification.id, id))

        return {
            message: returnVal,
            status: 200
        }
    } catch (error) {
        return {
            message: error,
            status: 500
        }    
    }
  }

  public async getALLRoadCertification() {
    // Your code here
    try {
        const returnVal = await db.select({
            id: roadCertification.id,
            name: roadCertification.name,
            expDate: roadCertification.expDate,
            issueDate: roadCertification.issueDate,
            courseId: roadCertification.courseId,
            studentId: roadCertification.studentId
        })
        .from(roadCertification)

        return {
            message: returnVal,
            status: 200
        }
    } catch (error) {
        return {
            message: error,
            status: 500
        }    
    }
  }
  
  public async createRoadCertification(roadCertificationDto: roadCertificationDto){
    // Your code here
    try {
        const returnVal = await db.insert(roadCertification).values({
            name: roadCertificationDto.name,
            expDate: roadCertificationDto.expDate,
            issueDate: roadCertificationDto.issueDate,
            courseId: roadCertificationDto.courseId,
            studentId: roadCertificationDto.studentId
        })

        return {
            message: returnVal,
            status: 200
        }
    } catch (error) {
        return {
            message: error,
            status: 500
        }
    }
  }
    public async updateRoadCertification(roadCertificationDto: roadCertificationDto){
        // Your code here
        try {
            const returnVal = await db.update(roadCertification).set({
                name: roadCertificationDto.name,
                expDate: roadCertificationDto.expDate,
                issueDate: roadCertificationDto.issueDate,
                courseId: roadCertificationDto.courseId,
                studentId: roadCertificationDto.studentId
            })
            .where(eq(roadCertification.id, roadCertificationDto.id))
    
            return {
                message: returnVal,
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async deleteRoadCertification(id: number){
        // Your code here
        try {
            const returnVal = await db.delete(roadCertification).where(eq(roadCertification.id, id))
    
            return {
                message: returnVal,
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

export default new roadCertificationService();