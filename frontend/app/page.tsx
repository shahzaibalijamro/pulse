"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

export default function HomePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router, user, authLoading]);

  return null;
}