"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { FontAwesomeIcon } from "@fontawesome/react-fontawesome";
import { faPlus, faTrash, faEye, faEyeSlash, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { Database } from "@/types/supabase";
import EventModal from "@/components/EventModal";

// --- Types ---
type User = Database['public']['Tables']['users']['Row'];
type Event = Database['public']['Tables']['events']['Row'];
type EventInsert = Database['public']['Tables']['events']['Insert'];
type EventUpdate = Database['public']['Tables']['events']['Update'];
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
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [user, setUser] = useState<any>(null);

  // --- Load data ---
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);

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
  async function createEvent(eventData: EventInsert) {
    try {
      const { data, error } = await supabase
        .from("events")
        .insert({
          ...eventData,
          organizer_id: user?.id,
          status: "published"
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      if (data) setEvents((prev) => [data, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
    }
  }

  async function updateEvent(eventData: EventUpdate, eventId: string) {
    try {
      const { error } = await supabase
        .from("events")
        .update({ ...eventData, updated_at: new Date().toISOString() })
        .eq("id", eventId);
      if (error) throw new Error(error.message);
      setEvents((prev) => prev.map(e => e.id === eventId ? { ...e, ...eventData } as Event : e));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update event");
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

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setShowEventModal(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowEventModal(true);
  };

  const handleSaveEvent = async (eventData: EventInsert | EventUpdate) => {
    if (editingEvent) {
      await updateEvent(eventData as EventUpdate, editingEvent.id);
    } else {
      await createEvent(eventData as EventInsert);
    }
    setShowEventModal(false);
    setEditingEvent(null);
  };

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
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Events Management</h5>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleCreateEvent}
                >
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Create Event
                </button>
              </div>
              
              {events.length === 0 ? (
                <div className="text-center py-4">
                  <FontAwesomeIcon icon={faCalendar} className="text-muted mb-3" size="3x" />
                  <h6 className="text-muted">No events created yet</h6>
                  <p className="text-muted">Create your first event to get started.</p>
                </div>
              ) : (
                <div className="row g-3">
                  {events.map((event) => (
                    <div key={event.id} className="col-12 col-md-6">
                      <div className="card">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="card-title mb-0">{event.title}</h6>
                            <span className={`badge ${
                              event.status === "published" ? "bg-success" :
                              event.status === "draft" ? "bg-warning" :
                              event.status === "cancelled" ? "bg-danger" : "bg-secondary"
                            }`}>
                              {event.status}
                            </span>
                          </div>
                          
                          <p className="card-text text-muted small mb-2">
                            {event.description || "No description"}
                          </p>
                          
                          <div className="small text-muted mb-3">
                            <div><strong>Date:</strong> {new Date(event.event_date).toLocaleString()}</div>
                            {event.place && <div><strong>Place:</strong> {event.place}</div>}
                            {event.organizer && <div><strong>Organizer:</strong> {event.organizer}</div>}
                          </div>
                          
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleEditEvent(event)}
                            >
                              <FontAwesomeIcon icon={faEye} className="me-1" />
                              Edit
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this event?")) {
                                  deleteEvent(event.id);
                                }
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} className="me-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

        {/* Event Modal */}
        {showEventModal && (
          <EventModal
            event={editingEvent}
            onSave={handleSaveEvent}
            onClose={() => {
              setShowEventModal(false);
              setEditingEvent(null);
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
