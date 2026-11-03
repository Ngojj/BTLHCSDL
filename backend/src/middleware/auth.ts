import { NextFunction, Request, RequestHandler, Response } from "express";
import { forbidden, unauthorized } from "../lib/errors";
import { verifyToken } from "./verifyToken";

export const authenticate = verifyToken;

type Role = "student" | "teacher";

/** Allows only the listed roles. Must run after `authenticate`. */
export const requireRole =
  (...roles: Role[]): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(unauthorized());
    if (!roles.includes(req.user.role as Role)) {
      return next(forbidden(`This action requires role: ${roles.join(" or ")}`));
    }
    next();
  };

/** authenticate + role in one step */
export const asRole = (...roles: Role[]): RequestHandler[] => [authenticate, requireRole(...roles)];

export const asStudent = asRole("student");
export const asTeacher = asRole("teacher");
export const asUser: RequestHandler[] = [authenticate];

/**
 * Students may only act on their own id; teachers pass through (their own scoping is handled
 * by the ownership checks). `source` says where the id lives in the request.
 */
export const selfOrTeacher =
  (field: string, source: "params" | "body" | "query" = "params"): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) return next(unauthorized());
    if (req.user.role === "teacher") return next();
    const value = Number((req as any)[source]?.[field]);
    if (!Number.isInteger(value) || value !== req.user.sub) {
      return next(forbidden("You can only access your own data"));
    }
    next();
  };

/** Only the user identified by `field` (used for teacher-only self endpoints). */
export const onlySelf =
  (field: string, source: "params" | "body" | "query" = "params"): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) return next(unauthorized());
    const value = Number((req as any)[source]?.[field]);
    if (!Number.isInteger(value) || value !== req.user.sub) {
      return next(forbidden("You can only modify your own data"));
    }
    next();
  };

/** Overwrites body fields with identity from the token so clients cannot forge them. */
export const bindIdentity =
  (...fields: ("id" | "userId" | "teacherId" | "studentId")[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) return next(unauthorized());
    req.body = req.body ?? {};
    for (const field of fields) req.body[field] = req.user.sub;
    next();
  };
