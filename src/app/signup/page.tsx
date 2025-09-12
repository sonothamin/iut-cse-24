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
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (!firstName.trim()) {
      setError("First name is required");
      setLoading(false);
      return;
    }
    if (!lastName.trim()) {
      setError("Last name is required");
      setLoading(false);
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const supabase = getSupabaseBrowserClient();
      const redirectTo = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"; 
      const { error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${redirectTo}/auth/callback`,
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            roll: roll.trim() || null,
            section: section.trim() || null
          },
        },
      });
      
      if (err) {
        setError(err.message);
      } else {
        setSent(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
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
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
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



