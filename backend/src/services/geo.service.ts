import { redis } from "../config/redis.js";
import { isPrivateOrLocalIp } from "../utils/ip.js";

export type GeoResult = {
  country: string;
  countryCode: string | null;
};

const unknownGeo: GeoResult = {
  country: "Unknown",
  countryCode: null
};

export async function lookupCountry(ip: string): Promise<GeoResult> {
  if (isPrivateOrLocalIp(ip)) {
    return unknownGeo;
  }

  const cacheKey = `geo:${ip}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached) as GeoResult;
  }

  try {
    const response = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,countryCode`);

    if (!response.ok) {
      return unknownGeo;
    }

    const data = await response.json() as {
      status?: string;
      country?: string;
      countryCode?: string;
    };

    const result = data.status === "success"
      ? {
          country: data.country || "Unknown",
          countryCode: data.countryCode || null
        }
      : unknownGeo;

    await redis.set(cacheKey, JSON.stringify(result), "EX", 60 * 60);
    return result;
  } catch {
    return unknownGeo;
  }
}
