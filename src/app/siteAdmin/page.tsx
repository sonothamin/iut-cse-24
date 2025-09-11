"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Database } from "@/types/supabase";

// --- Types ---
type User = Database['public']['Tables']['users']['Row'];
type Event = Database['public']['Tables']['events']['Row'];
type Notice = Database['public']['Tables']['notices']['Row'];

// --- Component ---
export default function AdminPage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [tab, setTab] = useState<"users" | "events" | "notices">("users");
  const [userQuery, setUserQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Load data ---
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [usersResult, eventsResult, noticesResult] = await Promise.all([
          supabase.from("users").select("*").order("first_name"),
          supabase.from("events").select("*").order("event_date", { ascending: false }),
          supabase.from("notices").select("*").order("notice_date", { ascending: false })
        ]);

        if (usersResult.error) throw new Error(`Failed to load users: ${usersResult.error.message}`);
        if (eventsResult.error) throw new Error(`Failed to load events: ${eventsResult.error.message}`);
        if (noticesResult.error) throw new Error(`Failed to load notices: ${noticesResult.error.message}`);

        setUsers(usersResult.data || []);
        setEvents(eventsResult.data || []);
        setNotices(noticesResult.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    })();
  }, [supabase]);

  // --- User actions ---
  async function setUserRole(id: string, role: User["role"]) {
    try {
      const { error } = await supabase.from("users").update({ role }).eq("id", id);
      if (error) throw new Error(error.message);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user role");
    }
  }

  async function setUserVisible(id: string, visible: boolean) {
    try {
      const { error } = await supabase.from("users").update({ visible }).eq("id", id);
      if (error) throw new Error(error.message);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, visible } : u)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user visibility");
    }
  }

  // --- Event actions ---
  async function createEvent(title: string, date: string) {
    try {
      const { data, error } = await supabase
        .from("events")
        .insert({ title, event_date: new Date(date).toISOString() })
        .select()
        .single();
      if (error) throw new Error(error.message);
      if (data) setEvents((prev) => [data, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
    }
  }

  async function deleteEvent(id: string) {
    try {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw new Error(error.message);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete event");
    }
  }

  // --- Notice actions ---
  async function createNotice(title: string) {
    try {
      const { data, error } = await supabase.from("notices").insert({ title }).select().single();
      if (error) throw new Error(error.message);
      if (data) setNotices((prev) => [data, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create notice");
    }
  }

  async function deleteNotice(id: string) {
    try {
      const { error } = await supabase.from("notices").delete().eq("id", id);
      if (error) throw new Error(error.message);
      setNotices((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete notice");
    }
  }

  // --- UI ---
  return (
    <ProtectedRoute requireRole="admin">
      <div className="container py-5">
        <h1 className="mb-4">Admin Panel</h1>
        
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError(null)}
              aria-label="Close"
            />
          </div>
        )}

        {loading && (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <ul className="nav nav-tabs mb-3">
          {["users", "events", "notices"].map((t) => (
            <li className="nav-item" key={t}>
              <button
                className={`nav-link ${tab === t ? "active" : ""}`}
                onClick={() => setTab(t as "users" | "events" | "notices")}
              >
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            </li>
          ))}
        </ul>

        {/* Users */}
        {tab === "users" && (
          <div className="card">
            <div className="card-body mb-3">
              <input
                className="form-control"
                placeholder="Search name or email"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
              />
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
                  {users
                    .filter((u) =>
                      `${u.first_name} ${u.last_name} ${u.email}`
                        .toLowerCase()
                        .includes(userQuery.toLowerCase())
                    )
                    .map((u) => (
                      <tr key={u.id}>
                        <td>{u.first_name} {u.last_name}</td>
                        <td>{u.roll}</td>
                        <td>{u.section}</td>
                        <td>{u.blood_group}</td>
                        <td>{u.email}</td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={u.role}
                            onChange={(e) => setUserRole(u.id, e.target.value as User["role"])}
                          >
                            <option value="user">user</option>
                            <option value="moderator">moderator</option>
                            <option value="admin">admin</option>
                          </select>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setUserVisible(u.id, !u.visible)}
                          >
                            <FontAwesomeIcon icon={u.visible ? faEye : faEyeSlash} />
                          </button>
                        </td>
                        <td>
                          <a className="btn btn-sm btn-outline-primary" href={`/profile/${u.id}`}>
                            <FontAwesomeIcon icon={faEye} /> View
                          </a>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Events */}
        {tab === "events" && (
          <div className="card">
            <div className="card-body">
              <button
                className="btn btn-primary btn-sm mb-3"
                onClick={() => {
                  const title = prompt("Event title?");
                  if (!title?.trim()) return;
                  
                  const dateInput = prompt("Event date (YYYY-MM-DD)?");
                  if (!dateInput?.trim()) return;
                  
                  const date = new Date(dateInput);
                  if (isNaN(date.getTime())) {
                    setError("Invalid date format. Please use YYYY-MM-DD");
                    return;
                  }
                  
                  createEvent(title.trim(), dateInput);
                }}
              >
                <FontAwesomeIcon icon={faPlus} /> New Event
              </button>
              <ul className="list-group">
                {events.map((e) => (
                  <li key={e.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">{e.title}</div>
                      <div className="small text-muted">{new Date(e.event_date).toLocaleString()}</div>
                    </div>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => deleteEvent(e.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Notices */}
        {tab === "notices" && (
          <div className="card">
            <div className="card-body">
              <button
                className="btn btn-primary btn-sm mb-3"
                onClick={() => {
                  const title = prompt("Notice title?");
                  if (!title?.trim()) return;
                  createNotice(title.trim());
                }}
              >
                <FontAwesomeIcon icon={faPlus} /> New Notice
              </button>
              <ul className="list-group">
                {notices.map((n) => (
                  <li key={n.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">{n.title}</div>
                      <div className="small text-muted">{n.notice_date ? new Date(n.notice_date).toLocaleString() : ""}</div>
                    </div>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => deleteNotice(n.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
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
