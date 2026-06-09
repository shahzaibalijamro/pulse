import { Panel } from "@/components/ui/Panel";
import type { DeviceBreakdown } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

function TableRow({ label, value, max }: { label: string; value: number; max: number }) {
  const percent = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="relative flex items-center justify-between px-4 py-2.5 text-sm group">
      <div 
        className="absolute left-2 right-2 top-1 bottom-1 bg-accent/50 dark:bg-white/[0.04] rounded-sm -z-10 data-bar-fill" 
        style={{ width: `calc(${percent}% - 16px)` }} 
      />
      <div className="flex items-center gap-2 text-foreground truncate z-10 pl-2">
        <span className="truncate capitalize">{label}</span>
      </div>
      <div className="font-mono text-foreground font-medium z-10 pr-2">{formatNumber(value)}</div>
    </div>
  );
}

export function DeviceChart({ data }: { data: DeviceBreakdown[] }) {
  const max = Math.max(...data.map(d => d.count), 0);
  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border dark:border-white/[0.06] px-5 py-3">
        <div className="flex gap-4 font-medium text-sm">
          <span className="text-foreground">Devices</span>
          <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Browsers</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Visitors</span>
      </div>
      <div className="py-2 bg-card">
        {data.map((item) => (
          <TableRow key={item.device} label={item.device} value={item.count} max={max} />
        ))}
      </div>
    </Panel>
  );
}


