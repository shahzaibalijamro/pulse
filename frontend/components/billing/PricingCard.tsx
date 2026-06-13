"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";

export function PricingCard({ workspaceId }: { workspaceId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/billing/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Checkout failed");
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  const features = [
    "Unlimited pageviews and events",
    "Advanced UTM Campaign tracking",
    "Bounce rate & Session duration metrics",
    "Scroll depth & Outbound link tracking",
    "Priority support"
  ];

  return (
    <Card className="w-full max-w-sm border border-hairline dark:border-white/[0.06] shadow-sm overflow-hidden bg-canvas dark:bg-[#0a0a0a]">
      <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />
      <CardHeader>
        <CardTitle className="text-xl font-geist tracking-tight text-ink">Pro Plan</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Deeply understand your audience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-baseline gap-1 text-ink">
          <span className="text-4xl font-geist font-bold tracking-tighter">$9</span>
          <span className="text-muted-foreground font-medium text-sm">/mo per workspace</span>
        </div>
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-ink/80">
              <CheckCircle2 className="h-4 w-4 text-cyan-500 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        {error && <p className="mt-4 text-sm text-error">{error}</p>}
      </CardContent>
      <CardFooter className="flex-col items-center">
        <Button
          className="w-full font-medium"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {loading ? "Preparing checkout..." : "Upgrade to Pro"}
        </Button>
        <p className="mt-4 text-xs text-muted-foreground text-center px-2 leading-relaxed">
          Test mode active. Use card <span className="font-mono bg-canvas-soft-2 dark:bg-white/[0.04] px-1 py-0.5 rounded text-ink/80 dark:text-white/80 border border-hairline dark:border-white/[0.08]">4242 4242 4242 4242</span> with any future date and CVC to test the upgrade flow.
        </p>
      </CardFooter>
    </Card>
  );
}
