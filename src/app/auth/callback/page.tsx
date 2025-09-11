"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    (async () => {
      const supabase = getSupabaseBrowserClient();
      const code = searchParams.get("code"); // <- PKCE / OAuth code

      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }

      // After session is set, go to home
      setTimeout(() => {
        router.replace("/");
      }, 200);
    })();
  }, [router, searchParams]);

  return (
    <div className="container py-5">
      <div className="alert alert-info">Finishing sign-in...</div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <CallbackContent />
    </Suspense>
  );
}
