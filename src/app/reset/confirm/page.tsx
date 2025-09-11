"use client";

import { useEffect, useState, FormEvent, Suspense } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";

function ResetConfirmForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    (async () => {
      const supabase = getSupabaseBrowserClient();
      const code = searchParams.get("code") || searchParams.get("access_token");

      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }

      setReady(true);
    })();
  }, [searchParams]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    const supabase = getSupabaseBrowserClient();
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) setError(err.message);
    else router.replace("/login");
  }

  if (!ready) return <div className="container py-5">Loading...</div>;

  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <h1 className="mb-3">Set new password</h1>
      <form onSubmit={onSubmit} className="card p-3">
        <label className="form-label">New Password</label>
        <input
          className="form-control mb-3"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
        <label className="form-label">Confirm Password</label>
        <input
          className="form-control mb-3"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="••••••••"
          required
        />
        {error && <div className="alert alert-danger">{error}</div>}
        <button className="btn btn-primary" type="submit">Update password</button>
      </form>
    </div>
  );
}

export default function ResetConfirmPage() {
  return (
    <Suspense fallback={<div className="container py-5">Loading...</div>}>
      <ResetConfirmForm />
    </Suspense>
  );
}
