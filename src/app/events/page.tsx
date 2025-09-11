"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { Database } from "@/types/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faMapMarkerAlt, faUser, faClock, faUsers, faFileAlt, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import ProtectedRoute from "@/components/ProtectedRoute";

type Event = Database['public']['Tables']['events']['Row'];

type FilterType = "all" | "upcoming" | "past";

export default function EventsPage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<FilterType>("upcoming");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Load user and events
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);

        // Load events
        const { data: eventsData, error: eventsError } = await supabase
          .from("events")
          .select("*")
          .order("event_date", { ascending: true });

        if (eventsError) throw new Error(`Failed to load events: ${eventsError.message}`);
        setEvents(eventsData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    })();
  }, [supabase]);

  // Filter events based on selected filter
  useEffect(() => {
    const now = new Date();
    let filtered: Event[] = [];

    switch (filter) {
      case "upcoming":
        filtered = events.filter(event => new Date(event.event_date) > now);
        break;
      case "past":
        filtered = events.filter(event => new Date(event.event_date) <= now);
        break;
      default:
        filtered = events;
    }

    setFilteredEvents(filtered);
  }, [events, filter]);


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const isUpcoming = (eventDate: string) => {
    return new Date(eventDate) > new Date();
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Events</h1>
        </div>

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

        {/* Filter Buttons */}
        <div className="d-flex gap-2 mb-4">
          {[
            { key: "upcoming", label: "Upcoming" },
            { key: "past", label: "Past" },
            { key: "all", label: "All" }
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`btn ${filter === key ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => setFilter(key as FilterType)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Events List */}
        {filteredEvents.length === 0 ? (
          <div className="card">
            <div className="card-body text-center py-5">
              <FontAwesomeIcon icon={faCalendar} className="text-muted mb-3" size="3x" />
              <h5 className="text-muted">No events found</h5>
              <p className="text-muted">No events match your current filter.</p>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {filteredEvents.map((event) => (
              <div key={event.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100">
                  {event.image_url && (
                    <img
                      src={event.image_url}
                      className="card-img-top"
                      alt={event.title}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title">{event.title}</h5>
                      <span className={`badge ${
                        event.status === "published" ? "bg-success" :
                        event.status === "draft" ? "bg-warning" :
                        event.status === "cancelled" ? "bg-danger" : "bg-secondary"
                      }`}>
                        {event.status}
                      </span>
                    </div>

                    <p className="card-text text-muted small mb-3">
                      {event.description || "No description available."}
                    </p>

                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-1">
                        <FontAwesomeIcon icon={faCalendar} className="text-primary me-2" />
                        <small>{formatDate(event.event_date)}</small>
                      </div>
                      
                      {event.end_date && (
                        <div className="d-flex align-items-center mb-1">
                          <FontAwesomeIcon icon={faClock} className="text-primary me-2" />
                          <small>Ends: {formatTime(event.end_date)}</small>
                        </div>
                      )}

                      {event.place && (
                        <div className="d-flex align-items-center mb-1">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary me-2" />
                          <small>{event.place}</small>
                        </div>
                      )}

                      {event.organizer && (
                        <div className="d-flex align-items-center mb-1">
                          <FontAwesomeIcon icon={faUser} className="text-primary me-2" />
                          <small>{event.organizer}</small>
                        </div>
                      )}

                      {event.max_participants && (
                        <div className="d-flex align-items-center mb-1">
                          <FontAwesomeIcon icon={faUsers} className="text-primary me-2" />
                          <small>Max {event.max_participants} participants</small>
                        </div>
                      )}
                    </div>

                    {(event.resources && event.resources.length > 0) && (
                      <div className="mb-3">
                        <small className="text-muted">
                          <FontAwesomeIcon icon={faFileAlt} className="me-1" />
                          Resources: {event.resources.length}
                        </small>
                      </div>
                    )}

                    {(event.attachments && event.attachments.length > 0) && (
                      <div className="mb-3">
                        <small className="text-muted">
                          <FontAwesomeIcon icon={faPaperclip} className="me-1" />
                          Attachments: {event.attachments.length}
                        </small>
                      </div>
                    )}

                    <div className="mt-auto">
                      <button className="btn btn-outline-primary btn-sm w-100">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}