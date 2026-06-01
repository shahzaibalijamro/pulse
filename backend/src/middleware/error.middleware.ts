import type { ErrorRequestHandler, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { HttpError } from "../utils/httpError.js";
const { JsonWebTokenError, TokenExpiredError } = jwt;

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const normalized = normalizeError(error);

  if (normalized.statusCode >= 500) {
    logger.error("Unhandled request error", {
      message: error.message,
      stack: error.stack
    });
  }

  res.status(normalized.statusCode).json({
    error: normalized.message,
    details: normalized.details,
    stack: env.NODE_ENV === "development" ? error.stack : undefined
  });
};

function normalizeError(error: unknown) {
  if (error instanceof HttpError) {
    return {
      statusCode: error.statusCode,
      message: error.message,
      details: error.details
    };
  }

  if (error instanceof TokenExpiredError) {
    return { statusCode: 401, message: "Session expired", details: undefined };
  }

  if (error instanceof JsonWebTokenError) {
    return { statusCode: 401, message: "Invalid session", details: undefined };
  }

  return {
    statusCode: 500,
    message: "Internal server error",
    details: undefined
  };
}
