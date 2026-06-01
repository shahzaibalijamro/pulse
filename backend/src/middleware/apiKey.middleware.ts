import type { NextFunction, Request, Response } from "express";
import { SiteModel } from "../models/site.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

export const validateApiKey = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const apiKey = req.body?.apiKey || req.headers["x-api-key"];

  if (!apiKey || typeof apiKey !== "string") {
    throw new HttpError(401, "Missing API key");
  }

  const site = await SiteModel.findOne({ apiKey }).lean();

  if (!site) {
    throw new HttpError(401, "Invalid API key");
  }

  // Downstream ingestion code trusts this server-side lookup, not client-sent IDs.
  req.site = site;
  next();
});
