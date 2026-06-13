"use client";

import { Lock, Timer, MousePointerClick, ActivitySquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/Panel";
import Link from "next/link";
import type { Campaign, EngagementStats, BehaviorStats, LockedResponse } from "@/lib/types";

function isLocked(data: any): data is LockedResponse {
  return data && data.locked === true;
}

interface PremiumInsightsProps {
  campaigns?: Campaign[] | LockedResponse;
  engagement?: EngagementStats | LockedResponse;
  behavior?: BehaviorStats | LockedResponse;
}

export function PremiumInsights({ campaigns, engagement, behavior }: PremiumInsightsProps) {
  const locked = isLocked(campaigns) || isLocked(engagement) || isLocked(behavior);

  return (
    <div className="relative mt-8 space-y-6">
      <div className="flex items-center gap-2">
        <ActivitySquare className="h-5 w-5 text-cyan-500" />
        <h2 className="text-xl font-semibold tracking-tight text-ink">Premium Insights</h2>
      </div>

      <div className={`grid gap-6 lg:grid-cols-2 ${locked ? "opacity-40 blur-sm pointer-events-none select-none transition-all duration-300" : ""}`}>
        {/* Engagement Card */}
        <Panel className="p-6 space-y-4 shadow-sm border-hairline dark:border-white/[0.06] bg-canvas dark:bg-[#0a0a0a]">
          <h3 className="text-sm font-semibold tracking-wide text-ink">Engagement</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-xs font-mono text-muted-foreground mb-1">BOUNCE RATE</p>
              <p className="text-3xl font-geist font-bold text-ink">
                {locked ? "42.5" : engagement ? (engagement as EngagementStats).bounceRate : "--"}%
              </p>
            </div>
            <div>
              <p className="text-xs font-mono text-muted-foreground mb-1">AVG SESSION</p>
              <p className="text-3xl font-geist font-bold text-ink">
                {locked ? "1m 12s" : engagement ? formatDuration((engagement as EngagementStats).avgSessionDurationSeconds) : "--"}
              </p>
            </div>
          </div>
        </Panel>

        {/* Behavior / Clicks Card */}
        <Panel className="p-6 space-y-4 shadow-sm border-hairline dark:border-white/[0.06] bg-canvas dark:bg-[#0a0a0a]">
          <h3 className="text-sm font-semibold tracking-wide text-ink">Top Outbound Clicks</h3>
          <div className="space-y-3 mt-4">
            {locked ? (
              <>
                <BehaviorRow label="https://twitter.com/shahzaib" count={124} max={200} />
                <BehaviorRow label="https://github.com/shahzaibalijamro" count={89} max={200} />
                <BehaviorRow label="https://linkedin.com/in/shahzaib" count={45} max={200} />
              </>
            ) : behavior && !isLocked(behavior) && behavior.outboundClicks.length > 0 ? (
              behavior.outboundClicks.slice(0, 5).map((c, i, arr) => (
                <BehaviorRow key={i} label={c.url} count={c.count} max={arr[0].count} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No outbound clicks yet.</p>
            )}
          </div>
        </Panel>

        {/* Campaigns Table */}
        <Panel className="p-6 lg:col-span-2 shadow-sm border-hairline dark:border-white/[0.06] bg-canvas dark:bg-[#0a0a0a]">
          <h3 className="text-sm font-semibold tracking-wide text-ink mb-4">UTM Campaigns</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground font-mono uppercase bg-canvas-soft dark:bg-white/[0.02]">
                <tr>
                  <th className="px-4 py-3 rounded-l-sm font-medium">Source</th>
                  <th className="px-4 py-3 font-medium">Medium</th>
                  <th className="px-4 py-3 font-medium">Campaign</th>
                  <th className="px-4 py-3 rounded-r-sm font-medium text-right">Visits</th>
                </tr>
              </thead>
              <tbody>
                {locked ? (
                  <>
                    <CampaignRow source="google" medium="cpc" campaign="spring_sale" visits={1402} />
                    <CampaignRow source="twitter" medium="social" campaign="launch_tweet" visits={845} />
                    <CampaignRow source="newsletter" medium="email" campaign="weekly_digest" visits={432} />
                  </>
                ) : campaigns && !isLocked(campaigns) && campaigns.length > 0 ? (
                  campaigns.map((c, i) => (
                    <CampaignRow key={i} source={c.source} medium={c.medium} campaign={c.campaign} visits={c.visits} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                      No UTM campaigns tracked yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      {locked && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center animate-in fade-in duration-500">
          <div className="bg-background/80 dark:bg-black/60 backdrop-blur-md border border-hairline dark:border-white/[0.08] shadow-level5 p-8 rounded-lg max-w-sm text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10 mb-4">
              <Lock className="h-6 w-6 text-cyan-500" />
            </div>
            <h3 className="text-xl font-geist font-bold text-ink mb-2">Pro Insights Locked</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Upgrade to Pro to see UTM campaigns, bounce rates, session durations, scroll depth, and outbound clicks.
            </p>
            <Link href="/dashboard/settings/billing">
              <Button className="w-full font-medium shadow-md">
                Unlock Pro Plan
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}m ${s}s`;
}

function BehaviorRow({ label, count, max }: { label: string; count: number; max: number }) {
  const pct = Math.max(2, Math.round((count / max) * 100));
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="truncate pr-4 flex-1 text-ink/90 font-mono text-xs">{label}</div>
      <div className="flex items-center gap-3 w-32 justify-end">
        <span className="font-medium text-ink">{count}</span>
        <div className="h-2 w-16 bg-canvas-soft-2 dark:bg-white/[0.06] rounded-sm overflow-hidden">
          <div className="h-full bg-cyan-500" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

function CampaignRow({ source, medium, campaign, visits }: { source: string; medium: string; campaign: string; visits: number }) {
  return (
    <tr className="border-b border-hairline dark:border-white/[0.04] last:border-0 hover:bg-canvas-soft-2 dark:hover:bg-white/[0.02] transition-colors">
      <td className="px-4 py-3 text-ink/90 font-medium capitalize">{source || "direct"}</td>
      <td className="px-4 py-3 text-muted-foreground">{medium || "none"}</td>
      <td className="px-4 py-3 text-muted-foreground">{campaign || "none"}</td>
      <td className="px-4 py-3 text-ink font-mono text-right">{visits.toLocaleString()}</td>
    </tr>
  );
}
