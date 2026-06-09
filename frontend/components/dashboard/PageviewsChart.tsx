"use client";

import * as React from "react"
import { useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Panel } from "@/components/ui/Panel"
import type { PageviewPoint, SummaryStats } from "@/lib/types"
import { cn, formatNumber, formatShortDate } from "@/lib/utils"

const chartConfig = {
  views: {
    label: "Views",
    color: "#0070f3", // Vercel blue
  }
}

export function PageviewsChart({ data, summary }: { data: PageviewPoint[], summary?: SummaryStats }) {
  const [activeTab, setActiveTab] = useState<"visitors" | "pageviews" | "bounce">("visitors")

  const bounceRate = "38%" // Static placeholder matching screenshot

  return (
    <Panel className="p-0 overflow-hidden">
      <div className="flex flex-col sm:flex-row border-b border-border dark:border-white/[0.06]">
        {/* Visitors Tab */}
        <button
          onClick={() => setActiveTab("visitors")}
          className={cn(
            "flex-1 text-left px-6 py-4 transition-colors relative",
            activeTab === "visitors"
              ? "bg-accent/50 dark:bg-white/[0.03]"
              : "hover:bg-accent/30 dark:hover:bg-white/[0.02]"
          )}
        >
          {activeTab === "visitors" && (
            <span className="absolute top-0 left-0 right-0 h-[2px] bg-foreground dark:bg-white/80" />
          )}
          <div className="text-sm text-muted-foreground font-medium">Visitors</div>
          <div className="text-3xl font-semibold mt-1 tracking-tight text-foreground">{formatNumber(summary?.uniqueVisitors ?? 0)}</div>
        </button>

        {/* Page Views Tab */}
        <button
          onClick={() => setActiveTab("pageviews")}
          className={cn(
            "flex-1 text-left px-6 py-4 border-l border-border dark:border-white/[0.06] transition-colors relative",
            activeTab === "pageviews"
              ? "bg-accent/50 dark:bg-white/[0.03]"
              : "hover:bg-accent/30 dark:hover:bg-white/[0.02]"
          )}
        >
          {activeTab === "pageviews" && (
            <span className="absolute top-0 left-0 right-0 h-[2px] bg-foreground dark:bg-white/80" />
          )}
          <div className="text-sm text-muted-foreground font-medium">Page Views</div>
          <div className="text-3xl font-semibold mt-1 tracking-tight text-foreground">{formatNumber(summary?.totalPageviews ?? 0)}</div>
        </button>

        {/* Bounce Rate Tab */}
        {/* <button 
          onClick={() => setActiveTab("bounce")}
          className={cn(
            "flex-1 text-left px-6 py-4 border-l border-border dark:border-white/[0.06] transition-colors relative",
            activeTab === "bounce"
              ? "bg-accent/50 dark:bg-white/[0.03]"
              : "hover:bg-accent/30 dark:hover:bg-white/[0.02]"
          )}
        >
          {activeTab === "bounce" && (
            <span className="absolute top-0 left-0 right-0 h-[2px] bg-foreground dark:bg-white/80" />
          )}
          <div className="text-sm text-muted-foreground font-medium">Bounce Rate</div>
          <div className="text-3xl font-semibold mt-1 tracking-tight text-foreground">{bounceRate}</div>
        </button> */}
      </div>

      <div className="h-[350px] w-full pt-6 pr-6 pb-2 pl-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0070f3" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#0070f3" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" className="dark:opacity-30" />
            <XAxis
              dataKey="date"
              tickFormatter={formatShortDate}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" }}
              tickMargin={10}
              minTickGap={30}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" }}
              tickMargin={10}
              width={40}
              allowDecimals={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey={activeTab === "pageviews" ? "pageviews" : "visitors"}
              stroke="var(--color-views)"
              strokeWidth={2}
              fill="url(#chartFill)"
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </Panel>
  );
}

