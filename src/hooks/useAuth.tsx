"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getSupabase, isSupabaseEnabled } from "@/lib/supabase";

export interface AppUser {
  id: string;
  email: string;
  name: string;
}

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  demoMode: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_KEY = "football-iq-demo-user";

function nameFromEmail(email: string) {
  const handle = email.split("@")[0] ?? "Coach";
  return handle.charAt(0).toUpperCase() + handle.slice(1);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Bootstrap session
  useEffect(() => {
    let active = true;
    const supabase = getSupabase();

    if (supabase) {
      supabase.auth.getSession().then(({ data }) => {
        if (!active) return;
        const s = data.session;
        if (s?.user) {
          setUser({
            id: s.user.id,
            email: s.user.email ?? "",
            name:
              (s.user.user_metadata?.name as string) ??
              nameFromEmail(s.user.email ?? ""),
          });
        }
        setLoading(false);
      });
      const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email ?? "",
            name:
              (session.user.user_metadata?.name as string) ??
              nameFromEmail(session.user.email ?? ""),
          });
        } else {
          setUser(null);
        }
      });
      return () => {
        active = false;
        sub.subscription.unsubscribe();
      };
    }

    // Demo mode: restore from localStorage
    try {
      const raw = localStorage.getItem(DEMO_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoading(false);
    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);
      return;
    }
    if (!email || password.length < 4)
      throw new Error("Enter a valid email and a password (4+ chars).");
    const demo: AppUser = {
      id: "demo-" + btoa(email).slice(0, 10),
      email,
      name: nameFromEmail(email),
    };
    localStorage.setItem(DEMO_KEY, JSON.stringify(demo));
    setUser(demo);
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      const supabase = getSupabase();
      if (supabase) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        });
        if (error) throw new Error(error.message);
        return;
      }
      if (!name) throw new Error("Tell us your name.");
      if (!email || password.length < 4)
        throw new Error("Enter a valid email and a password (4+ chars).");
      const demo: AppUser = {
        id: "demo-" + btoa(email).slice(0, 10),
        email,
        name,
      };
      localStorage.setItem(DEMO_KEY, JSON.stringify(demo));
      setUser(demo);
    },
    []
  );

  const signOut = useCallback(async () => {
    const supabase = getSupabase();
    if (supabase) await supabase.auth.signOut();
    localStorage.removeItem(DEMO_KEY);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      demoMode: !isSupabaseEnabled,
      signIn,
      signUp,
      signOut,
    }),
    [user, loading, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
