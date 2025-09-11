"use client";

import { useState, useEffect } from "react";
import { Database } from "@/types/supabase";

type Event = Database['public']['Tables']['events']['Row'];
type EventInsert = Database['public']['Tables']['events']['Insert'];
type EventUpdate = Database['public']['Tables']['events']['Update'];

interface Props {
  event?: Event | null;
  onSave: (eventData: EventInsert | EventUpdate) => void;
  onClose: () => void;
}

export default function EventModal({ event, onSave, onClose }: Props) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    end_date: "",
    place: "",
    location_details: "",
    image_url: "",
    organizer: "",
    max_participants: "",
    registration_required: false,
    registration_deadline: "",
    status: "published" as "published" | "draft" | "cancelled" | "completed",
    resources: [] as string[],
    attachments: [] as string[]
  });

  const [newResource, setNewResource] = useState("");
  const [newAttachment, setNewAttachment] = useState("");

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        description: event.description || "",
        event_date: event.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : "",
        end_date: event.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : "",
        place: event.place || "",
        location_details: event.location_details || "",
        image_url: event.image_url || "",
        organizer: event.organizer || "",
        max_participants: event.max_participants?.toString() || "",
        registration_required: event.registration_required || false,
        registration_deadline: event.registration_deadline ? new Date(event.registration_deadline).toISOString().slice(0, 16) : "",
        status: event.status || "published",
        resources: event.resources || [],
        attachments: event.attachments || []
      });
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData = {
      ...formData,
      max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
      registration_deadline: formData.registration_deadline || null,
      end_date: formData.end_date || null
    };

    onSave(eventData);
  };

  const addResource = () => {
    if (newResource.trim()) {
      setFormData(prev => ({
        ...prev,
        resources: [...prev.resources, newResource.trim()]
      }));
      setNewResource("");
    }
  };

  const removeResource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  const addAttachment = () => {
    if (newAttachment.trim()) {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, newAttachment.trim()]
      }));
      setNewAttachment("");
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {event ? "Edit Event" : "Create New Event"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                {/* Title */}
                <div className="col-12">
                  <label className="form-label">Event Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                {/* Description */}
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                {/* Event Date & Time */}
                <div className="col-md-6">
                  <label className="form-label">Start Date & Time *</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={formData.event_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">End Date & Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>

                {/* Place & Location */}
                <div className="col-md-6">
                  <label className="form-label">Place/Venue</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.place}
                    onChange={(e) => setFormData(prev => ({ ...prev, place: e.target.value }))}
                    placeholder="e.g., IUT Campus, Room 101"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Organizer</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.organizer}
                    onChange={(e) => setFormData(prev => ({ ...prev, organizer: e.target.value }))}
                    placeholder="e.g., CSE Department"
                  />
                </div>

                {/* Location Details */}
                <div className="col-12">
                  <label className="form-label">Location Details</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={formData.location_details}
                    onChange={(e) => setFormData(prev => ({ ...prev, location_details: e.target.value }))}
                    placeholder="Additional location information, directions, etc."
                  />
                </div>

                {/* Image URL */}
                <div className="col-12">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Registration Settings */}
                <div className="col-md-6">
                  <label className="form-label">Max Participants</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.max_participants}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_participants: e.target.value }))}
                    min="1"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Registration Deadline</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={formData.registration_deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, registration_deadline: e.target.value }))}
                  />
                </div>

                {/* Registration Required Checkbox */}
                <div className="col-12">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="registrationRequired"
                      checked={formData.registration_required}
                      onChange={(e) => setFormData(prev => ({ ...prev, registration_required: e.target.checked }))}
                    />
                    <label className="form-check-label" htmlFor="registrationRequired">
                      Registration Required
                    </label>
                  </div>
                </div>

                {/* Status */}
                <div className="col-12">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Resources */}
                <div className="col-12">
                  <label className="form-label">Resources</label>
                  <div className="d-flex gap-2 mb-2">
                    <input
                      type="text"
                      className="form-control"
                      value={newResource}
                      onChange={(e) => setNewResource(e.target.value)}
                      placeholder="Add resource URL or description"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={addResource}
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                  {formData.resources.map((resource, index) => (
                    <div key={index} className="d-flex align-items-center gap-2 mb-1">
                      <span className="badge bg-secondary flex-fill text-start">{resource}</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeResource(index)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Attachments */}
                <div className="col-12">
                  <label className="form-label">Attachments</label>
                  <div className="d-flex gap-2 mb-2">
                    <input
                      type="text"
                      className="form-control"
                      value={newAttachment}
                      onChange={(e) => setNewAttachment(e.target.value)}
                      placeholder="Add attachment URL or description"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={addAttachment}
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                  {formData.attachments.map((attachment, index) => (
                    <div key={index} className="d-flex align-items-center gap-2 mb-1">
                      <span className="badge bg-info flex-fill text-start">{attachment}</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeAttachment(index)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {event ? "Update Event" : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
