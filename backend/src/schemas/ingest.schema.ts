import { z } from "zod";

export const ingestSchema = z.object({
  body: z.object({
    apiKey: z.string().optional(),
    type: z.enum(["pageview", "click", "custom"]).default("pageview"),
    url: z.string().url(),
    path: z.string().min(1).default("/"),
    referrer: z.string().url().nullable().optional(),
    userAgent: z.string().optional(),
    eventName: z.string().trim().min(1).max(120).optional(),
    properties: z.record(z.unknown()).optional(),
    timestamp: z.string().datetime().optional()
  })
});
