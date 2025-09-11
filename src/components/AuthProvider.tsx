"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

type UserProfile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: "admin" | "moderator" | "user" | null;
  onboarded: boolean | null;
  avatar_url?: string | null;

  bio?: string | null;
  roll?: string | null;
  section?: string | null;
  blood_group?: string | null;
  batch_year?: number | null;

  phone?: string | null;

  github?: string | null;
  facebook?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  website?: string | null;

  tags?: string[] | null;
};


type AuthContextValue = {
  supabase: ReturnType<typeof getSupabaseBrowserClient>;
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function refreshProfile() {
    if (!user) {
      setProfile(null);
      return;
    }


    const { data, error } = await supabase
      .from("users")
      .select(
        "id, first_name, last_name, email, role, onboarded, avatar_url, bio, roll, section, blood_group, batch_year, phone, github, facebook, linkedin, instagram, twitter, website, tags"
      )
      .eq("id", user.id)
      .maybeSingle();


    if (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
      return;
    }

    setProfile((data as unknown as UserProfile) ?? null);
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((
      _event: string,
      newSession: Session | null
    ) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  // Update last_active on login and periodically
  useEffect(() => {
    (async () => {
      if (!user) return;
      await supabase.from("users").update({ last_active: new Date().toISOString() }).eq("id", user.id);
    })();

    const interval = setInterval(() => {
      if (!user) return;
      supabase.from("users").update({ last_active: new Date().toISOString() }).eq("id", user.id);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, supabase]);

  useEffect(() => {
    refreshProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const value: AuthContextValue = {
    supabase,
    user,
    session,
    profile,
    loading,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


