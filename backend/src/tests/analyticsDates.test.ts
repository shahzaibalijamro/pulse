import { describe, expect, it } from "vitest";
import { parseAnalyticsDateRange } from "../schemas/common.schema.js";

describe("analytics date range parsing", () => {
  it("uses a provided start and end date", () => {
    const range = parseAnalyticsDateRange("2026-05-01", "2026-06-01");

    expect(range.startDate.toISOString().startsWith("2026-05-01")).toBe(true);
    expect(range.endDate.toISOString().startsWith("2026-06-01")).toBe(true);
  });

  it("rejects inverted date ranges", () => {
    expect(() => parseAnalyticsDateRange("2026-06-02", "2026-06-01")).toThrow(
      "Start date must be before end date"
    );
  });
});
