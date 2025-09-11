"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function AdminPage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [tab, setTab] = useState<"users" | "events" | "notices">("users");
  const [userQuery, setUserQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.from("users").select("id, first_name, last_name, roll, section, blood_group, email, role, visible").order("first_name");
      setUsers(u || []);
      const { data: e } = await supabase.from("events").select("id, title, event_date, organizer").order("event_date", { ascending: false });
      setEvents(e || []);
      const { data: n } = await supabase.from("notices").select("id, title, notice_date").order("notice_date", { ascending: false });
      setNotices(n || []);
    })();
  }, [supabase]);

  async function setUserRole(id: string, role: "admin" | "moderator" | "user") {
    await supabase.from("users").update({ role }).eq("id", id);
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  }
  async function setUserVisible(id: string, visible: boolean) {
    await supabase.from("users").update({ visible }).eq("id", id);
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, visible } : u)));
  }

  async function createEvent() {
    const title = prompt("Event title?");
    if (!title) return;
    const when = prompt("Event date (YYYY-MM-DD)?");
    const { data } = await supabase.from("events").insert({ title, event_date: when ? new Date(when).toISOString() : new Date().toISOString() }).select().single();
    if (data) setEvents((prev) => [data, ...prev]);
  }
  async function deleteEvent(id: string) {
    await supabase.from("events").delete().eq("id", id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  async function createNotice() {
    const title = prompt("Notice title?");
    if (!title) return;
    const { data } = await supabase.from("notices").insert({ title }).select().single();
    if (data) setNotices((prev) => [data, ...prev]);
  }
  async function deleteNotice(id: string) {
    await supabase.from("notices").delete().eq("id", id);
    setNotices((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <ProtectedRoute requireRole="admin">
      <div className="container py-5">
        <h1 className="mb-4">Admin Panel</h1>
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button className={`nav-link ${tab === "users" ? "active" : ""}`} onClick={() => setTab("users")}>Users</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${tab === "events" ? "active" : ""}`} onClick={() => setTab("events")}>Events</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${tab === "notices" ? "active" : ""}`} onClick={() => setTab("notices")}>Notices</button>
          </li>
        </ul>

        {tab === "users" && (
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <input className="form-control" style={{ maxWidth: 320 }} placeholder="Search name or email" value={userQuery} onChange={(e) => setUserQuery(e.target.value)} />
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-striped mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Roll</th>
                    <th>Section</th>
                    <th>Blood Group</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Visible</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter((u) => (u.first_name + " " + u.last_name + " " + u.email).toLowerCase().includes(userQuery.toLowerCase())).map((u) => (
                    <tr key={u.id}>
                      <td>{u.first_name} {u.last_name}</td>
                      <td>{u.roll}</td>
                      <td>{u.section}</td>
                      <td>{u.blood_group}</td>
                      <td>{u.email}</td>
                      <td>
                        <select className="form-select form-select-sm" value={u.role} onChange={(e) => setUserRole(u.id, e.target.value as any)}>
                          <option value="user">user</option>
                          <option value="moderator">moderator</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td>
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" checked={!!u.visible} onChange={(e) => setUserVisible(u.id, e.target.checked)} />
                        </div>
                      </td>
                      <td>
                        <a className="btn btn-sm btn-outline-primary" href={`/profile/${u.id}`}>View</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "events" && (
          <div className="card">
            <div className="card-body">
              <button className="btn btn-primary btn-sm mb-3" onClick={createEvent}>New Event</button>
              <ul className="list-group">
                {events.map((e) => (
                  <li key={e.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">{e.title}</div>
                      <div className="small text-muted">{new Date(e.event_date).toLocaleString()}</div>
                    </div>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => deleteEvent(e.id)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {tab === "notices" && (
          <div className="card">
            <div className="card-body">
              <button className="btn btn-primary btn-sm mb-3" onClick={createNotice}>New Notice</button>
              <ul className="list-group">
                {notices.map((n) => (
                  <li key={n.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">{n.title}</div>
                      <div className="small text-muted">{n.notice_date ? new Date(n.notice_date).toLocaleString() : ""}</div>
                    </div>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => deleteNotice(n.id)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}


