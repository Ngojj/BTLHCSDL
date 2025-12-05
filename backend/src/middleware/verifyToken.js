"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({
            message: "Authorization header is missing"
        });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            message: 'Token is missing'
        });
    }
    try {
        jwt.verify(token, process.env.TOKEN_SECRET);
        next();
    }
    catch (e) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};
exports.verifyToken = verifyToken;
