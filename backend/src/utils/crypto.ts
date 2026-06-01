import crypto from "node:crypto";

export function createApiKey() {
  return `pk_${crypto.randomUUID()}`;
}

export function createDailySessionHash(ip: string, userAgent: string, timestamp = new Date()) {
  const day = timestamp.toISOString().slice(0, 10);
  return crypto.createHash("sha256").update(`${ip}|${userAgent}|${day}`).digest("hex");
}
