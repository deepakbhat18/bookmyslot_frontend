import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/config";
import "../styles/TeacherCreateSlot.css";

export default function TeacherCreateSlot() {
  const navigate = useNavigate();
  const teacherId = sessionStorage.getItem("USER_ID");
  const [form, setForm] = useState({ date: "", startTime: "", endTime: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = async () => {
    setMessage("");
    if (!form.date || !form.startTime || !form.endTime) { setMessage("All fields are required"); setMessageType("error"); return; }
    if (form.startTime >= form.endTime) { setMessage("End time must be after start time"); setMessageType("error"); return; }
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/slots/create`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ teacherId: Number(teacherId), date: form.date, startTime: form.startTime, endTime: form.endTime }),
      });
      const data = await res.json();
      if (res.ok) { setMessage("✅ Slot created successfully!"); setMessageType("success"); setForm({ date: "", startTime: "", endTime: "" }); }
      else { setMessage(data.message || "Failed to create slot"); setMessageType("error"); }
    } catch { setMessage("Server error"); setMessageType("error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="create-slot-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/teacher")}>← Dashboard</button>
        <h1>Create Meeting Slot</h1>
        <p>Add a new time slot for student bookings</p>
      </div>
      <div className="slot-form-card">
        <div className="form-group">
          <label>📅 Date</label>
          <input type="date" value={form.date} min={new Date().toLocaleDateString("en-CA")}
            onChange={(e) => setForm({ ...form, date: e.target.value })} className="form-input" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>⏰ Start Time</label>
            <input type="time" value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="form-input" />
          </div>
          <div className="form-group">
            <label>⏰ End Time</label>
            <input type="time" value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="form-input" />
          </div>
        </div>
        {message && <div className={`form-message ${messageType}`}>{message}</div>}
        <div className="form-actions">
          <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Slot"}
          </button>
          <button className="btn-view" onClick={() => navigate("/teacher/bookings")}>View My Bookings</button>
        </div>
      </div>
      <div className="slot-tips">
        <h3>💡 Tips</h3>
        <ul>
          <li>Create slots at least a day in advance</li>
          <li>Typical slot duration: 30–60 minutes</li>
          <li>Students will receive an email confirmation</li>
          <li>You can create multiple slots per day</li>
        </ul>
      </div>
    </div>
  );
}
