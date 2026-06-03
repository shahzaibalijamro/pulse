"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchAnalyticsBundle } from "@/lib/api";
import type { AnalyticsBundle } from "@/lib/types";

export function useAnalytics(siteId: string | null, start: string, end: string) {
  const [data, setData] = useState<AnalyticsBundle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    console.log('useAnalytics.load called with siteId:', siteId, 'start:', start, 'end:', end);
    if (!siteId) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bundle = await fetchAnalyticsBundle(siteId, start, end);
      console.log('useAnalytics.load success, bundle:', bundle);
      setData(bundle);
    } catch (err) {
      console.error('useAnalytics.load error:', err);
      setError(err instanceof Error ? err.message : "Could not load analytics");
    } finally {
      setLoading(false);
    }
  }, [siteId, start, end]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, error, reload: load };
}
