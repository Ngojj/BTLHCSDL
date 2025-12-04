
import { db } from "../db/db";
import { teacher, teacherQualification, user } from "../db/schema";
import { eq } from "drizzle-orm";
class teacherQualificationService {
    public async getAllTeacherQualification(){
        try {
            const teacherQualifications = await db.select(
                {
                    teacherId: teacherQualification.teacherId,
                    qualification: teacherQualification.qualification
                }
            )
            .from(teacherQualification)

            return {
                status: 200,
                message: "Sucessfully",
                data: teacherQualifications
            }
        }
        catch(e){
            return {
                status: 500,
                message: "Internal link server"
            }
        }
    }

    public async getTeacherQualificationByUserId(userId: number){
        try {
            const teacherQualificationByTeacherId = await db.select(
                {
                    teacherId: teacherQualification.teacherId,
                    qualification: teacherQualification.qualification
                }
            )
            .from(teacherQualification)
            .where(eq(teacherQualification.teacherId, userId))

            return {
                status: 200,
                message: "Sucessfully",
                data: teacherQualificationByTeacherId
            }
        }
        catch(e){
            return {
                status: 500,
                message: "Internal link server"
            }
        }
    }

    public async findTeacherQualificationByTeacherEmail(email: string){
        try{
            console.log(email)
            // find teacher by email first
            const teacherByEmail = await db.select(
                {
                    email: user.email,
                    teacherId: teacher.userId
                }
            )
            .from(user)
            .innerJoin(teacher, eq(teacher.userId, user.id))
            .where(eq(user.email, email))

            // if teacher not found
            if(teacherByEmail.length === 0){
                return {
                    status: 404,
                    message: "Teacher not found"
                }
            }
            // find teacher qualification by teacherId
            const teacherQualificationByTeacherId = await db.select(
                {
                    teacherId: teacherQualification.teacherId,
                    qualification: teacherQualification.qualification
                }
            )
            .from(teacherQualification)
            .where(eq(teacherQualification.teacherId, teacherByEmail[0].teacherId))

            return {
                status: 200,
                message: "Sucessfully",
                data: teacherQualificationByTeacherId
            }

        }       
        catch(error){
            return{
                status: 500,
                message: error
            }
        }
    }

    public async createTeacherQualification(userId: number, qualification: string){
        try{
            // check if teacherId exist
            const teacherExist = await db.select(
                {
                    teacherId: teacherQualification.teacherId
                }
            )
            .from(teacherQualification)
            .where(eq(teacherQualification.teacherId, userId))

            if (teacherExist.length !== 0){
                return {
                    status: 404,
                    message: "This qualification already exist"
                }
            }
            const teacherQualificationData = {
                teacherId: userId,
                qualification: qualification
            }

            const newQuali = await db.insert(teacherQualification)
                    .values(teacherQualificationData)
                    .returning(
                        {
                            teacherId: teacherQualification.teacherId,
                            qualification: teacherQualification.qualification
                        }
                    )

            return {
                status: 200,
                message: "Successfully",
                data: {
                    teacherId: newQuali[0].teacherId,
                    qualification: newQuali[0].qualification
                }
            }
        }
        catch(e){
            return {
                status: 500,
                message: "Internal link server"
            }
        }
    }

    public async updateTeacherQualification(userId: number, qualification: string){
        try{
            // check if teacherId exist
            const teacherExist = await db.select(
                {
                    teacherId: teacherQualification.teacherId
                }
            )
            .from(teacherQualification)
            .where(eq(teacherQualification.teacherId, userId))

            if (teacherExist.length === 0){
                return {
                    status: 404,
                    message: "This qualification does not exist"
                }
            }

            const teacherQualificationData = {
                teacherId: userId,
                qualification: qualification
            }

            const newQuali = await db.update(teacherQualification)
                    .set(teacherQualificationData)
                    .where(eq(teacherQualification.teacherId, userId))
                    .returning(
                        {
                            teacherId: teacherQualification.teacherId,
                            qualification: teacherQualification.qualification
                        }
                    )

            return {
                status: 200,
                message: "Successfully",
                data: {
                    teacherId: newQuali[0].teacherId,
                    qualification: newQuali[0].qualification
                }
            }
        }
        catch(e){
            return {
                status: 500,
                message: "Internal link server"
            }
        }
    }
    
    public async deleteTeacherQualification(userId: number){
        try{
            // check if teacherId exist
            const teacherExist = await db.select(
                {
                    teacherId: teacherQualification.teacherId
                }
            )
            .from(teacherQualification)
            .where(eq(teacherQualification.teacherId, userId))

            if (teacherExist.length === 0){
                return {
                    status: 404,
                    message: "This qualification does not exist"
                }
            }

            await db.delete(teacherQualification)
                    .where(eq(teacherQualification.teacherId, userId))

            return {
                status: 200,
                message: "Successfully"
            }
        }
        catch(e){
            return {
                status: 500,
                message: "Internal link server"
            }
        }
    }
}


export default new teacherQualificationService();