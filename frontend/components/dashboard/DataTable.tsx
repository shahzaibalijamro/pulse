import { ExternalLink } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import type { CountryBreakdown, Referrer, TopPage } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

function TableRow({ label, value, max, icon }: { label: string; value: number; max: number; icon?: React.ReactNode }) {
  const percent = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="relative flex items-center justify-between px-4 py-2.5 text-sm group">
      <div 
        className="absolute left-2 right-2 top-1 bottom-1 bg-accent/50 dark:bg-white/[0.04] rounded-sm -z-10 data-bar-fill" 
        style={{ width: `calc(${percent}% - 16px)` }} 
      />
      <div className="flex items-center gap-2 text-foreground truncate z-10 pl-2">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <div className="font-mono text-foreground font-medium z-10 pr-2">{formatNumber(value)}</div>
    </div>
  );
}

export function TopPagesTable({ data }: { data: TopPage[] }) {
  const max = Math.max(...data.map(d => d.pageviews), 0);
  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border dark:border-white/[0.06] px-5 py-3">
        <div className="flex gap-4 font-medium text-sm">
          <span className="text-foreground">Pages</span>
          <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Routes</span>
          <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Hostnames</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Visitors</span>
      </div>
      <div className="py-2 bg-card">
        {data.map((item) => (
          <TableRow key={item.path} label={item.path} value={item.pageviews} max={max} />
        ))}
      </div>
    </Panel>
  );
}

export function ReferrersTable({ data }: { data: Referrer[] }) {
  const max = Math.max(...data.map(d => d.visits), 0);
  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border dark:border-white/[0.06] px-5 py-3">
        <div className="flex gap-4 font-medium text-sm">
          <span className="text-foreground">Referrers</span>
          <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">UTM Parameters</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Visitors</span>
      </div>
      <div className="py-2 bg-card">
        {data.map((item) => (
          <TableRow 
            key={item.referrer} 
            label={item.referrer} 
            value={item.visits} 
            max={max} 
            icon={<ExternalLink className="h-3 w-3 text-muted-foreground" />} 
          />
        ))}
      </div>
    </Panel>
  );
}

export function CountriesTable({ data }: { data: CountryBreakdown[] }) {
  const max = Math.max(...data.map(d => d.visits), 0);
  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border dark:border-white/[0.06] px-5 py-3">
        <div className="flex gap-4 font-medium text-sm">
          <span className="text-foreground">Countries</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Visitors</span>
      </div>
      <div className="py-2 bg-card">
        {data.map((item) => (
          <TableRow key={`${item.country}-${item.code}`} label={item.country} value={item.visits} max={max} />
        ))}
      </div>
    </Panel>
  );
}


