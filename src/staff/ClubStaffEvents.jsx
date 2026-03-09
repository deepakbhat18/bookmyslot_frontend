
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/config";
import "../styles/ClubStaffEvents.css";

export default function ClubStaffEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const staffId = sessionStorage.getItem("USER_ID");

  useEffect(() => {
    if (!staffId) { navigate("/login"); return; }
    // ✅ Correct endpoint: /api/events/staff/{staffUserId}
    fetch(`${API_BASE_URL}/api/events/staff/${staffId}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [staffId]);

  const statusColor = (s) => {
    if (s === "PUBLISHED") return "badge-green";
    if (s === "DRAFT")     return "badge-yellow";
    if (s === "CANCELLED") return "badge-red";
    return "badge-grey";
  };

  return (
    <div className="staff-events-page">
      <div className="page-header">
        <div>
          <h1>Club Events</h1>
          <p>Manage and track all your club's events</p>
        </div>
        <button className="btn-create" onClick={() => navigate("/staff/events/new")}>
          ＋ New Event
        </button>
      </div>

      {loading && <div className="loading">Loading events…</div>}

      {!loading && events.length === 0 && (
        <div className="empty-state">
          <span>📅</span>
          <p>No events yet. Create your first event!</p>
          <button onClick={() => navigate("/staff/events/new")}>Create Event</button>
        </div>
      )}

      <div className="events-grid">
        {events.map((e) => (
          <div key={e.eventId} className="event-row-card">
            <div className="event-row-info">
              <h3>{e.title}</h3>
              <div className="event-row-meta">
                <span>📅 {e.eventDate}</span>
                <span>⏰ {e.startTime} – {e.endTime}</span>
                <span>📍 {e.venue}</span>
                <span>🪑 {e.availableSeats}/{e.totalSeats} seats</span>
                {e.paid && <span className="price-tag">₹{e.price}</span>}
              </div>
            </div>
            <div className="event-row-right">
              <span className={`status-badge ${statusColor(e.clubName)}`}>
                {e.paid ? "PAID" : "FREE"}
              </span>
              <div className="event-row-actions">
                <button onClick={() => navigate(`/staff/events/${e.eventId}/edit`)}>
                  ✏️ Edit
                </button>
                <button onClick={() => navigate(`/staff/events/${e.eventId}/poster`)}>
                  🖼 Poster
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}