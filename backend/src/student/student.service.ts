import { eq, sql } from "drizzle-orm"
import { db } from "../db/db"
import { student, user } from "../db/schema"
import userService from "../user/user.service"
import authService from "../auth/auth.service"
import joinService from "../join/join.service"


class StudentService{

    private generateUniqueStudentId =  async (id: number) => {
        let uniqueId: string = 'SV'
    
        const lenId : number = id.toString().length

        for(let i = 0; i < 8 - lenId; i++){
            uniqueId += '0'
        }

        uniqueId += id.toString()
    
        return uniqueId;
    }

    public getAllStudents = async () => {
        return await db
        .select({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            role: user.role,
            email: user.email,
            bankName: user.bankName,
            bankAccount: user.bankAccount,
            studentId: student.studentId,
            enrollmentDate: student.enrollmentDate,
            numberCourseEnrolled: student.numberCoursesEnrolled,
            numberCourseCompleted: student.numberCoursesCompleted
        })
        .from(user)
        .innerJoin(student, eq(student.userId, user.id))
    }

    public getStudentById = async (id: number) =>{
        return await db
        .select({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            role: user.role,
            email: user.email,
            bankName: user.bankName,
            bankAccount: user.bankAccount,
            studentId: student.studentId,
            enrollmentDate: student.enrollmentDate,
            numberCourseEnrolled: student.numberCoursesEnrolled,
            numberCourseCompleted: student.numberCoursesCompleted
        })
        .from(user)
        .innerJoin(student, eq(student.userId, user.id))
        .where(eq(user.id, id))
    }

    public createStudent = async (
        firstName: string,
        lastName: string,
        username: string,
        password: string,
        email: string,
        bankName: string,
        bankAccount: string,
    ) => {
        const newUser = await userService.createNewUser(
            firstName,
            lastName,
            email,
            username,
            password,
            'student',
            bankName,
            bankAccount
        )

        if(!newUser || newUser.length === 0){
            return null
        }

        const studentId = await this.generateUniqueStudentId(newUser[0].id)

        const newStudent = await db
        .insert(student)
        .values({
            userId: newUser[0].id,
            studentId: studentId,
            enrollmentDate: new Date().toISOString(),
            numberCoursesEnrolled: 0,
            numberCoursesCompleted: 0,
        })
        .returning({
            studentId: student.studentId,
            enrollmentDate: student.enrollmentDate,
            numberCoursesEnrolled: student.numberCoursesEnrolled,
            numberCoursesCompleted: student.numberCoursesCompleted
        })

        if(!newStudent || newStudent.length === 0) {
            return null
        }

        const token = await authService.getAccessToken(newUser[0])

        return {
            token
        }
    }

    public updateNumberOfCourseComplete = async (studentId: number) => {
        try{
            const CourseComplete = await joinService.getJoinCompleted(studentId)
            
            await db
            .update(student)
            .set({
                numberCoursesCompleted: CourseComplete
            })
            .where(eq(student.userId, studentId))
        }catch(e){
            console.log(e)
        }
    }

    public updateNumberOfCourseEnroll = async (studentId: number) => {
        try{
            const CourseEnroll = await joinService.getJoinEnroll(studentId)
            
            await db
            .update(student)
            .set({
                numberCoursesEnrolled: CourseEnroll
            })
            .where(eq(student.userId, studentId))
        }catch(e){
            console.log(e)
        }
    }

    public updateStudent = async (
        id: number,
        firstName: string,
        lastName: string,
        email: string,
        bankName: string,
        bankAccount: string,
    ) => {

        const updateUser = await userService.updateUser(
            id,
            firstName,
            lastName,
            email,
            bankName,
            bankAccount,
            )

        if(!updateUser || updateUser.length === 0) {
            return null
        }

        return {
            id: updateUser[0].id,
            firstName: updateUser[0].firstName,
            lastName: updateUser[0].lastName,
            username: updateUser[0].username,
            role: updateUser[0].role,
            email: updateUser[0].email,
            bankName: updateUser[0].bankName,
            bankAccount: updateUser[0].bankAccount,
        }
    }

    public deleteStudent = async (id: number) => {
        const deleteStudent = await db
        .delete(student)
        .where(eq(student.userId, id))
        .returning({
            studentId: student.studentId,
            enrollmentDate: student.enrollmentDate,
            numberCourseEnrolled: student.numberCoursesEnrolled,
            numberCourseCompleted: student.numberCoursesCompleted
        })

        if(!deleteStudent || deleteStudent.length === 0){
            return null
        }

        return await userService.deleteUser(id, deleteStudent)
    }
}

export default new StudentService()



