"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, BarChart3, LogOut, Menu, Settings, ShieldCheck, X, CreditCard } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/AuthProvider";
import type { Site } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-canvas-soft dark:bg-background flex">
      {/* Desktop sidebar */}
      <aside className="sidebar-atmosphere h-[100dvh] fixed inset-y-0 left-0 hidden w-72 border-r border-hairline dark:border-white/[0.06] bg-canvas dark:bg-[#0a0a0a] lg:block overflow-y-auto">
        <SidebarContent
          workspace={workspace}
          sites={sites}
          selectedSite={selectedSite}
          onSelectSite={onSelectSite}
          pathname={pathname}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden h-[100dvh]">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in-0"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="sidebar-atmosphere absolute inset-y-0 left-0 w-full bg-canvas dark:bg-[#0a0a0a] shadow-level5 animate-in slide-in-from-left duration-300 h-[100dvh]">
            <SidebarContent
              workspace={workspace}
              sites={sites}
              selectedSite={selectedSite}
              onSelectSite={onSelectSite}
              pathname={pathname}
              onLogout={handleLogout}
              onClose={() => setSidebarOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 h-[100dvh] overflow-y-auto">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border dark:border-white/[0.06] bg-background/90 px-4 backdrop-blur-sm lg:hidden">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="h-8 w-8 px-0 rounded-sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-foreground">
              <Activity className="h-4 w-4" />
              Pulse
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" className="rounded-sm h-8 w-8 px-0" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}

function SidebarContent({
  workspace,
  sites,
  selectedSite,
  onSelectSite,
  pathname,
  onLogout,
  onClose
}: {
  workspace: { name: string } | null | undefined;
  sites: Site[];
  selectedSite: Site | null;
  onSelectSite: (siteId: string) => void;
  pathname: string;
  onLogout: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="relative z-10 flex h-full flex-col">
      <div className="border-b lg:block hidden border-hairline dark:border-white/[0.06] p-6">
        <div className="flex items-center gap-3">
          {onClose && (
            <Button
              variant="ghost"
              className="h-8 w-8 px-0 rounded-sm lg:hidden"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-ink text-white dark:text-black dark:shadow-[0_0_12px_rgba(255,255,255,0.06)]">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold tracking-display-sm text-ink">Pulse</p>
              <p className="text-xs text-body dark:text-muted-foreground">{workspace?.name ?? "Analytics workspace"}</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Header */}
      <header className="top-0 z-20 flex h-14 items-center justify-between border-b border-border dark:border-white/[0.06] bg-background/90 dark:bg-transparent px-4 backdrop-blur-sm lg:hidden">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="h-8 w-8 px-0 rounded-sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-foreground">
            <Activity className="h-4 w-4" />
            Pulse
          </Link>
        </div>
      </header>

      <div className="p-4">
        <label className="font-mono text-xs uppercase tracking-wider text-mute">Current site</label>
        <select
          value={selectedSite?.id ?? ""}
          onChange={(event) => onSelectSite(event.target.value)}
          className="mt-2 h-10 w-full rounded-sm border border-hairline dark:border-white/[0.08] bg-canvas dark:bg-white/[0.03] text-ink text-sm px-3 focus:outline-none focus:border-ink dark:focus:border-white/20 focus:ring-1 focus:ring-ink dark:focus:ring-white/20 transition-colors"
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
        <NavLink
          href="/dashboard/settings/billing"
          active={pathname === "/dashboard/settings/billing"}
          icon={<CreditCard className="h-4 w-4" />}
        >
          Billing
        </NavLink>
      </nav>

      <div className="mt-auto border-t border-hairline dark:border-white/[0.06] p-4">
        <div className="mb-4 flex items-center gap-2 rounded-sm border border-hairline dark:border-white/[0.06] bg-canvas-soft-2 dark:bg-white/[0.03] p-3 text-xs text-body dark:text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-ink dark:text-muted-foreground" />
          Workspace queries are isolated by tenant.
        </div>
        <div className="flex gap-2 items-center">
          <ThemeToggle />
          <Button variant="ghost" className="w-full justify-start rounded-sm" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}

function NavLink({ href, active, icon, children }: { href: string; active: boolean; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex h-9 items-center gap-3 px-3 text-sm font-medium text-body hover:bg-canvas-soft-2 dark:hover:bg-white/[0.04] hover:text-ink transition-colors relative rounded-sm",
        active && "bg-canvas-soft-2 dark:bg-white/[0.06] text-ink font-semibold"
      )}
    >
      {active && (
        <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-ink dark:bg-white/80 rounded-r-full" />
      )}
      {icon}
      {children}
    </Link>
  );
}
