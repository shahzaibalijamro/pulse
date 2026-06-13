import { env } from "./config/env.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { activeRouter } from "./routes/active.routes.js";
import { analyticsRouter } from "./routes/analytics.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { healthRouter } from "./routes/health.routes.js";
import { ingestRouter } from "./routes/ingest.routes.js";
import { sitesRouter } from "./routes/sites.routes.js";
import { billingRouter, webhookRouter } from "./routes/billing.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";

export function createApp() {
  const app = express();

  // Trust proxy headers from Render/Vercel
  app.set("trust proxy", 1);

  app.use(helmet());

  // No global CORS – apply per route below

  // Stripe webhook must use raw body
  app.use("/billing/webhook", express.raw({ type: "application/json" }), webhookRouter);

  app.use(express.json({ limit: "50kb", type: ["application/json", "text/plain"] }));
  app.use(cookieParser(env.COOKIE_SECRET));

  // Routes that are only called by YOUR dashboard (authenticated)
  const dashboardCors = cors({ origin: env.CLIENT_ORIGIN, credentials: true });
  app.use("/auth", dashboardCors, authRouter);
  app.use("/sites", dashboardCors, sitesRouter);
  app.use("/analytics", dashboardCors, analyticsRouter);
  app.use("/active", dashboardCors, activeRouter);
  app.use("/billing", dashboardCors, billingRouter);

  // Ingestion – called by ANY website that includes the tracker
  app.use("/i", helmet({ crossOriginResourcePolicy: false }), cors({ origin: "*", credentials: false }), ingestRouter);

  // Health check (no CORS needed)
  app.use("/health", healthRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}