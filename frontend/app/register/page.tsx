"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { UserPlus } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await register(email, password, workspaceName || undefined);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard title="Create your workspace" subtitle="Start tracking a site with a privacy-first analytics stack.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm font-medium text-ink-900" htmlFor="workspace">Workspace name</label>
          <input
            id="workspace"
            value={workspaceName}
            onChange={(event) => setWorkspaceName(event.target.value)}
            className="mt-2 h-11 w-full rounded-md border-slate-200 focus:border-pulse-500 focus:ring-pulse-500"
            placeholder="Acme analytics"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink-900" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 h-11 w-full rounded-md border-slate-200 focus:border-pulse-500 focus:ring-pulse-500"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink-900" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 h-11 w-full rounded-md border-slate-200 focus:border-pulse-500 focus:ring-pulse-500"
            required
          />
        </div>
        {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={submitting}>
          <UserPlus className="h-4 w-4" />
          {submitting ? "Creating account" : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-pulse-700 hover:text-pulse-600">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
