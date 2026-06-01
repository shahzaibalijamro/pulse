import { redis } from "../config/redis.js";
import { scanKeys } from "./redisKeys.service.js";

const activeTtlSeconds = 30;

export async function refreshActiveSession(siteId: string, sessionHash: string) {
  await redis.set(activeSessionKey(siteId, sessionHash), "1", "EX", activeTtlSeconds);
}

export async function getActiveSessionCount(siteId: string) {
  const keys = await scanKeys(`active:${siteId}:*`);
  return keys.length;
}

function activeSessionKey(siteId: string, sessionHash: string) {
  return `active:${siteId}:${sessionHash}`;
}
