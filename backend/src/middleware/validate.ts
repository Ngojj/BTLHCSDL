import { RequestHandler } from "express";
import { ZodType } from "zod";
import { badRequest } from "../lib/errors";

type Schemas = { body?: ZodType; params?: ZodType; query?: ZodType };

/** Validates and replaces body/params/query with the parsed (typed, coerced) values. */
export const validate =
  (schemas: Schemas): RequestHandler =>
  (req, _res, next) => {
    for (const key of ["params", "query", "body"] as const) {
      const schema = schemas[key];
      if (!schema) continue;
      const result = schema.safeParse(req[key]);
      if (!result.success) {
        return next(
          badRequest(
            "Validation failed",
            result.error.issues.map((i) => ({ path: `${key}.${i.path.join(".")}`, message: i.message }))
          )
        );
      }
      if (key === "body") req.body = result.data;
      else Object.defineProperty(req, key, { value: result.data, configurable: true, enumerable: true });
    }
    next();
  };
