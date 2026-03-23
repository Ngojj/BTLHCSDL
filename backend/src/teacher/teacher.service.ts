import { db } from "../db/db"
import { user } from "../db/schema"
import { teacher } from "../db/schema"
import { eq, sql } from "drizzle-orm"
import userService from "../user/user.service"
import authService from "../auth/auth.service"
class TeacherService {
    
    private generateUniqueTeacherId =  async (id: number) => {
        let uniqueId: string = 'TC'
    
        const lenId : number = id.toString().length

        for(let i = 0; i < 8 - lenId; i++){
            uniqueId += '0'
        }

        uniqueId += id.toString()
    
        return uniqueId;
    }

    public getAllTeachers = async () => {
        const teachers = await db.select(
            {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                role: user.role,
                email: user.email,
                bankName: user.bankName,
                bankAccount: user.bankAccount,
                teacherId: teacher.teacherId,
            }
        ).from(user)
        .innerJoin(teacher, eq(teacher.userId, user.id))
        
        return teachers;
    }

    public getTeacherById = async (id: number) => {
        const teacherById = await db.select(
            {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                role: user.role,
                email: user.email,
                bankName: user.bankName,
                bankAccount: user.bankAccount,
                teacherId: teacher.teacherId,
            }
        ).from(user)
        .innerJoin(teacher, eq(teacher.userId, user.id))
        .where(eq(user.id, id))
        
        return teacher;
    }

    public getTeacherByTeacherId = async (teacherId: number) => {
        const teacherByTeacherId = await db.select(
            {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                role: user.role,
                email: user.email,
                bankName: user.bankName,
                bankAccount: user.bankAccount,
                teacherId: teacher.teacherId,
            }
        ).from(user)
        .innerJoin(teacher, eq(teacher.userId, user.id))
        .where(eq(teacher.userId, teacherId))
        
        return teacherByTeacherId;
    }

    public ensureTeacherAccount = async (userId: number) => {
        const existingTeacher = await db.select({
            userId: teacher.userId,
            teacherId: teacher.teacherId,
        })
        .from(teacher)
        .where(eq(teacher.userId, userId))
        .limit(1)

        if (existingTeacher.length > 0) {
            return existingTeacher[0]
        }

        const existingUser = await userService.getUserById(userId)

        if (!existingUser || existingUser.length === 0) {
            return null
        }

        if (existingUser[0].role.toLowerCase() !== 'teacher') {
            return null
        }

        const generatedTeacherId = await this.generateUniqueTeacherId(userId)

        await db.insert(teacher).values({
            userId,
            teacherId: generatedTeacherId,
        })

        const createdTeacher = await db.select({
            userId: teacher.userId,
            teacherId: teacher.teacherId,
        })
        .from(teacher)
        .where(eq(teacher.userId, userId))
        .limit(1)

        return createdTeacher[0] ?? null
    }

    public createNewTeacher = async (
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
            'teacher',
            bankName,
            bankAccount
        )
        
        if(!newUser){
            console.log('error user')
            return null
        }

        const teacherId = await this.generateUniqueTeacherId(newUser[0].id)

        await db.insert(teacher)
                .values({
                    userId: newUser[0].id,
                    teacherId: teacherId,
                })

        // Query lại để lấy dữ liệu đã insert
        const newTeacher = await db.select({
            userId: teacher.userId,
            teacherId: teacher.teacherId
        })
        .from(teacher)
        .where(eq(teacher.userId, newUser[0].id))

        if (!newTeacher || newTeacher.length === 0){
            console.log('error teacher')
            return null
        }

        const token = await authService.getAccessToken(newUser[0])

        return {
            token,
            user: {
                id: newUser[0].id,
                role: newUser[0].role,
                firstName: newUser[0].firstName,
                lastName: newUser[0].lastName,
                email: newUser[0].email,
                bankName: newUser[0].bankName,
                bankAccount: newUser[0].bankAccount,
            }
        }
    }

    public updateTeacher = async (
        id: number,
        firstName: string,
        lastName: string,
        username: string,
        password: string,
        role: string,
        email: string,
        bankName: string,
        bankAccount: string,
        hashedPassword: string
    ) => {
        console.log(id, firstName, lastName, username, password, role, email, bankName, bankAccount, hashedPassword)
        const updateUser = await userService.updateUser(
            id,
            firstName,
            lastName,
            email,
            username,
            password,
        )

        if(!updateUser || updateUser.length === 0){
            return null
        }
        await db.update(teacher)
                .set({
                    userId: updateUser[0].id
                })
                .where(eq(teacher.userId, id))

        // Query lại để lấy dữ liệu đã update
        const updateTeacher = await db.select({
            teacherId: teacher.teacherId,
        })
        .from(teacher)
        .where(eq(teacher.userId, id))

        if(!updateTeacher || updateTeacher.length === 0){
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
            teacherId: updateTeacher[0].teacherId,
        }
    }

    public deleteTeacher = async (id: number) => {
        // Lấy thông tin teacher trước khi xóa
        const teacherInfo = await db.select({
            teacherId: teacher.teacherId,
        })
        .from(teacher)
        .where(eq(teacher.userId, id))

        if(!teacherInfo || teacherInfo.length === 0){
            return null
        }

        await db.delete(teacher)
                .where(eq(teacher.userId, id))

        const userToDelete = await userService.deleteUser(id, teacherInfo)

        if(!userToDelete){
            return null
        }

        return {
            userToDelete
        }
    }
}

export default new TeacherService()
