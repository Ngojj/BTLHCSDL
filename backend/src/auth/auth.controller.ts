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

        public googleLogin = async (req: Request, res: Response) => {
            try {
                const { token, role = 'student' } = req.body

                if (!token) {
                    return res.status(400).json({
                        message: "Token is required"
                    })
                }

                // Verify Google token
                const googleUser = await authService.verifyGoogleToken(token)

                // Check if user exists by email
                let user = await userService.getUserByEmail(googleUser.email)

                // If user doesn't exist, create new user
                if (!user) {
                    // Generate username from email
                    const username = googleUser.email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 9)
                    
                    // Create new user with Google data
                    const newUsers = await userService.createNewUser(
                        googleUser.firstName,
                        googleUser.lastName,
                        googleUser.email,
                        username,
                        Math.random().toString(36).substr(2, 15), // Random password
                        role,
                        '', // bankName
                        ''  // bankAccount
                    )

                    user = newUsers[0]

                    // If new teacher, create teacher account
                    if (role.toLowerCase() === 'teacher') {
                        await teacherService.ensureTeacherAccount(user.id)
                    }
                }

                // Generate JWT token
                const jwtToken = await authService.getAccessToken(user)

                return res.status(200).json({
                    message: "Google login/signup successfully!",
                    token: jwtToken,
                    user: {
                        id: user.id,
                        role: user.role,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        bankName: user.bankName || '',
                        bankAccount: user.bankAccount || '',
                    }
                })
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error)
                return res.status(401).json({
                    message: message || "Google authentication failed"
                })
            }
        }

    }

    export default new AuthController()
