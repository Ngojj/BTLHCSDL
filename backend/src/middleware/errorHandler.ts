import { ErrorRequestHandler, RequestHandler } from "express";
import { env } from "../config/env";
import { HttpError } from "../lib/errors";
import { logger } from "../lib/logger";

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
};

const MYSQL_DUPLICATE = "ER_DUP_ENTRY";
const MYSQL_FK_FAIL = "ER_NO_REFERENCED_ROW_2";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message, details: err.details });
  }

  // malformed JSON body
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Malformed JSON body" });
  }

  const code = err?.code ?? err?.cause?.code;
  if (code === MYSQL_DUPLICATE) return res.status(409).json({ message: "Resource already exists" });
  if (code === MYSQL_FK_FAIL) return res.status(400).json({ message: "Referenced resource does not exist" });

  (req as any).log?.error({ err }, "unhandled error") ?? logger.error({ err }, "unhandled error");
  return res.status(500).json({
    message: env.isProduction ? "Internal server error" : String(err?.message ?? err),
  });
};
