import { describe, expect, it } from "vitest";
import { extractReferrerDomain, normalizeDomain } from "../utils/domain.js";

describe("domain utilities", () => {
  it("normalizes domains for site creation", () => {
    expect(normalizeDomain("https://www.Shahzaib.dev/blog")).toBe("shahzaib.dev");
    expect(normalizeDomain("pulse.dev")).toBe("pulse.dev");
  });

  it("extracts a referrer domain without storing the full source as the grouping key", () => {
    expect(extractReferrerDomain("https://www.google.com/search?q=pulse")).toBe("google.com");
    expect(extractReferrerDomain(null)).toBeNull();
  });
});
