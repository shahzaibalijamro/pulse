"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Globe2, MousePointerClick, Users } from "lucide-react";
import { ActiveVisitors } from "@/components/dashboard/ActiveVisitors";
import { CountriesTable, ReferrersTable, TopPagesTable } from "@/components/dashboard/DataTable";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { DeviceChart } from "@/components/dashboard/DeviceChart";
import { LiveFeed } from "@/components/dashboard/LiveFeed";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PageviewsChart } from "@/components/dashboard/PageviewsChart";
import { AppFrame } from "@/components/layout/AppFrame";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { useActiveVisitors } from "@/hooks/useActiveVisitors";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useSites } from "@/hooks/useSites";
import { useSocket } from "@/hooks/useSocket";
import type { DatePreset } from "@/lib/types";
import { getLastNDays } from "@/lib/utils";

const presetDays: Record<DatePreset, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [preset, setPreset] = useState<DatePreset>("30d");
  const { sites, selectedSite, selectSite, loading: sitesLoading } = useSites(Boolean(user));
  const range = useMemo(() => getLastNDays(presetDays[preset]), [preset]);
  const analytics = useAnalytics(selectedSite?.id ?? null, range.start, range.end);
  const activeVisitors = useActiveVisitors(selectedSite?.id ?? null);
  const refreshAnalytics = useCallback(() => {
    void analytics.reload();
  }, [analytics.reload]);
  const socket = useSocket(selectedSite?.apiKey ?? null, refreshAnalytics);

  const isLoading = authLoading || sitesLoading;

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
    }
  }, [user, router, isLoading]);

  if (isLoading) {
    return <LoadingState label="Preparing Pulse" />;
  }

  if (!user) {
    return null;
  }

  return (
    <AppFrame sites={sites} selectedSite={selectedSite} onSelectSite={selectSite}>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-medium text-pulse-700">Analytics dashboard</p>
            <h1 className="mt-1 text-2xl font-semibold text-ink-950">
              {selectedSite ? selectedSite.name : "No site selected"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {selectedSite ? selectedSite.domain : "Create a site to start receiving events."}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <DateRangePicker value={preset} onChange={setPreset} />
            <Button variant="secondary" onClick={() => router.push("/dashboard/settings")}>
              <MousePointerClick className="h-4 w-4" />
              Manage sites
            </Button>
          </div>
        </div>

        {!selectedSite ? (
          <div className="mt-8">
            <EmptyState title="Create your first site">
              Pulse needs a site and API key before analytics can appear. Open settings to add a domain.
            </EmptyState>
          </div>
        ) : analytics.loading && !analytics.data ? (
          <LoadingState label="Loading analytics" />
        ) : analytics.error ? (
          <div className="mt-8">
            <EmptyState title="Could not load analytics">{analytics.error}</EmptyState>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="Pageviews"
                value={analytics.data?.summary.totalPageviews ?? 0}
                icon={<BarChart3 className="h-5 w-5" />}
                detail={`${preset.toUpperCase()} selected window`}
              />
              <MetricCard
                label="Unique visitors"
                value={analytics.data?.summary.uniqueVisitors ?? 0}
                icon={<Users className="h-5 w-5" />}
                detail="Estimated by daily session hash"
              />
              <MetricCard
                label="Top country"
                value={analytics.data?.countries[0]?.country ?? "None"}
                icon={<Globe2 className="h-5 w-5" />}
                detail="Based on pageview events"
              />
              <ActiveVisitors count={activeVisitors} />
            </div>

            <PageviewsChart data={analytics.data?.pageviews ?? []} />

            <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
              <div className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <TopPagesTable data={analytics.data?.pages ?? []} />
                  <ReferrersTable data={analytics.data?.referrers ?? []} />
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  <DeviceChart data={analytics.data?.devices ?? []} />
                  <CountriesTable data={analytics.data?.countries ?? []} />
                </div>
              </div>
              <LiveFeed events={socket.events} connected={socket.connected} />
            </div>
          </div>
        )}
      </main>
    </AppFrame>
  );
}
