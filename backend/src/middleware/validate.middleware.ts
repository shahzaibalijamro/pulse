import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject, ZodError } from "zod";
import { HttpError } from "../utils/httpError.js";

export function validate(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!result.success) {
      return next(formatZodError(result.error));
    }

    req.body = result.data.body ?? req.body;
    req.params = result.data.params ?? req.params;
    req.query = result.data.query ?? req.query;
    return next();
  };
}

function formatZodError(error: ZodError) {
  const details = error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message
  }));

  return new HttpError(400, "Validation failed", details);
}
