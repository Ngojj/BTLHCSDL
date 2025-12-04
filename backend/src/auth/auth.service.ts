import { UserDto } from "../dtos/user.dto"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class AuthService{
    public login = async (user: UserDto, password: string) => {
        return await bcrypt.compare(password, user.password)
    }

    public getAccessToken = async (user: UserDto) => {
        return jwt.sign(user, process.env.TOKEN_SECRET || 'user_token_secret', {expiresIn: 60 * 60})
    }
}

export default new AuthService()