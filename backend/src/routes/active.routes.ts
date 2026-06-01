import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { SiteModel } from "../models/site.model.js";
import { analyticsQuerySchema } from "../schemas/common.schema.js";
import { getActiveSessionCount } from "../services/session.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

export const activeRouter = Router();

activeRouter.get(
  "/",
  requireAuth,
  validate(analyticsQuerySchema),
  asyncHandler(async (req, res) => {
    const siteId = req.query.siteId as string;
    const site = await SiteModel.findOne({
      _id: siteId,
      workspaceId: req.auth!.workspaceId
    }).select("_id").lean();

    if (!site) {
      throw new HttpError(404, "Site not found");
    }

    const count = await getActiveSessionCount(siteId);
    res.json({ count });
  })
);
