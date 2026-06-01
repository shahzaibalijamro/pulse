import { RadioTower } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { formatNumber } from "@/lib/utils";

export function ActiveVisitors({ count }: { count: number }) {
  return (
    <Panel className="flex items-center justify-between p-4">
      <div>
        <p className="text-sm font-medium text-ink-900">Active visitors</p>
        <p className="text-xs text-slate-500">Updated every 30 seconds</p>
      </div>
      <div className="flex items-center gap-2 rounded-md bg-pulse-50 px-3 py-2 text-sm font-semibold text-pulse-700">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pulse-500 opacity-50" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-pulse-600" />
        </span>
        <RadioTower className="h-4 w-4" />
        {formatNumber(count)}
      </div>
    </Panel>
  );
}
