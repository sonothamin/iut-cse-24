"use client";

import { useEffect, useMemo, useState } from "react";
import ProfileCard, { DirectoryUser } from "@/components/ProfileCard";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function StudentsPage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [users, setUsers] = useState<DirectoryUser[]>([]);
  const [q, setQ] = useState("");
  const [section, setSection] = useState("");
  const [blood, setBlood] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("users")
        .select(
          "id, first_name, last_name, roll, section, blood_group, batch_year, tags, avatar_url"
        )
        .eq("visible", true)
        .order("first_name", { ascending: true });
      setUsers((data as unknown as DirectoryUser[]) || []);
    })();
  }, [supabase]);

  const filtered = users.filter((u) => {
    const hay = [u.first_name, u.last_name, u.roll, ...(u.tags || [])]
      .join(" ")
      .toLowerCase();
    const okQ = q ? hay.includes(q.toLowerCase()) : true;
    const okSec = section ? (u.section || "").toLowerCase() === section.toLowerCase() : true;
    const okBlood = blood ? (u.blood_group || "").toLowerCase() === blood.toLowerCase() : true;
    return okQ && okSec && okBlood;
  });

  const sections = Array.from(new Set(users.map((u) => (u.section || "").toUpperCase()).filter(Boolean)));
  const bloods = Array.from(new Set(users.map((u) => (u.blood_group || "").toUpperCase()).filter(Boolean)));

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
        <h1 className="mb-0 me-auto">Students</h1>
        <input className="form-control" style={{ width: 260 }} placeholder="Search name, roll, tags" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="form-select" style={{ width: 160 }} value={section} onChange={(e) => setSection(e.target.value)}>
          <option value="">Section</option>
          {sections.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select className="form-select" style={{ width: 160 }} value={blood} onChange={(e) => setBlood(e.target.value)}>
          <option value="">Blood</option>
          {bloods.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>
      <div className="row g-3">
        {filtered.map((u) => (
          <div key={u.id} className="col-12 col-md-6 col-lg-4">
            <ProfileCard user={u} />
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-12">
            <div className="alert alert-secondary">No results.</div>
          </div>
        )}
      </div>
    </div>
  );
}


