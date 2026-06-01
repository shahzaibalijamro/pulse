import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  REDIS_URL: z.string().min(1, "REDIS_URL is required"),
  JWT_SECRET: z.string().min(20, "JWT_SECRET should be at least 20 characters"),
  JWT_EXPIRES_IN: z.string().min(1).default("7d"),
  CLIENT_ORIGIN: z.string().url("CLIENT_ORIGIN must be a valid URL"),
  COOKIE_SECRET: z.string().min(20, "COOKIE_SECRET should be at least 20 characters")
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const messages = parsedEnv.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  throw new Error(`Invalid environment configuration:\n${messages}`);
}

export const env = parsedEnv.data;
export const isProduction = env.NODE_ENV === "production";
