"use client";

import { useState, FormEvent } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function ResetRequestPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = getSupabaseBrowserClient();
    const redirectTo = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"; 
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${redirectTo}/reset/confirm`,
    });
    if (err) setError(err.message);
    else setSent(true);
  }

  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <h1 className="mb-3">Reset password</h1>
      {sent ? (
        <div className="alert alert-success">Check your email for a reset link.</div>
      ) : (
        <form onSubmit={onSubmit} className="card p-3">
          <label className="form-label">Email</label>
          <input
            className="form-control mb-3"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <div className="alert alert-danger">{error}</div>}
          <button className="btn btn-primary" type="submit">Send reset link</button>
        </form>
      )}
    </div>
  );
}



