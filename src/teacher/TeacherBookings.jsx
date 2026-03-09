import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/config";
import "../styles/TeacherBookings.css";

export default function TeacherBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const teacherId = sessionStorage.getItem("USER_ID");

  useEffect(() => {
    if (!teacherId) { navigate("/login"); return; }
    fetch(`${API_BASE_URL}/api/slots/teacher/${teacherId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = bookings.filter((b) => filter === "ALL" || b.status === filter);
  const grouped = filtered.reduce((acc, b) => {
    const date = b.slot?.date || "Unknown";
    if (!acc[date]) acc[date] = [];
    acc[date].push(b);
    return acc;
  }, {});
  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="teacher-bookings-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/teacher")}>← Dashboard</button>
        <h1>Student Bookings</h1>
        <p>Students who have booked your meeting slots</p>
      </div>
      <div className="filter-row">
        {["ALL", "BOOKED", "CANCELLED"].map((f) => (
          <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
        <span className="booking-count">{filtered.length} bookings</span>
      </div>
      {loading && <div className="loading">Loading bookings...</div>}
      {!loading && filtered.length === 0 && (
        <div className="empty-state">
          <span>📭</span><p>No bookings yet</p>
          <button className="btn-primary" onClick={() => navigate("/teacher/slots/create")}>Create Slots</button>
        </div>
      )}
      {sortedDates.map((date) => (
        <div key={date} className="booking-day-group">
          <div className="day-label">📅 {date}</div>
          {grouped[date].map((booking) => (
            <div key={booking.id} className={`teacher-booking-card ${booking.status?.toLowerCase()}`}>
              <div className="student-info">
                <div className="student-avatar">{booking.student?.name?.[0]?.toUpperCase() || "S"}</div>
                <div>
                  <h3>{booking.student?.name || "Student"}</h3>
                  <p>{booking.student?.email || ""}</p>
                </div>
              </div>
              <div className="booking-time"><span>⏰</span><p>{booking.slot?.startTime} – {booking.slot?.endTime}</p></div>
              <span className={`status-badge ${booking.status?.toLowerCase()}`}>{booking.status}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
