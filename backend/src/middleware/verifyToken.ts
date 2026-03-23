import { NextFunction, Request, Response } from "express"

import jwt from "jsonwebtoken"

type JwtClaims = {
    sub: number
    role: string
    firstName: string
    lastName: string
    email: string
    iat?: number
    exp?: number
}

const isJwtClaims = (value: unknown): value is JwtClaims => {
    if (!value || typeof value !== "object") return false
    const v = value as Record<string, unknown>
    return (
        typeof v.sub === "number" &&
        typeof v.role === "string" &&
        typeof v.firstName === "string" &&
        typeof v.lastName === "string" &&
        typeof v.email === "string"
    )
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtClaims
        }
    }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) =>{
    const authHeader = req.headers["authorization"]

    if(!authHeader){
        return res.status(401).json({
            message: "Authorization header is missing"
        })
    }

    const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice("Bearer ".length).trim()
        : authHeader.trim()

    if(!token) {
        return res.status(401).json({
            message: 'Token is missing'
        })
    }

    try{
        const secret = process.env.TOKEN_SECRET
        if (!secret) {
            return res.status(500).json({
                message: "Server missing TOKEN_SECRET"
            })
        }

        const decodedUnknown = jwt.verify(token, secret) as unknown
        if (!isJwtClaims(decodedUnknown)) {
            return res.status(401).json({
                message: "Invalid token"
            })
        }

        const decoded = decodedUnknown
        req.user = decoded

        next()
    }catch(e){
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}