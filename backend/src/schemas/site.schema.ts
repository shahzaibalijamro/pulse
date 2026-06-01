import { z } from "zod";
import { objectIdSchema } from "./common.schema.js";

export const createSiteSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    domain: z.string().trim().min(3).max(255)
  })
});

export const siteIdParamSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});
