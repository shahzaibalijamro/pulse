"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { User, Workspace } from "@/lib/types";

type AuthContextValue = {
  user: User | null;
  workspace: Workspace | null;
  loading: boolean;
  loginWithGoogle: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const result = await api.me();
      setUser(result.user);
      setWorkspace(result.workspace);
    } catch {
      setUser(null);
      setWorkspace(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const loginWithGoogle = useCallback(async (token: string) => {
    const result = await api.loginWithGoogle(token);
    setUser(result.user);
    setWorkspace(result.workspace);
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
    setWorkspace(null);
  }, []);

  const value = useMemo(
    () => ({ user, workspace, loading, loginWithGoogle, logout, refresh }),
    [user, workspace, loading, loginWithGoogle, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return value;
}
