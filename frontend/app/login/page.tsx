"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to monitor your website analytics.">
      <form onSubmit={handleSubmit} className="space-y-5">
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
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2"
            required
          />
        </div>
        {error ? <p className="rounded-sm border border-error bg-error-soft/30 px-3 py-2 text-sm text-error">{error}</p> : null}
        <Button type="submit" className="w-full rounded-sm" disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
          {submitting ? "Signing in" : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-mute">
        New to Pulse?{" "}
        <Link href="/register" className="font-medium text-success hover:underline">
          Create an account
        </Link>
      </p>
    </AuthCard>
  );
}
