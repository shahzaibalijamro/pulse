"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Site } from "@/lib/types";

const selectedSiteKey = "pulse:selected-site";

export function useSites(enabled: boolean) {
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadSites = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    const result = await api.listSites();
    setSites(result.sites);

    const savedSiteId = window.localStorage.getItem(selectedSiteKey);
    const nextSelected = result.sites.find((site) => site.id === savedSiteId)?.id ?? result.sites[0]?.id ?? null;
    setSelectedSiteId(nextSelected);
    setLoading(false);
  }, [enabled]);

  useEffect(() => {
    void loadSites();
  }, [loadSites]);

  const selectSite = useCallback((siteId: string) => {
    window.localStorage.setItem(selectedSiteKey, siteId);
    setSelectedSiteId(siteId);
  }, []);

  return {
    sites,
    selectedSite: sites.find((site) => site.id === selectedSiteId) ?? null,
    selectedSiteId,
    selectSite,
    loading,
    reload: loadSites
  };
}
