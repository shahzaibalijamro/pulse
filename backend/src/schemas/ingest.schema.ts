import { z } from "zod";

export const ingestSchema = z.object({
  body: z.object({
    apiKey: z.string().optional(),
    type: z.enum(["pageview", "click", "custom", "scroll", "click_outbound", "session_end"]).default("pageview"),
    url: z.string().url(),
    path: z.string().min(1).default("/"),
    referrer: z.string().url().nullable().optional(),
    userAgent: z.string().optional(),
    screenResolution: z.string().nullable().optional(),
    language: z.string().nullable().optional(),
    utm: z.object({
      source: z.string().nullable().optional(),
      medium: z.string().nullable().optional(),
      campaign: z.string().nullable().optional(),
      term: z.string().nullable().optional(),
      content: z.string().nullable().optional(),
    }).optional(),
    depth: z.number().optional(),
    durationSeconds: z.number().optional(),
    linkUrl: z.string().url().optional(),
    eventName: z.string().trim().min(1).max(120).optional(),
    properties: z.record(z.unknown()).optional(),
    timestamp: z.string().datetime().optional()
  })
});
