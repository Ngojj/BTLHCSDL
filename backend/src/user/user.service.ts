    import { db } from "../db/db"
    import { user } from "../db/schema"
    import { eq } from "drizzle-orm"

    const bcrypt = require('bcrypt')
    const saltRounds = 10

    class UserService{
        private readonly usernameRegex = /^[A-Za-z0-9_]{4,}$/
        public getAllUsers = async () =>{
            const all = await db
            .select({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                role: user.role,
                email: user.email,
                bankName: user.bankName,
                bankAccount: user.bankAccount,
            })
            .from(user)

            return all;
        }

        public getUserById = async (id: number) => {
            const data = await db
            .select({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                role: user.role,
                email: user.email,
                bankName: user.bankName,
                bankAccount: user.bankAccount,
            })
            .from(user)
            .where(eq(user.id, id))

            return data;
        }

        public getUserByIdWithPassword = async (id: number) => {
            const data = await db
            .select()
            .from(user)
            .where(eq(user.id, id))

            return data;
        }


        public createNewUser = async (
            firstName: string, 
            lastName: string,
            email: string, 
            username: string, 
            password: string, 
            role: string, 
            bankName: string,
            bankAccount: string) => {
            const normalizedUsername = String(username ?? "").trim()
            if (!this.usernameRegex.test(normalizedUsername)) {
                throw new Error("Username must be at least 4 characters and contain only letters, numbers, underscores")
            }

            const existingByUsername = await this.getUserByUsername(normalizedUsername)
            if (existingByUsername) {
                throw new Error("Tên đăng nhập đã tồn tại")
            }

            const existingByEmail = await this.getUserByEmail(email)
            if (existingByEmail) {
                throw new Error("Email đã được sử dụng")
            }

            try {
                const hashedPassword = await bcrypt.hash(password, saltRounds)

                await db
                .insert(user)
                .values({firstName,
                    lastName,
                    email,
                    username: normalizedUsername,
                    password: hashedPassword,
                    role,
                    bankAccount,
                    bankName})

                const createdUser = await this.getUserByUsername(normalizedUsername)

                return createdUser ? [createdUser] : []
            } catch (error: any) {
                const message = String(error?.message || "")
                if (message.includes("Duplicate entry") && message.includes("username")) {
                    throw new Error("Tên đăng nhập đã tồn tại")
                }
                if (message.includes("Duplicate entry") && message.includes("email")) {
                    throw new Error("Email đã được sử dụng")
                }
                throw error
            }
        }

        public updateUser = async (
            id: number,
            firstName: string, 
            lastName: string,
            email: string, 
            bankName: string,
            bankAccount: string,
        ) => {

            await db
            .update(user)
            .set({
                firstName,
                lastName,
                email,
                bankAccount,
                bankName
                })
            .where(eq(user.id, id))

            return await this.getUserById(id)
        }

        public deleteUser= async (id: number, deleteStudentOrteacher: any) => {
            const existingUser = await this.getUserById(id)

            if(!existingUser || existingUser.length === 0){
                return null
            }

            await db
            .delete(user)
            .where(eq(user.id,id))

            return {
                id: existingUser[0].id,
                firstName: existingUser[0].firstName,
                lastName: existingUser[0].lastName,
                username: existingUser[0].username,
                role: existingUser[0].role,
                email: existingUser[0].email,
                bankName: existingUser[0].bankName,
                bankAccount: existingUser[0].bankAccount,
                studentId: deleteStudentOrteacher[0].studentId,
                enrollmentDate: deleteStudentOrteacher[0].enrollmentDate,
                numberCoursesEnrolled: deleteStudentOrteacher[0].numberCoursesEnrolled,
                numberCoursesCompleted: deleteStudentOrteacher[0].numberCoursesCompleted,
            }
        }

        public getUserByUsername = async (username: string) => {
            const data = await db
            .select()
            .from(user)
            .where(eq(user.username,username))
            .limit(1)
            
            return data[0]
        }

        public getUserByEmail = async (email: string) => {
            const data = await db
            .select()
            .from(user)
            .where(eq(user.email, email))
            .limit(1)

            return data[0]
        }

    }

    export default new UserService()
