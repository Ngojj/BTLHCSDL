    import { Request, Response } from "express"
    import userService from "../user/user.service"
    import authService from "./auth.service"

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

                    return res.status(200).json({
                        message: "Login successfully!",
                        token: token
                    })
            }catch(e){
                return res.status(500).json({
                    message: e
                })
            }
        }

    }

    export default new AuthController()