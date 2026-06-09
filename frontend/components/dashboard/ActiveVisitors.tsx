import { RadioTower } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { formatNumber } from "@/lib/utils";

export function ActiveVisitors({ count }: { count: number }) {
  return (
    <Panel className="flex items-center justify-between p-4">
      <div>
        <p className="text-sm font-semibold text-ink">Active visitors</p>
        <p className="font-mono text-xs text-mute">Updated every 30 seconds</p>
      </div>
      <div className="flex items-center gap-2 rounded-sm border border-hairline dark:border-white/[0.06] bg-canvas-soft dark:bg-white/[0.03] px-3 py-1.5 text-sm font-semibold text-ink shadow-sm">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
        <RadioTower className="h-4 w-4 text-mute" />
        <span className="font-mono">{formatNumber(count)}</span>
      </div>
    </Panel>
  );
}


