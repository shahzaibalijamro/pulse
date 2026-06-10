"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, KeyRound, Loader2, Plus, Trash2, BookOpen } from "lucide-react";
import { AppFrame } from "@/components/layout/AppFrame";
import { SetupGuideModal } from "@/components/ui/SetupGuideModal";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/EmptyState";
import { Panel } from "@/components/ui/Panel";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useSites } from "@/hooks/useSites";

function SettingsSkeleton() {
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
      <Panel className="p-5 space-y-4">
        <Skeleton className="h-5 w-24" />
        <div className="space-y-3 pt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full rounded-sm" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full rounded-sm" />
        </div>
        <Skeleton className="h-10 w-full rounded-sm" />
      </Panel>
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Panel key={i} className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-8 w-full rounded-sm" />
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-9 w-28 rounded-sm" />
              <Skeleton className="h-9 w-9 rounded-sm" />
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { sites, selectedSite, selectSite, loading: sitesLoading, reload } = useSites(Boolean(user));
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [guideSite, setGuideSite] = useState<{ name: string; apiKey: string } | null>(null);

  if (!user && !authLoading) {
    router.replace("/login");
    return null;
  }

  async function handleCreateSite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const result = await api.createSite(name, domain);
      setName("");
      setDomain("");
      await reload();
      selectSite(result.site.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create site");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteSite(id: string) {
    await api.deleteSite(id);
    await reload();
  }

  async function copySnippet(siteId: string, apiKey: string) {
    const snippet = `<script src="${window.location.origin}/tracker.js" data-api-key="${apiKey}" data-endpoint="${process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL + "/i" : "http://localhost:5000/i"}"></script>`;
    await navigator.clipboard.writeText(snippet);
    setCopiedKey(siteId);
    window.setTimeout(() => setCopiedKey(null), 1600);
  }

  return (
    <AppFrame sites={sites} selectedSite={selectedSite} onSelectSite={selectSite}>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-mute">Workspace settings</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-display-sm text-ink">Sites and tracking keys</h1>
          <p className="mt-1 text-sm text-body">Create sites, copy tracker snippets, and manage API keys.</p>
        </div>

        {sitesLoading ? (
          <SettingsSkeleton />
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
            <Panel className="p-5">
              <h2 className="text-base font-semibold text-ink">Add a site</h2>
              <form onSubmit={handleCreateSite} className="mt-5 space-y-4">
                <div>
                  <label className="text-sm font-medium text-ink" htmlFor="name">Site name</label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-2"
                    placeholder="My Portfolio"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink" htmlFor="domain">Domain</label>
                  <Input
                    id="domain"
                    value={domain}
                    onChange={(event) => setDomain(event.target.value)}
                    className="mt-2"
                    placeholder="shahzaib.dev"
                    required
                  />
                </div>
                {error ? <p className="rounded-sm border border-error bg-error-soft/30 px-3 py-2 text-sm text-error">{error}</p> : null}
                <Button type="submit" className="w-full rounded-sm" disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {submitting ? "Creating" : "Create site"}
                </Button>
              </form>
            </Panel>

            {sites.length === 0 ? (
              <EmptyState title="No sites yet">Add your first site to generate a tracking API key.</EmptyState>
            ) : (
              <div className="space-y-4">
                {sites.map((site) => (
                  <Panel key={site.id} className="p-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <KeyRound className="h-4 w-4 text-ink" />
                          <h2 className="truncate text-base font-semibold tracking-display-sm text-ink">{site.name}</h2>
                        </div>
                        <p className="mt-1 text-sm text-body">{site.domain}</p>
                        <code className="mt-4 block overflow-x-auto rounded-sm border border-hairline dark:border-white/[0.06] bg-canvas-soft dark:bg-white/[0.03] px-3 py-2 text-xs font-mono text-body">
                          {site.apiKey}
                        </code>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button variant="outline" className="rounded-sm bg-transparent" onClick={() => setGuideSite({ name: site.name, apiKey: site.apiKey })}>
                          <BookOpen className="h-4 w-4" />
                          View setup guide
                        </Button>
                        <Button variant="secondary" className="rounded-sm" onClick={() => copySnippet(site.id, site.apiKey)}>
                          {copiedKey === site.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          {copiedKey === site.id ? "Copied" : "Copy snippet"}
                        </Button>
                        <Button variant="destructive" className="rounded-sm" onClick={() => handleDeleteSite(site.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Panel>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      <SetupGuideModal
        isOpen={!!guideSite}
        onClose={() => setGuideSite(null)}
        siteName={guideSite?.name ?? ""}
        apiKey={guideSite?.apiKey ?? ""}
      />
    </AppFrame>
  );
}
