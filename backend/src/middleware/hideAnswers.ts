import { RequestHandler } from "express";

const strip = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(strip);
  if (value && typeof value === "object" && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key]) => key !== "answer")
        .map(([key, v]) => [key, strip(v)])
    );
  }
  return value;
};

/** Students must never receive the correct answer of a question they have not been graded on. */
export const hideAnswersFromStudents: RequestHandler = (req, res, next) => {
  if (req.user?.role === "student") {
    const json = res.json.bind(res);
    res.json = (body: unknown) => json(strip(body));
  }
  next();
};
