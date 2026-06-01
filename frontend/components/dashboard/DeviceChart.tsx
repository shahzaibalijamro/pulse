"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Panel } from "@/components/ui/Panel";
import type { DeviceBreakdown } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

const colors = ["#0f9f8f", "#334155", "#d97706", "#64748b", "#a855f7"];

export function DeviceChart({ data }: { data: DeviceBreakdown[] }) {
  return (
    <Panel className="p-5">
      <h2 className="text-base font-semibold text-ink-950">Devices</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-[180px_1fr]">
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie innerRadius={48} outerRadius={78} data={data} dataKey="count" nameKey="device" paddingAngle={3}>
                {data.map((entry, index) => (
                  <Cell key={entry.device} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatNumber(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3 self-center">
          {data.map((item, index) => (
            <div key={item.device} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 capitalize text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                {item.device}
              </span>
              <span className="font-medium text-ink-900">{formatNumber(item.count)}</span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
