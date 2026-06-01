"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, KeyRound, Plus, Trash2 } from "lucide-react";
import { AppFrame } from "@/components/layout/AppFrame";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { Panel } from "@/components/ui/Panel";
import { api } from "@/lib/api";
import { useSites } from "@/hooks/useSites";

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { sites, selectedSite, selectSite, loading: sitesLoading, reload } = useSites(Boolean(user));
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (authLoading || sitesLoading) {
    return <LoadingState label="Loading settings" />;
  }

  if (!user) {
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
    const snippet = `<script src="${window.location.origin}/tracker.js" data-api-key="${apiKey}" data-endpoint="${process.env.NEXT_PUBLIC_TRACKER_ENDPOINT ?? "http://localhost:5000/ingest"}"></script>`;
    await navigator.clipboard.writeText(snippet);
    setCopiedKey(siteId);
    window.setTimeout(() => setCopiedKey(null), 1600);
  }

  return (
    <AppFrame sites={sites} selectedSite={selectedSite} onSelectSite={selectSite}>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-medium text-pulse-700">Workspace settings</p>
          <h1 className="mt-1 text-2xl font-semibold text-ink-950">Sites and tracking keys</h1>
          <p className="mt-1 text-sm text-slate-500">Create sites, copy tracker snippets, and manage API keys.</p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
          <Panel className="p-5">
            <h2 className="text-base font-semibold text-ink-950">Add a site</h2>
            <form onSubmit={handleCreateSite} className="mt-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-ink-900" htmlFor="name">Site name</label>
                <input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 h-10 w-full rounded-md border-slate-200 focus:border-pulse-500 focus:ring-pulse-500"
                  placeholder="My Portfolio"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink-900" htmlFor="domain">Domain</label>
                <input
                  id="domain"
                  value={domain}
                  onChange={(event) => setDomain(event.target.value)}
                  className="mt-2 h-10 w-full rounded-md border-slate-200 focus:border-pulse-500 focus:ring-pulse-500"
                  placeholder="shahzaib.dev"
                  required
                />
              </div>
              {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
              <Button type="submit" className="w-full" disabled={submitting}>
                <Plus className="h-4 w-4" />
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
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4 text-pulse-700" />
                        <h2 className="truncate text-base font-semibold text-ink-950">{site.name}</h2>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{site.domain}</p>
                      <code className="mt-4 block overflow-x-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                        {site.apiKey}
                      </code>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button variant="secondary" onClick={() => copySnippet(site.id, site.apiKey)}>
                        {copiedKey === site.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copiedKey === site.id ? "Copied" : "Copy snippet"}
                      </Button>
                      <Button variant="danger" onClick={() => handleDeleteSite(site.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Panel>
              ))}
            </div>
          )}
        </div>
      </main>
    </AppFrame>
  );
}
