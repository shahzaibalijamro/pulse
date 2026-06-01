import rateLimit from "express-rate-limit";

export const authLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please try again later." }
});

export const ingestLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => {
    const apiKey = req.body?.apiKey || req.headers["x-api-key"];
    return typeof apiKey === "string" ? apiKey : req.ip ?? "unknown";
  },
  message: { error: "Too many events. Please slow down." }
});
