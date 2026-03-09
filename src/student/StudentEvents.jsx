import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/config";
import "../styles/StudentEvents.css";

export default function StudentEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/public/events?page=0&size=50`)
      .then((res) => res.json())
      .then((data) => {
        const today = new Date(); today.setHours(0,0,0,0);
        const upcoming = (data.content || []).filter((e) => new Date(e.eventDate) >= today);
        setEvents(upcoming);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.description || "").toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "ALL" ||
      (filterType === "FREE" && !e.paid) || (filterType === "PAID" && e.paid);
    return matchSearch && matchType;
  });

  return (
    <div className="student-events-page">
      <div className="events-hero">
        <h1>Discover Events</h1>
        <p>Find and book amazing events happening at your college</p>
      </div>
      <div className="events-controls">
        <input className="search-input" placeholder="🔍  Search events..."
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="filter-tabs">
          {["ALL", "FREE", "PAID"].map((t) => (
            <button key={t} className={`filter-tab ${filterType === t ? "active" : ""}`}
              onClick={() => setFilterType(t)}>{t}</button>
          ))}
        </div>
      </div>
      {loading && <div className="loading-spinner">Loading events...</div>}
      {!loading && filtered.length === 0 && (
        <div className="empty-state"><span>🎭</span><p>No events found</p></div>
      )}
      <div className="events-grid">
        {filtered.map((event) => {
          const imageUrl = event.posterUrl ? `${API_BASE_URL}${event.posterUrl}` : null;
          const isToday = new Date(event.eventDate).toDateString() === new Date().toDateString();
          return (
            <div key={event.eventId} className="event-tile"
              onClick={() => navigate(`/student/events/${event.eventId}`)}>
              <div className="event-tile-img">
                {imageUrl ? <img src={imageUrl} alt={event.title} /> : <div className="event-tile-placeholder">🎪</div>}
                {isToday && <span className="badge today">Today</span>}
              </div>
              <div className="event-tile-body">
                <h3>{event.title}</h3>
                <p className="event-tile-desc">{event.description}</p>
                <div className="event-tile-meta">
                  <span>📅 {event.eventDate}</span>
                  <span>📍 {event.location}</span>
                </div>
              </div>
              <div className="event-tile-footer">
                <button className="btn-book" onClick={(e) => { e.stopPropagation(); navigate(`/student/events/${event.eventId}`); }}>
                  View &amp; Book →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
