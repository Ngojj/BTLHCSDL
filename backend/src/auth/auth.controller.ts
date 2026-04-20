    import { Request, Response } from "express"
    import userService from "../user/user.service"
    import authService from "./auth.service"
    import teacherService from "../teacher/teacher.service"

    class AuthController{
        public login = async (req: Request, res: Response) => {
            try{
                    const {username, password} = req.body

                    const user = await userService.getUserByUsername(username)

                    if(!user){
                        return res.status(401).json({
                            message: "Invalid username"
                        })
                    }

                    const isPass = await authService.login(user, password)

                    if(!isPass) {
                        return res.status(401).json({
                            message: "Invalid password"
                        })
                    }

                    const token = await authService.getAccessToken(user)

                    if (user.role?.toLowerCase() === 'teacher') {
                        await teacherService.ensureTeacherAccount(user.id)
                    }

                    return res.status(200).json({
                        message: "Login successfully!",
                        token: token,
                        user: {
                            id: user.id,
                            role: user.role,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            bankName: user.bankName,
                            bankAccount: user.bankAccount,
                        }
                    })
            }catch(e){
                const message = e instanceof Error ? e.message : String(e)
                return res.status(500).json({
                    message
                })
            }
        }

    }

    export default new AuthController()
