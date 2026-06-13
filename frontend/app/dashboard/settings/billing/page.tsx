"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { PricingCard } from "@/components/billing/PricingCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AppFrame } from "@/components/layout/AppFrame";
import { useSites } from "@/hooks/useSites";

export default function BillingPage() {
  const { user, workspace, loading: authLoading } = useAuth();
  const { sites, selectedSite, selectSite } = useSites(Boolean(user));

  const searchParams = useSearchParams();
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("success")) {
      // Optional: Show a success toast or banner
    }
  }, [searchParams]);

  if (authLoading || !workspace) {
    return (
      <AppFrame sites={sites} selectedSite={selectedSite} onSelectSite={selectSite}>
        <div className="p-8 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full max-w-sm" />
        </div>
      </AppFrame>
    );
  }

  const handlePortal = async () => {
    setLoadingPortal(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/billing/portal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",

      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load portal");
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setLoadingPortal(false);
    }
  };

  return (
    <AppFrame sites={sites} selectedSite={selectedSite} onSelectSite={selectSite}>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-mute">Workspace settings</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-display-sm text-ink">Billing & Plan</h1>
          <p className="mt-1 text-sm text-body">
            Manage your subscription and billing details for <span className="font-medium text-ink">{workspace.name}</span>.
          </p>
        </div>

        <div className="mt-8">
          {workspace.plan === "pro" ? (
            <Card className="max-w-xl border border-hairline dark:border-white/[0.06] shadow-sm bg-canvas dark:bg-[#0a0a0a]">
              <CardHeader>
                <CardTitle className="text-xl font-geist tracking-tight text-ink">Active Plan: Pro</CardTitle>
                <CardDescription className="text-muted-foreground">
                  You are currently on the Pro plan. You have access to all premium tracking features and priority support.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handlePortal} disabled={loadingPortal} variant="default" className="font-medium">
                  {loadingPortal ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {loadingPortal ? "Redirecting..." : "Manage Subscription"}
                </Button>
                {error && <p className="mt-4 text-sm text-error">{error}</p>}
              </CardContent>
            </Card>
          ) : (
            <PricingCard workspaceId={workspace.id} />
          )}
        </div>
      </main>
    </AppFrame>
  );
}
