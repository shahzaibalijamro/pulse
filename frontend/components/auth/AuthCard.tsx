import type { ReactNode } from "react";
import { Activity } from "lucide-react";

export function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft md:grid-cols-[0.95fr_1.05fr]">
        <aside className="hidden bg-ink-950 p-8 text-white md:flex md:flex-col md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-pulse-500">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold">Pulse</span>
            </div>
            <div className="mt-12">
              <p className="text-sm uppercase tracking-[0.18em] text-pulse-500">Realtime analytics</p>
              <h1 className="mt-4 max-w-sm text-3xl font-semibold leading-tight">
                Privacy-first website metrics for modern client dashboards.
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-md bg-white/8 p-3">
              <p className="text-2xl font-semibold">0</p>
              <p className="mt-1 text-white/60">cookies</p>
            </div>
            <div className="rounded-md bg-white/8 p-3">
              <p className="text-2xl font-semibold">30s</p>
              <p className="mt-1 text-white/60">active TTL</p>
            </div>
            <div className="rounded-md bg-white/8 p-3">
              <p className="text-2xl font-semibold">Live</p>
              <p className="mt-1 text-white/60">events</p>
            </div>
          </div>
        </aside>
        <section className="p-6 sm:p-10">
          <div className="mb-8 md:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-pulse-600 text-white">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold">Pulse</span>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-ink-950">{title}</h2>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
