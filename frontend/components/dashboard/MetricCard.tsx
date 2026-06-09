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
          <p className="font-mono text-xs uppercase tracking-wider text-mute">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-display-sm text-ink">
            {typeof value === "number" ? formatNumber(value) : value}
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-hairline dark:border-white/[0.06] bg-canvas-soft dark:bg-white/[0.03] text-body">{icon}</div>
      </div>
      {detail ? <p className="mt-4 font-mono text-xs text-mute">{detail}</p> : null}
    </Panel>
  );
}


