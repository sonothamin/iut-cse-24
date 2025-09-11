"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [roll, setRoll] = useState("");
  const [section, setSection] = useState("");
  const [batchYear, setBatchYear] = useState<number | "">("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    const supabase = getSupabaseBrowserClient();
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          first_name: firstName,
          last_name: lastName,
          roll,
          section,
          batch_year: batchYear || null,
        },
      },
    });
    if (err) setError(err.message);
    else setSent(true);
  }

  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <h1 className="mb-3">Sign up</h1>
      {sent ? (
        <div className="alert alert-success">Check your email for a confirmation link.</div>
      ) : (
        <form onSubmit={onSubmit} className="card p-3">
          <div className="row g-2">
            <div className="col-sm-6">
              <label className="form-label">First name</label>
              <input className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="col-sm-6">
              <label className="form-label">Last name</label>
              <input className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>
          <div className="row g-2 mt-2">
            <div className="col-sm-6">
              <label className="form-label">Roll</label>
              <input className="form-control" value={roll} onChange={(e) => setRoll(e.target.value)} />
            </div>
            <div className="col-sm-6">
              <label className="form-label">Section</label>
              <input className="form-control" value={section} onChange={(e) => setSection(e.target.value)} />
            </div>
          </div>
          <hr className="my-3" />
          <label className="form-label">Email</label>
          <input
            className="form-control mb-3"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="form-label">Password</label>
          <input
            className="form-control mb-3"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label className="form-label">Confirm Password</label>
          <input
            className="form-control mb-3"
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          {error && <div className="alert alert-danger">{error}</div>}
          <button className="btn btn-primary" type="submit">
            Create Account
          </button>
          <div className="mt-3">
            <span className="text-muted">Already have an account? </span>
            <Link href="/login">Login</Link>
          </div>
        </form>
      )}
    </div>
  );
}


