import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { activeRouter } from "./routes/active.routes.js";
import { analyticsRouter } from "./routes/analytics.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { healthRouter } from "./routes/health.routes.js";
import { ingestRouter } from "./routes/ingest.routes.js";
import { sitesRouter } from "./routes/sites.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";

export function createApp() {
  const app = express();

  // Render, Vercel, and many hosts forward the real client IP through proxy headers.
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "50kb", type: ["application/json", "text/plain"] }));
  app.use(cookieParser(env.COOKIE_SECRET));

  app.use("/health", healthRouter);
  app.use("/auth", authRouter);
  app.use("/sites", sitesRouter);
  app.use("/ingest", ingestRouter);
  app.use("/analytics", analyticsRouter);
  app.use("/active", activeRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
