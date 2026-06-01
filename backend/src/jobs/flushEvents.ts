import { redis } from "../config/redis.js";
import { logger } from "../config/logger.js";
import { EventModel } from "../models/event.model.js";
import { scanKeys } from "../services/redisKeys.service.js";

export async function flushBufferedEvents() {
  const keys = await scanKeys("events:*");

  for (const key of keys) {
    const processingKey = `processing:${key}:${Date.now()}`;

    try {
      await redis.rename(key, processingKey);
    } catch {
      continue;
    }

    const rawEvents = await redis.lrange(processingKey, 0, -1);

    if (rawEvents.length === 0) {
      await redis.del(processingKey);
      continue;
    }

    const events = rawEvents.flatMap((event: string) => {
      try {
        return [JSON.parse(event)];
      } catch {
        return [];
      }
    });

    if (events.length > 0) {
      await EventModel.insertMany(events, { ordered: false });
    }

    await redis.del(processingKey);
    logger.info("Flushed buffered events", { key, count: events.length });
  }
}

export function startFlushEventsJob() {
  return import("node-cron").then((cron) => {
    const task = cron.default.schedule("*/5 * * * * *", () => {
      flushBufferedEvents().catch((error) => {
        logger.error("Event flush failed", {
          message: error.message,
          stack: error.stack
        });
      });
    });

    logger.info("Redis event flush job scheduled");
    return task;
  });
}
