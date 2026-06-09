"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
          <label className="text-sm font-medium text-ink" htmlFor="workspace">Workspace name</label>
          <Input
            id="workspace"
            value={workspaceName}
            onChange={(event) => setWorkspaceName(event.target.value)}
            className="mt-2"
            placeholder="Acme analytics"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink" htmlFor="email">Email</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink" htmlFor="password">Password</label>
          <Input
            id="password"
            type="password"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2"
            required
          />
        </div>
        {error ? <p className="rounded-sm border border-error bg-error-soft/30 px-3 py-2 text-sm text-error">{error}</p> : null}
        <Button type="submit" className="w-full rounded-sm" disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          {submitting ? "Creating account" : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-mute">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-success hover:underline">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
