import { MonitorSmartphone } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import type { LiveEvent } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

export function LiveFeed({ events, connected }: { events: LiveEvent[]; connected: boolean }) {
  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-ink-950">Live feed</h2>
          <p className="text-sm text-slate-500">Newest tracked events.</p>
        </div>
        <span className="flex items-center gap-2 text-xs text-slate-500">
          <span className={connected ? "h-2 w-2 rounded-full bg-pulse-500" : "h-2 w-2 rounded-full bg-slate-300"} />
          {connected ? "Connected" : "Waiting"}
        </span>
      </div>
      <div className="max-h-[360px] divide-y divide-slate-100 overflow-auto">
        {events.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-slate-500">New events will appear here.</div>
        ) : (
          events.map((event, index) => (
            <div key={`${event.timestamp}-${index}`} className="grid grid-cols-[auto_1fr_auto] gap-3 px-5 py-3 text-sm">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                <MonitorSmartphone className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-ink-900">{event.path}</p>
                <p className="mt-0.5 text-xs capitalize text-slate-500">
                  {event.type} · {event.country} · {event.device}
                </p>
              </div>
              <span className="whitespace-nowrap text-xs text-slate-400">{timeAgo(event.timestamp)}</span>
            </div>
          ))
        )}
      </div>
    </Panel>
  );
}
