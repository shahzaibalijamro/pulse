"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Panel } from "@/components/ui/Panel";
import type { PageviewPoint } from "@/lib/types";
import { formatShortDate } from "@/lib/utils";

export function PageviewsChart({ data }: { data: PageviewPoint[] }) {
  return (
    <Panel className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-ink-950">Traffic over time</h2>
          <p className="text-sm text-slate-500">Pageviews and estimated visitors.</p>
        </div>
        <div className="hidden items-center gap-4 text-xs text-slate-500 sm:flex">
          <LegendDot color="#0f9f8f" label="Pageviews" />
          <LegendDot color="#64748b" label="Visitors" />
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="pageviewsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0f9f8f" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#0f9f8f" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid className="chart-grid" vertical={false} />
            <XAxis dataKey="date" tickFormatter={formatShortDate} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              labelFormatter={(value) => formatShortDate(String(value))}
              contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
            />
            <Area type="monotone" dataKey="pageviews" stroke="#0f9f8f" fill="url(#pageviewsGradient)" strokeWidth={2} />
            <Area type="monotone" dataKey="visitors" stroke="#64748b" fill="transparent" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
