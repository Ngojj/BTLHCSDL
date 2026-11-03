import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { unauthorized } from "../lib/errors";

export type JwtClaims = {
  sub: number;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  iat?: number;
  exp?: number;
};

const isJwtClaims = (value: unknown): value is JwtClaims => {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.sub === "number" &&
    typeof v.role === "string" &&
    typeof v.firstName === "string" &&
    typeof v.lastName === "string" &&
    typeof v.email === "string"
  );
};

declare global {
  namespace Express {
    interface Request {
      user?: JwtClaims;
    }
  }
}

const extractToken = (req: Request) => {
  const header = req.headers["authorization"];
  if (!header) return undefined;
  return header.startsWith("Bearer ") ? header.slice(7).trim() : header.trim();
};

/** Requires a valid JWT; attaches the claims to `req.user`. */
export const verifyToken = (req: Request, _res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (!token) return next(unauthorized("Authorization header is missing"));

  try {
    const decoded = jwt.verify(token, env.TOKEN_SECRET) as unknown;
    if (!isJwtClaims(decoded)) return next(unauthorized("Invalid token"));
    req.user = { ...decoded, role: decoded.role.toLowerCase() };
    return next();
  } catch {
    return next(unauthorized("Invalid or expired token"));
  }
};
