"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { AuthCard } from "@/components/auth/AuthCard";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleSuccess(response: CredentialResponse) {
    setError(null);

    if (!response.credential) {
      setError("No credential received from Google");
      return;
    }

    try {
      await loginWithGoogle(response.credential);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in with Google");
    }
  }

  function handleGoogleError() {
    setError("Google sign-in was cancelled or failed. Please try again.");
  }

  return (
    <AuthCard title="Welcome to Pulse." subtitle="Sign in with your Google account to get started.">
      <div className="flex flex-col items-center gap-5">
        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            shape="rectangular"
            width="320"
            text="signin_with"
            logo_alignment="left"
          />
        </div>
        {error ? (
          <p className="w-full rounded-sm border border-error bg-error-soft/30 px-3 py-2 text-sm text-error">
            {error}
          </p>
        ) : null}
        <p className="text-xs text-mute text-center">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </AuthCard>
  );
}
