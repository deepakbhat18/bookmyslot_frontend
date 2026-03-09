
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../api/config";
import "../../styles/ClubEvents.css";

export default function ClubEvents({ clubId }) {
  // GET /api/admin/clubs/{clubId}/events → EventListResponse[]
  // Fields: eventId, title, venue, eventDate, startTime, paid, price, availableSeats, posterUrl
  const [clubEvents, setClubEvents]       = useState([]);
  const [loadingClub, setLoadingClub]     = useState(true);

  // GET /api/admin/events/pending → EventResponse[]
  // Fields: eventId, title, description, venue, eventDate, startTime, endTime,
  //         paid, price, totalSeats, availableSeats, clubName, posterUrl
  const [pending, setPending]             = useState([]);
  const [loadingPend, setLoadingPend]     = useState(true);

  const [msg, setMsg] = useState({ text: "", type: "" });

  const fetchClubEvents = () => {
    setLoadingClub(true);
    fetch(`${API_BASE_URL}/api/admin/clubs/${clubId}/events`, { credentials: "include" })
      .then(r => r.json())
      .then(d => setClubEvents(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoadingClub(false));
  };

  const fetchPending = () => {
    setLoadingPend(true);
    fetch(`${API_BASE_URL}/api/admin/events/pending`, { credentials: "include" })
      .then(r => r.json())
      .then(d => setPending(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoadingPend(false));
  };

  useEffect(() => {
    fetchClubEvents();
    fetchPending();
  }, [clubId]);

  // PUT /api/admin/events/{eventId}/approve → ApiResponse<String>
  const approve = async (eventId, title) => {
    setMsg({ text: "", type: "" });
    const res  = await fetch(`${API_BASE_URL}/api/admin/events/${eventId}/approve`, {
      method: "PUT", credentials: "include",
    });
    const data = await res.json();
    if (res.ok) {
      setMsg({ text: `✅ "${title}" approved and published.`, type: "ok" });
    } else {
      setMsg({ text: data.message || "Approval failed.", type: "error" });
    }
    fetchPending();
    fetchClubEvents();
  };

  // PUT /api/admin/events/{eventId}/reject → ApiResponse<String>
  const reject = async (eventId, title) => {
    setMsg({ text: "", type: "" });
    const res  = await fetch(`${API_BASE_URL}/api/admin/events/${eventId}/reject`, {
      method: "PUT", credentials: "include",
    });
    const data = await res.json();
    if (res.ok) {
      setMsg({ text: `Event "${title}" rejected.`, type: "info" });
    } else {
      setMsg({ text: data.message || "Rejection failed.", type: "error" });
    }
    fetchPending();
  };

  return (
    <div className="club-events-panel">

      {msg.text && (
        <div className={`events-msg ${msg.type}`}>{msg.text}</div>
      )}

      {/* ── PENDING APPROVALS ── */}
      <section className="events-section">
        <div className="events-section-hdr">
          <h3>⏳ Pending Approvals</h3>
          {!loadingPend && pending.length > 0 && (
            <span className="count-badge">{pending.length} waiting</span>
          )}
        </div>

        {loadingPend && <p className="loading-inline">Loading…</p>}

        {!loadingPend && pending.length === 0 && (
          <div className="empty-inline">🎉 No pending events — inbox is clear!</div>
        )}

        {!loadingPend && pending.length > 0 && (
          <div className="pending-list">
            {pending.map(e => (
              <div key={e.eventId} className="pending-card">
                <div className="pending-info">
                  <h4>{e.title}</h4>
                  <div className="pending-meta">
                    <span>📅 {e.eventDate}</span>
                    <span>⏰ {e.startTime} – {e.endTime}</span>
                    <span>📍 {e.venue}</span>
                    <span>🏛️ {e.clubName}</span>
                    {e.paid
                      ? <span className="tag-paid">₹{e.price} · PAID</span>
                      : <span className="tag-free">FREE</span>}
                  </div>
                  {e.description && <p className="pending-desc">{e.description}</p>}
                </div>
                <div className="pending-actions">
                  <button className="btn-approve" onClick={() => approve(e.eventId, e.title)}>
                    ✅ Approve
                  </button>
                  <button className="btn-reject"  onClick={() => reject(e.eventId, e.title)}>
                    ✕ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── CLUB'S PUBLISHED EVENTS ── */}
      <section className="events-section">
        <div className="events-section-hdr">
          <h3>📋 Club Events</h3>
          {!loadingClub && (
            <span className="count-badge grey">{clubEvents.length} total</span>
          )}
        </div>

        {loadingClub && <p className="loading-inline">Loading…</p>}

        {!loadingClub && clubEvents.length === 0 && (
          <div className="empty-inline">No events created for this club yet.</div>
        )}

        {!loadingClub && clubEvents.length > 0 && (
          <div className="events-table-wrap">
            <table className="events-tbl">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Venue</th>
                  <th>Type</th>
                  <th>Available Seats</th>
                </tr>
              </thead>
              <tbody>
                {clubEvents.map(e => (
                  <tr key={e.eventId}>
                    <td><strong>{e.title}</strong></td>
                    <td>{e.eventDate}</td>
                    <td>{e.startTime}</td>
                    <td>{e.venue}</td>
                    <td>
                      {e.paid
                        ? <span className="tag-paid">₹{e.price}</span>
                        : <span className="tag-free">FREE</span>}
                    </td>
                    <td>{e.availableSeats}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}