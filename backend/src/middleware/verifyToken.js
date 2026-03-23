"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isJwtClaims = (value) => {
    if (!value || typeof value !== "object")
        return false;
    const v = value;
    return (typeof v.sub === "number" &&
        typeof v.role === "string" &&
        typeof v.firstName === "string" &&
        typeof v.lastName === "string" &&
        typeof v.email === "string");
};
const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({
            message: "Authorization header is missing"
        });
    }
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice("Bearer ".length).trim()
        : authHeader.trim();
    if (!token) {
        return res.status(401).json({
            message: 'Token is missing'
        });
    }
    try {
        const secret = process.env.TOKEN_SECRET;
        if (!secret) {
            return res.status(500).json({
                message: "Server missing TOKEN_SECRET"
            });
        }
        const decodedUnknown = jsonwebtoken_1.default.verify(token, secret);
        if (!isJwtClaims(decodedUnknown)) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }
        const decoded = decodedUnknown;
        req.user = decoded;
        next();
    }
    catch (e) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};
exports.verifyToken = verifyToken;
