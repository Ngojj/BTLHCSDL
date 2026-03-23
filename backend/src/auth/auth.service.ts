import { UserDto } from "../dtos/user.dto"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

type JwtClaims = {
    sub: number
    role: string
    firstName: string
    lastName: string
    email: string
}

class AuthService{
    public login = async (user: UserDto, password: string) => {
        return await bcrypt.compare(password, user.password)
    }

    public getAccessToken = async (user: UserDto) => {
        const secret = process.env.TOKEN_SECRET
        if (!secret) {
            throw new Error("Missing TOKEN_SECRET")
        }

        const claims: JwtClaims = {
            sub: user.id,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        }

        return jwt.sign(claims, secret, { expiresIn: 60 * 60 })
    }
}

export default new AuthService()