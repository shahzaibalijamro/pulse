import { Redis } from "ioredis";
import { env } from "./env.js";
import { logger } from "./logger.js";

// lazyConnect keeps imports test-friendly. The real server connects in index.ts.
export const redis = new Redis(env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 3
});

redis.on("error", (error: Error) => {
  logger.error("Redis error", { message: error.message });
});

export async function connectRedis() {
  if (redis.status === "wait") {
    await redis.connect();
  }

  logger.info("Redis connected");
}

export async function disconnectRedis() {
  await redis.quit();
}
