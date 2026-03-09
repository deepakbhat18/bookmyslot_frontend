import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/config";
import "../styles/StudentMySlots.css";

export default function StudentMySlots() {
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const studentId = sessionStorage.getItem("USER_ID");

  useEffect(() => {
    if (!studentId) { navigate("/login"); return; }
    fetch(`${API_BASE_URL}/api/slots/student/${studentId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setSlots(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="my-slots-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/student")}>← Dashboard</button>
        <h1>My Teacher Appointments</h1>
        <p>Your scheduled meetings with teachers</p>
      </div>
      {loading && <div className="loading">Loading your appointments...</div>}
      {!loading && slots.length === 0 && (
        <div className="empty-state">
          <span>📅</span><p>No appointments booked yet</p>
          <button className="btn-primary" onClick={() => navigate("/student/book-slot")}>Book a Slot</button>
        </div>
      )}
      <div className="slots-list">
        {slots.map((booking) => (
          <div key={booking.id} className={`slot-booking-card ${booking.status?.toLowerCase()}`}>
            <div className="slot-booking-icon">{booking.status === "BOOKED" ? "✅" : "❌"}</div>
            <div className="slot-booking-info">
              <h3>Meeting with {booking.slot?.teacher?.name || "Teacher"}</h3>
              <div className="slot-booking-meta">
                <span>📅 {booking.slot?.date}</span>
                <span>⏰ {booking.slot?.startTime} – {booking.slot?.endTime}</span>
                <span className={`status-badge ${booking.status?.toLowerCase()}`}>{booking.status}</span>
              </div>
              {booking.bookedAt && <small>Booked at: {new Date(booking.bookedAt).toLocaleString()}</small>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
