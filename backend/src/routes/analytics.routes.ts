import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { SiteModel } from "../models/site.model.js";
import { analyticsQuerySchema, parseAnalyticsDateRange } from "../schemas/common.schema.js";
import {
  getCountryBreakdown,
  getDeviceBreakdown,
  getPageviewsOverTime,
  getReferrers,
  getSummaryStats,
  getTopPages
} from "../services/analytics.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { logger } from "../config/logger.js";

export const analyticsRouter = Router();

analyticsRouter.use(requireAuth);

analyticsRouter.get("/summary", validate(analyticsQuerySchema), analyticsHandler("summary"));
analyticsRouter.get("/pageviews", validate(analyticsQuerySchema), analyticsHandler("pageviews"));
analyticsRouter.get("/pages", validate(analyticsQuerySchema), analyticsHandler("pages"));
analyticsRouter.get("/referrers", validate(analyticsQuerySchema), analyticsHandler("referrers"));
analyticsRouter.get("/devices", validate(analyticsQuerySchema), analyticsHandler("devices"));
analyticsRouter.get("/countries", validate(analyticsQuerySchema), analyticsHandler("countries"));

function analyticsHandler(type: "summary" | "pageviews" | "pages" | "referrers" | "devices" | "countries") {
  return asyncHandler(async (req, res) => {
    const start = Date.now();
    const { siteId, limit } = req.query as unknown as {
      siteId: string;
      start?: string;
      end?: string;
      limit?: number;
    };
    const { startDate, endDate } = parseAnalyticsDateRange(req.query.start as string, req.query.end as string);
    const workspaceId = req.auth!.workspaceId;

    await assertSiteBelongsToWorkspace(siteId, workspaceId);

    const data = await runAnalyticsQuery(type, siteId, workspaceId, startDate, endDate, limit);

    logger.info("Analytics query", {
      siteId,
      queryType: type,
      durationMs: Date.now() - start
    });

    res.json({ data });
  });
}

async function runAnalyticsQuery(
  type: "summary" | "pageviews" | "pages" | "referrers" | "devices" | "countries",
  siteId: string,
  workspaceId: string,
  startDate: Date,
  endDate: Date,
  limit = 10
) {
  switch (type) {
    case "summary":
      return getSummaryStats(siteId, workspaceId, startDate, endDate);
    case "pageviews":
      return getPageviewsOverTime(siteId, workspaceId, startDate, endDate);
    case "pages":
      return getTopPages(siteId, workspaceId, startDate, endDate, limit);
    case "referrers":
      return getReferrers(siteId, workspaceId, startDate, endDate, limit);
    case "devices":
      return getDeviceBreakdown(siteId, workspaceId, startDate, endDate);
    case "countries":
      return getCountryBreakdown(siteId, workspaceId, startDate, endDate, limit);
  }
}

async function assertSiteBelongsToWorkspace(siteId: string, workspaceId: string) {
  const site = await SiteModel.findOne({ _id: siteId, workspaceId }).select("_id").lean();

  if (!site) {
    throw new HttpError(404, "Site not found");
  }
}
