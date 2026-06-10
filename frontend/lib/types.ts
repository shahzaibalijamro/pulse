export type User = {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  workspaceId: string;
  createdAt?: string;
};

export type Workspace = {
  id: string;
  name: string;
  plan: "free" | "pro";
  createdAt?: string;
};

export type Site = {
  id: string;
  workspaceId: string;
  name: string;
  domain: string;
  apiKey: string;
  createdAt?: string;
};

export type AuthResponse = {
  user: User;
  workspace: Workspace;
};

export type SummaryStats = {
  totalPageviews: number;
  uniqueVisitors: number;
};

export type PageviewPoint = {
  date: string;
  pageviews: number;
  visitors: number;
};

export type TopPage = {
  path: string;
  pageviews: number;
};

export type Referrer = {
  referrer: string;
  visits: number;
};

export type DeviceBreakdown = {
  device: string;
  count: number;
};

export type CountryBreakdown = {
  country: string;
  code: string | null;
  visits: number;
};

export type AnalyticsBundle = {
  summary: SummaryStats;
  pageviews: PageviewPoint[];
  pages: TopPage[];
  referrers: Referrer[];
  devices: DeviceBreakdown[];
  countries: CountryBreakdown[];
};

export type DatePreset = "7d" | "30d" | "90d";

export type LiveEvent = {
  type: "pageview" | "click" | "custom";
  path: string;
  country: string;
  countryCode: string | null;
  device: string;
  timestamp: string;
};
