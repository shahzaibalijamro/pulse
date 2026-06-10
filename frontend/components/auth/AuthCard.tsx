import type { ReactNode } from "react";
import { Activity } from "lucide-react";

export function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas-soft dark:bg-background px-4 py-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-lg border border-hairline dark:border-white/[0.06] bg-canvas dark:bg-card shadow-level5 md:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden bg-[#171717] p-8 text-white md:flex md:flex-col md:justify-between overflow-hidden">
          {/* Subtle atmospheric mesh gradient */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: `
                radial-gradient(circle at top right, rgba(80, 227, 194, 0.4) 0%, transparent 60%),
                radial-gradient(circle at bottom left, rgba(255, 77, 77, 0.3) 0%, transparent 60%),
                radial-gradient(circle at center, rgba(121, 40, 202, 0.35) 0%, transparent 70%)
              `
            }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-white text-[#171717]">
                <Activity className="h-4 w-4" />
              </div>
              <span className="text-base font-semibold tracking-display-sm">Pulse</span>
            </div>
            <div className="my-6">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-soft">Realtime analytics</p>
              <h1 className="mt-4 max-w-sm text-2xl font-semibold leading-snug tracking-display-md text-white">
                Privacy-first website metrics for modern client dashboards.
              </h1>
            </div>
          </div>
          <div className="relative z-10 grid grid-cols-3 gap-3 text-xs font-mono">
            <div className="rounded-sm border border-white/10 bg-white/5 p-3">
              <p className="text-xl font-semibold">0</p>
              <p className="mt-1 text-white/50">cookies</p>
            </div>
            <div className="rounded-sm border border-white/10 bg-white/5 p-3">
              <p className="text-xl font-semibold">30s</p>
              <p className="mt-1 text-white/50">active TTL</p>
            </div>
            <div className="rounded-sm border border-white/10 bg-white/5 p-3">
              <p className="text-xl font-semibold">Live</p>
              <p className="mt-1 text-white/50">events</p>
            </div>
          </div>
        </aside>
        <section className="p-8 sm:p-12">
          <div className="mb-8 md:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-ink dark:bg-white text-white dark:text-black">
                <Activity className="h-4 w-4" />
              </div>
              <span className="text-base font-semibold tracking-display-sm text-ink">Pulse</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold tracking-display-sm text-ink">{title}</h2>
          <p className="mt-2 text-sm text-body dark:text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </section>
      </div>
    </main>
  );
}


