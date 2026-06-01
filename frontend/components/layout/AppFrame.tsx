"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, BarChart3, LogOut, Settings, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/providers/AuthProvider";
import type { Site } from "@/lib/types";
import { cn } from "@/lib/utils";

type AppFrameProps = {
  sites: Site[];
  selectedSite: Site | null;
  onSelectSite: (siteId: string) => void;
  children: React.ReactNode;
};

export function AppFrame({ sites, selectedSite, onSelectSite, children }: AppFrameProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { workspace, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-200 p-6">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-pulse-600 text-white">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-ink-950">Pulse</p>
                <p className="text-xs text-slate-500">{workspace?.name ?? "Analytics workspace"}</p>
              </div>
            </Link>
          </div>

          <div className="p-4">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Current site</label>
            <select
              value={selectedSite?.id ?? ""}
              onChange={(event) => onSelectSite(event.target.value)}
              className="mt-2 h-10 w-full rounded-md border-slate-200 text-sm focus:border-pulse-500 focus:ring-pulse-500"
            >
              {sites.length === 0 ? <option value="">No sites yet</option> : null}
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>

          <nav className="space-y-1 px-4">
            <NavLink href="/dashboard" active={pathname === "/dashboard"} icon={<BarChart3 className="h-4 w-4" />}>
              Dashboard
            </NavLink>
            <NavLink
              href="/dashboard/settings"
              active={pathname === "/dashboard/settings"}
              icon={<Settings className="h-4 w-4" />}
            >
              Settings
            </NavLink>
          </nav>

          <div className="mt-auto border-t border-slate-200 p-4">
            <div className="mb-4 flex items-center gap-2 rounded-md bg-slate-50 p-3 text-xs text-slate-600">
              <ShieldCheck className="h-4 w-4 text-pulse-600" />
              Workspace queries are isolated by tenant.
            </div>
            <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:hidden">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Activity className="h-5 w-5 text-pulse-600" />
            Pulse
          </Link>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </header>
        {children}
      </div>
    </div>
  );
}

function NavLink({ href, active, icon, children }: { href: string; active: boolean; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-ink-900",
        active && "bg-pulse-50 text-pulse-700"
      )}
    >
      {icon}
      {children}
    </Link>
  );
}
