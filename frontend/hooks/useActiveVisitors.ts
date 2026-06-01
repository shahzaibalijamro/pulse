"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function useActiveVisitors(siteId: string | null) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!siteId) return;

    let mounted = true;

    async function load() {
      try {
        const result = await api.active(siteId!);
        if (mounted) setCount(result.count);
      } catch {
        if (mounted) setCount(0);
      }
    }

    void load();
    const interval = window.setInterval(load, 30_000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [siteId]);

  return count;
}
