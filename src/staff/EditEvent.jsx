

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/config";
import "../styles/CreateEvent.css";

export default function EditEvent() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  // EventUpdateRequest uses same field names as EventCreateRequest
  const [form, setForm] = useState({
    title: "", description: "", venue: "",
    startTime: "", endTime: "",
    paid: false, price: 0, maxSeats: 0,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    // GET /api/events/{eventId} → EventResponse
    fetch(`${API_BASE_URL}/api/events/${eventId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((ev) => {
        setForm({
          title: ev.title || "",
          description: ev.description || "",
          venue: ev.venue || "",
          startTime: ev.startTime || "",
          endTime: ev.endTime || "",
          paid: ev.paid || false,
          price: ev.price || 0,
          maxSeats: ev.totalSeats || 0,
        });
      })
      .catch(console.error)
      .finally(() => setFetching(false));
  }, [eventId]);

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const submit = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          venue: form.venue,
          startTime: form.startTime,
          endTime: form.endTime,
          paid: form.paid,
          price: form.paid ? Number(form.price) : 0,
          maxSeats: Number(form.maxSeats),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.message || "Update failed.", type: "error" });
        return;
      }
      setMessage({ text: "Event updated successfully.", type: "success" });
      setTimeout(() => navigate("/staff/events"), 1200);
    } catch {
      setMessage({ text: "Server error.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="loading">Loading event…</div>;

  return (
    <div className="create-event-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/staff/events")}>← Back</button>
        <h1>Edit Event</h1>
        <p>Changes take effect immediately after saving</p>
      </div>

      <div className="form-card">
        <div className="form-section">
          <label>Event Title</label>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} />
        </div>

        <div className="form-section">
          <label>Description</label>
          <textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>

        <div className="form-section">
          <label>Venue</label>
          <input value={form.venue} onChange={(e) => set("venue", e.target.value)} />
        </div>

        <div className="form-row">
          <div className="form-section">
            <label>Start Time</label>
            <input type="time" value={form.startTime} onChange={(e) => set("startTime", e.target.value)} />
          </div>
          <div className="form-section">
            <label>End Time</label>
            <input type="time" value={form.endTime} onChange={(e) => set("endTime", e.target.value)} />
          </div>
          <div className="form-section">
            <label>Max Seats</label>
            <input type="number" min="1" value={form.maxSeats} onChange={(e) => set("maxSeats", e.target.value)} />
          </div>
        </div>

        {/* ── PAID EVENT ── */}
        <div className="paid-toggle">
          <label className="toggle-label">
            <input type="checkbox" checked={form.paid} onChange={(e) => set("paid", e.target.checked)} />
            <span className="toggle-track"><span className="toggle-thumb" /></span>
            <span>Paid Event</span>
          </label>
        </div>

        {form.paid && (
          <div className="paid-section">
            <div className="paid-banner">
              <span>💳</span>
              <div>
                <strong>Paid Event — Razorpay Checkout</strong>
                <p>Students will pay via Razorpay before booking is confirmed.</p>
              </div>
            </div>
            <div className="form-section">
              <label>Ticket Price (₹)</label>
              <input type="number" min="1" value={form.price} onChange={(e) => set("price", e.target.value)} />
            </div>
          </div>
        )}

        {message.text && (
          <div className={`form-msg ${message.type}`}>{message.text}</div>
        )}

        <button className="btn-submit" onClick={submit} disabled={loading}>
          {loading ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}