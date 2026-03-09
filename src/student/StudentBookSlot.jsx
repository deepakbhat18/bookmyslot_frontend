import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/config";
import "../styles/StudentBookSlot.css";

export default function StudentBookSlot() {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date().toLocaleDateString("en-CA"));
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const studentId = sessionStorage.getItem("USER_ID");

  useEffect(() => { if (!studentId) navigate("/login"); }, []);

  const fetchSlots = async () => {
    setLoading(true); setMessage("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/slots/available?date=${date}`, { credentials: "include" });
      const data = await res.json();
      setSlots(Array.isArray(data) ? data : []);
    } catch { setMessage("Failed to load slots"); setMessageType("error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSlots(); }, [date]);

  const bookSlot = async (slotId) => {
    setBooking(slotId); setMessage("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/slots/book`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ slotId, studentId: Number(studentId) }),
      });
      const data = await res.json();
      if (res.ok) { setMessage("✅ Slot booked successfully!"); setMessageType("success"); fetchSlots(); }
      else { setMessage(data.message || "Booking failed"); setMessageType("error"); }
    } catch { setMessage("Server error"); setMessageType("error"); }
    finally { setBooking(null); }
  };

  return (
    <div className="book-slot-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/student")}>← Dashboard</button>
        <h1>Book a Teacher Slot</h1>
        <p>Select a date to see available meeting slots</p>
      </div>
      <div className="date-picker-wrap">
        <label>Select Date</label>
        <input type="date" value={date} min={new Date().toLocaleDateString("en-CA")}
          onChange={(e) => setDate(e.target.value)} className="date-input" />
      </div>
      {message && <div className={`alert-msg ${messageType}`}>{message}</div>}
      {loading && <div className="loading">Checking available slots...</div>}
      {!loading && slots.length === 0 && (
        <div className="empty-state"><span>📅</span><p>No available slots for {date}</p></div>
      )}
      <div className="slots-grid">
        {slots.map((slot) => (
          <div key={slot.id} className="slot-card">
            <div className="slot-teacher">
              <span className="teacher-avatar">👨‍🏫</span>
              <div>
                <p className="teacher-name">{slot.teacher?.name || "Teacher"}</p>
                <small>{slot.teacher?.email || ""}</small>
              </div>
            </div>
            <div className="slot-time"><span>🕐</span><p>{slot.startTime} – {slot.endTime}</p></div>
            <div className="slot-date"><span>📅</span><p>{slot.date}</p></div>
            <span className="slot-status available">AVAILABLE</span>
            <button className="btn-book-slot" disabled={booking === slot.id} onClick={() => bookSlot(slot.id)}>
              {booking === slot.id ? "Booking..." : "Book Slot"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
