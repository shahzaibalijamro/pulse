import type { ReactNode } from "react";
import { Panel } from "@/components/ui/Panel";
import { formatNumber } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  icon,
  detail
}: {
  label: string;
  value: number | string;
  icon: ReactNode;
  detail?: string;
}) {
  return (
    <Panel className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-ink-950">
            {typeof value === "number" ? formatNumber(value) : value}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-ink-700">{icon}</div>
      </div>
      {detail ? <p className="mt-4 text-xs text-slate-500">{detail}</p> : null}
    </Panel>
  );
}
