"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const supabase = getSupabaseBrowserClient();
      // Handles magic-link and OAuth PKCE code exchange
      await supabase.auth.exchangeCodeForSession();
      // After session is set, go to home
      setTimeout(() => {
        router.replace("/");
      }, 200);
    })();
  }, [router]);

  return (
    <div className="container py-5">
      <div className="alert alert-info">Finishing sign-in...</div>
    </div>
  );
}


