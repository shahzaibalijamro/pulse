import winston from "winston";
import { env } from "./env.js";

export const logger = winston.createLogger({
  level: env.NODE_ENV === "test" ? "silent" : "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: "pulse-backend" },
  transports: [new winston.transports.Console()]
});
