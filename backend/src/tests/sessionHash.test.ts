import { describe, expect, it } from "vitest";
import { createDailySessionHash } from "../utils/crypto.js";

describe("daily session hash", () => {
  it("is stable within one day", () => {
    const first = createDailySessionHash("203.0.113.1", "Chrome", new Date("2026-06-01T10:00:00Z"));
    const second = createDailySessionHash("203.0.113.1", "Chrome", new Date("2026-06-01T22:00:00Z"));

    expect(first).toBe(second);
  });

  it("rotates across days to avoid long-term tracking", () => {
    const first = createDailySessionHash("203.0.113.1", "Chrome", new Date("2026-06-01T10:00:00Z"));
    const second = createDailySessionHash("203.0.113.1", "Chrome", new Date("2026-06-02T10:00:00Z"));

    expect(first).not.toBe(second);
  });
});
