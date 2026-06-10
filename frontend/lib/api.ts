import type {
  AnalyticsBundle,
  AuthResponse,
  CountryBreakdown,
  DeviceBreakdown,
  PageviewPoint,
  Referrer,
  Site,
  SummaryStats,
  TopPage
} from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request<T>(path: string, options: RequestOptions = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(response.status, data.error || "Request failed", data.details);
  }

  return data as T;
}

export const api = {
  loginWithGoogle(token: string) {
    return request<AuthResponse>("/auth/google", {
      method: "POST",
      body: { token }
    });
  },
  logout() {
    return request<void>("/auth/logout", { method: "POST" });
  },
  me() {
    return request<AuthResponse>("/auth/me");
  },
  listSites() {
    return request<{ sites: Site[] }>("/sites");
  },
  createSite(name: string, domain: string) {
    return request<{ site: Site }>("/sites", {
      method: "POST",
      body: { name, domain }
    });
  },
  deleteSite(id: string) {
    return request<void>(`/sites/${id}`, { method: "DELETE" });
  },
  active(siteId: string) {
    return request<{ count: number }>(`/active?siteId=${encodeURIComponent(siteId)}`);
  },
  analytics<T>(path: string, siteId: string, start: string, end: string, limit?: number) {
    const params = new URLSearchParams({ siteId, start, end });
    if (limit) params.set("limit", String(limit));
    return request<{ data: T }>(`/analytics/${path}?${params.toString()}`).then((res) => res.data);
  }
};

export async function fetchAnalyticsBundle(siteId: string, start: string, end: string): Promise<AnalyticsBundle> {
  const [summary, pageviews, pages, referrers, devices, countries] = await Promise.all([
    api.analytics<SummaryStats>("summary", siteId, start, end),
    api.analytics<PageviewPoint[]>("pageviews", siteId, start, end),
    api.analytics<TopPage[]>("pages", siteId, start, end, 10),
    api.analytics<Referrer[]>("referrers", siteId, start, end, 10),
    api.analytics<DeviceBreakdown[]>("devices", siteId, start, end),
    api.analytics<CountryBreakdown[]>("countries", siteId, start, end, 10)
  ]);

  return { summary, pageviews, pages, referrers, devices, countries };
}

export function getApiUrl() {
  return API_URL;
}
