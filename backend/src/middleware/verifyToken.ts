import { NextFunction, Request, Response } from "express"

const jwt = require('jsonwebtoken')

export const verifyToken = (req: Request, res: Response, next: NextFunction) =>{
    const authHeader = req.headers['authorization']

    if(!authHeader){
        return res.status(401).json({
            message: "Authorization header is missing"
        })
    }

    const token = authHeader.split(' ')[1];
    if(!token) {
        return res.status(401).json({
            message: 'Token is missing'
        })
    }

    try{
        jwt.verify(token, process.env.TOKEN_SECRET as string)

        next()
    }catch(e){
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}