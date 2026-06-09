import { MonitorSmartphone, Radio } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import type { LiveEvent } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

export function LiveFeed({ events, connected }: { events: LiveEvent[]; connected: boolean }) {
  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-hairline dark:border-white/[0.06] bg-canvas-soft dark:bg-white/[0.02] px-5 py-3">
        <div>
          <h2 className="font-mono text-xs uppercase tracking-wider text-mute">Live feed</h2>
        </div>
        <span className="flex items-center gap-2 font-mono text-xs text-mute">
          <span className={connected ? "h-1.5 w-1.5 rounded-full bg-success animate-pulse" : "h-1.5 w-1.5 rounded-full bg-mute"} />
          {connected ? "Connected" : "Waiting"}
        </span>
      </div>
      <div className="max-h-[360px] divide-y divide-hairline dark:divide-white/[0.04] bg-canvas dark:bg-card overflow-auto">
        {events.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <Radio className="mx-auto h-5 w-5 text-muted-foreground/40 mb-3 animate-pulse" />
            <p className="font-mono text-xs text-mute">New events will appear here.</p>
          </div>
        ) : (
          events.map((event, index) => (
            <div key={`${event.timestamp}-${index}`} className="grid grid-cols-[auto_1fr_auto] gap-3 px-5 py-3 text-sm">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-sm border border-hairline dark:border-white/[0.06] bg-canvas-soft dark:bg-white/[0.03] text-body">
                <MonitorSmartphone className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{event.path}</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-mute">
                  {event.type} · {event.country} · {event.device}
                </p>
              </div>
              <span className="whitespace-nowrap font-mono text-xs text-mute">{timeAgo(event.timestamp)}</span>
            </div>
          ))
        )}
      </div>
    </Panel>
  );
}


