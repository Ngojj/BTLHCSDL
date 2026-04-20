import { UserDto } from "../dtos/user.dto"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'

type JwtClaims = {
    sub: number
    role: string
    firstName: string
    lastName: string
    email: string
}

class AuthService{
    private googleClient: OAuth2Client

    constructor() {
        const clientId = process.env.GOOGLE_CLIENT_ID || ''
        this.googleClient = new OAuth2Client(clientId)
    }

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

    public verifyGoogleToken = async (token: string) => {
        try {
            const ticket = await this.googleClient.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            })
            
            const payload = ticket.getPayload()
            
            if (!payload) {
                throw new Error("Invalid token payload")
            }

            return {
                id: payload.sub,
                email: payload.email,
                firstName: payload.given_name || '',
                lastName: payload.family_name || '',
                picture: payload.picture,
            }
        } catch (error) {
            throw new Error("Invalid Google token")
        }
    }
}

export default new AuthService()