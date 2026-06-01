import { Router } from "express";
import { redis } from "../config/redis.js";
import { logger } from "../config/logger.js";
import { validateApiKey } from "../middleware/apiKey.middleware.js";
import { ingestLimiter } from "../middleware/rateLimit.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { ingestSchema } from "../schemas/ingest.schema.js";
import { lookupCountry } from "../services/geo.service.js";
import { refreshActiveSession } from "../services/session.service.js";
import { parseUserAgent } from "../services/userAgent.service.js";
import { emitNewEvent } from "../sockets/socket.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createDailySessionHash } from "../utils/crypto.js";
import { extractReferrerDomain } from "../utils/domain.js";
import { getClientIp } from "../utils/ip.js";

export const ingestRouter = Router();

ingestRouter.post(
  "/",
  ingestLimiter,
  validateApiKey,
  validate(ingestSchema),
  asyncHandler(async (req, res) => {
    const start = Date.now();
    const site = req.site!;
    const siteId = site._id.toString();
    const workspaceId = site.workspaceId.toString();
    const userAgent = req.body.userAgent || req.headers["user-agent"] || "Unknown";
    const clientIp = getClientIp(req);
    const timestamp = req.body.timestamp ? new Date(req.body.timestamp) : new Date();

    const parsedAgent = parseUserAgent(String(userAgent));
    const geo = await lookupCountry(clientIp);
    const sessionHash = createDailySessionHash(clientIp, String(userAgent), timestamp);

    const eventDocument = {
      siteId,
      workspaceId,
      type: req.body.type,
      url: req.body.url,
      path: req.body.path,
      referrer: req.body.referrer || null,
      referrerDomain: extractReferrerDomain(req.body.referrer),
      browser: parsedAgent.browser,
      os: parsedAgent.os,
      device: parsedAgent.device,
      country: geo.country,
      countryCode: geo.countryCode,
      sessionHash,
      eventName: req.body.eventName || null,
      properties: req.body.properties || {},
      timestamp
    };

    await redis.lpush(`events:${siteId}`, JSON.stringify(eventDocument));
    await refreshActiveSession(siteId, sessionHash);

    emitNewEvent(siteId, {
      type: eventDocument.type,
      path: eventDocument.path,
      country: eventDocument.country,
      countryCode: eventDocument.countryCode,
      device: eventDocument.device,
      timestamp: eventDocument.timestamp
    });

    logger.info("Event ingested", {
      siteId,
      eventType: eventDocument.type,
      country: eventDocument.country,
      device: eventDocument.device,
      latencyMs: Date.now() - start
    });

    res.status(202).json({ ok: true });
  })
);
