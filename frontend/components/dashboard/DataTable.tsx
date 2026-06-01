import { ExternalLink } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import type { CountryBreakdown, Referrer, TopPage } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

export function TopPagesTable({ data }: { data: TopPage[] }) {
  return (
    <Panel className="overflow-hidden">
      <TableHeader title="Top pages" />
      <div className="divide-y divide-slate-100">
        {data.map((item) => (
          <div key={item.path} className="grid grid-cols-[1fr_auto] gap-4 px-5 py-3 text-sm">
            <span className="truncate font-medium text-ink-900">{item.path}</span>
            <span className="text-slate-500">{formatNumber(item.pageviews)}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function ReferrersTable({ data }: { data: Referrer[] }) {
  return (
    <Panel className="overflow-hidden">
      <TableHeader title="Referrers" />
      <div className="divide-y divide-slate-100">
        {data.map((item) => (
          <div key={item.referrer} className="grid grid-cols-[1fr_auto] gap-4 px-5 py-3 text-sm">
            <span className="flex min-w-0 items-center gap-2 text-ink-900">
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="truncate">{item.referrer}</span>
            </span>
            <span className="text-slate-500">{formatNumber(item.visits)}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function CountriesTable({ data }: { data: CountryBreakdown[] }) {
  return (
    <Panel className="overflow-hidden">
      <TableHeader title="Countries" />
      <div className="divide-y divide-slate-100">
        {data.map((item) => (
          <div key={`${item.country}-${item.code}`} className="grid grid-cols-[1fr_auto] gap-4 px-5 py-3 text-sm">
            <span className="truncate text-ink-900">{item.country}</span>
            <span className="text-slate-500">{formatNumber(item.visits)}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function TableHeader({ title }: { title: string }) {
  return (
    <div className="border-b border-slate-100 px-5 py-4">
      <h2 className="text-base font-semibold text-ink-950">{title}</h2>
    </div>
  );
}
