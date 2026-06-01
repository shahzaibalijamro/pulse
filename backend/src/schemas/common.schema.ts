import mongoose from "mongoose";
import { z } from "zod";
import { HttpError } from "../utils/httpError.js";

export const objectIdSchema = z
  .string()
  .refine((value) => mongoose.Types.ObjectId.isValid(value), "Invalid MongoDB ObjectId");

const dateInputSchema = z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/));

export const analyticsQuerySchema = z.object({
  query: z.object({
    siteId: objectIdSchema,
    start: dateInputSchema.optional(),
    end: dateInputSchema.optional(),
    limit: z.coerce.number().int().positive().max(100).optional()
  })
});

export function parseAnalyticsDateRange(start?: string, end?: string) {
  const endDate = end ? new Date(end) : new Date();
  const startDate = start ? new Date(start) : new Date(endDate);

  if (!start) {
    startDate.setDate(endDate.getDate() - 30);
  }

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new HttpError(400, "Invalid date range");
  }

  if (startDate > endDate) {
    throw new HttpError(400, "Start date must be before end date");
  }

  return { startDate, endDate };
}
