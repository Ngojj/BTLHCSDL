    import { db } from "../db/db"
    import { user } from "../db/schema"
    import { eq } from "drizzle-orm"

    const bcrypt = require('bcrypt')
    const saltRounds = 10

    class UserService{
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
                bankAccout: user.bankAccount,
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
                bankAccout: user.bankAccount,
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
            
            const hashedPassword = await bcrypt.hash(password, saltRounds)

            const newUser = await db
            .insert(user)
            .values({firstName,
                lastName,
                email,
                username,
                password: hashedPassword,
                role,
                bankAccount,
                bankName})
            .returning({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                password: user.password,
                role: user.role,
                email: user.email,
                bankName: user.bankName,
                bankAccount: user.bankAccount,
            })

            return newUser
        }

        public updateUser = async (
            id: number,
            firstName: string, 
            lastName: string,
            email: string, 
            bankName: string,
            bankAccount: string,
        ) => {

            const data = await db
            .update(user)
            .set({
                firstName,
                lastName,
                email,
                bankAccount,
                bankName
                })
            .where(eq(user.id, id))
            .returning({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                role: user.role,
                email: user.email,
                bankName: user.bankName,
                bankAccount: user.bankAccount,
            })

            return data
        }

        public deleteUser= async (id: number, deleteStudentOrteacher: any) => {
            const deleteUser = await db
            .delete(user)
            .where(eq(user.id,id))
            .returning({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                role: user.role,
                email: user.email,
                bankName: user.bankName,
                bankAccount: user.bankAccount,
            })

            if(!deleteUser || deleteUser.length === 0){
                return null
            }

            return {
                id: deleteUser[0].id,
                firstName: deleteUser[0].firstName,
                lastName: deleteUser[0].lastName,
                username: deleteUser[0].username,
                role: deleteUser[0].role,
                email: deleteUser[0].email,
                bankName: deleteUser[0].bankName,
                bankAccount: deleteUser[0].bankAccount,
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

    }

    export default new UserService()