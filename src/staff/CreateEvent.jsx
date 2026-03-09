
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/config";
import "../styles/CreateEvent.css";

export default function CreateEvent() {
  const navigate = useNavigate();
  // EventCreateRequest: title, description, venue, eventDate, startTime, endTime, paid(bool), price(double), maxSeats(int)
  const [form, setForm] = useState({
    title: "",
    description: "",
    venue: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    paid: false,
    price: 0,
    maxSeats: 0,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const submit = async () => {
    if (!form.title || !form.venue || !form.eventDate || !form.startTime || !form.endTime || !form.maxSeats) {
      setMessage({ text: "Please fill all required fields.", type: "error" });
      return;
    }
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await fetch(`${API_BASE_URL}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        // EventCreateRequest exact fields
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          venue: form.venue,
          eventDate: form.eventDate,
          startTime: form.startTime,
          endTime: form.endTime,
          paid: form.paid,
          price: form.paid ? Number(form.price) : 0,
          maxSeats: Number(form.maxSeats),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.message || "Failed to create event.", type: "error" });
        return;
      }
      setMessage({ text: "Event created! Pending admin approval.", type: "success" });
      setTimeout(() => navigate("/staff/events"), 1500);
    } catch {
      setMessage({ text: "Server error.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/staff/events")}>← Back</button>
        <h1>Create New Event</h1>
        <p>Submitted events require admin approval before publishing</p>
      </div>

      <div className="form-card">
        <div className="form-section">
          <label>Event Title *</label>
          <input
            placeholder="e.g. Annual Tech Fest 2026"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </div>

        <div className="form-section">
          <label>Description</label>
          <textarea
            rows={4}
            placeholder="Describe your event…"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>

        <div className="form-section">
          <label>Venue *</label>
          <input
            placeholder="e.g. Auditorium Block A"
            value={form.venue}
            onChange={(e) => set("venue", e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-section">
            <label>Date *</label>
            <input type="date" value={form.eventDate} onChange={(e) => set("eventDate", e.target.value)} />
          </div>
          <div className="form-section">
            <label>Start Time *</label>
            <input type="time" value={form.startTime} onChange={(e) => set("startTime", e.target.value)} />
          </div>
          <div className="form-section">
            <label>End Time *</label>
            <input type="time" value={form.endTime} onChange={(e) => set("endTime", e.target.value)} />
          </div>
        </div>

        <div className="form-section">
          <label>Max Seats *</label>
          <input
            type="number"
            min="1"
            placeholder="e.g. 200"
            value={form.maxSeats || ""}
            onChange={(e) => set("maxSeats", e.target.value)}
          />
        </div>

        {/* ── PAID EVENT SECTION ── */}
        <div className="paid-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={form.paid}
              onChange={(e) => set("paid", e.target.checked)}
            />
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
                <p>Students will pay via Razorpay before their booking is confirmed.</p>
              </div>
            </div>
            <div className="form-section">
              <label>Ticket Price (₹) *</label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 199"
                value={form.price || ""}
                onChange={(e) => set("price", e.target.value)}
              />
            </div>
          </div>
        )}

        {message.text && (
          <div className={`form-msg ${message.type}`}>{message.text}</div>
        )}

        <button className="btn-submit" onClick={submit} disabled={loading}>
          {loading ? "Creating…" : "Submit for Approval"}
        </button>
      </div>
    </div>
  );
}