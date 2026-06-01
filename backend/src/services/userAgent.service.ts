import { UAParser } from "ua-parser-js";

export type ParsedUserAgent = {
  browser: string;
  os: string;
  device: "desktop" | "mobile" | "tablet" | "bot" | "unknown";
};

export function parseUserAgent(userAgent: string): ParsedUserAgent {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();
  const deviceType = result.device.type;

  return {
    browser: result.browser.name || "Unknown",
    os: result.os.name || "Unknown",
    device: normalizeDevice(deviceType, userAgent)
  };
}

function normalizeDevice(deviceType: string | undefined, userAgent: string): ParsedUserAgent["device"] {
  const lowerAgent = userAgent.toLowerCase();

  if (lowerAgent.includes("bot") || lowerAgent.includes("crawler") || lowerAgent.includes("spider")) {
    return "bot";
  }

  if (deviceType === "mobile" || deviceType === "tablet") {
    return deviceType;
  }

  if (!deviceType) {
    return "desktop";
  }

  return "unknown";
}
