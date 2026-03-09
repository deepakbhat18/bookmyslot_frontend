import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/config";
import "../styles/TeacherCalendar.css";

export default function TeacherCalendar() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const teacherId = sessionStorage.getItem("USER_ID");

  useEffect(() => {
    if (!teacherId) { navigate("/login"); return; }
    fetch(`${API_BASE_URL}/api/calendar/teacher/${teacherId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });
  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const getEventsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.start?.startsWith(dateStr));
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  const today = new Date();

  return (
    <div className="teacher-calendar-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/teacher")}>← Dashboard</button>
        <h1>My Calendar</h1>
        <p>Visual overview of your slots and bookings</p>
      </div>
      {loading && <div className="loading">Loading calendar...</div>}
      <div className="calendar-container">
        <div className="calendar-nav">
          <button className="nav-btn" onClick={prevMonth}>‹</button>
          <h2>{monthName}</h2>
          <button className="nav-btn" onClick={nextMonth}>›</button>
        </div>
        <div className="calendar-grid">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d} className="day-header">{d}</div>
          ))}
          {days.map((day, idx) => {
            if (!day) return <div key={`e-${idx}`} className="day-cell empty" />;
            const dayEvents = getEventsForDay(day);
            const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
            return (
              <div key={day} className={`day-cell ${isToday ? "today" : ""} ${dayEvents.length > 0 ? "has-events" : ""}`}>
                <span className="day-number">{day}</span>
                <div className="day-events">
                  {dayEvents.slice(0, 2).map((e, i) => (
                    <div key={i} className={`cal-event ${e.type === "STUDENT_BOOKING" ? "booked" : "available"}`} title={e.title}>
                      <span>{e.type === "STUDENT_BOOKING" ? "👤" : "🕐"}</span>
                      <span className="cal-event-title">{e.title}</span>
                    </div>
                  ))}
                  {dayEvents.length > 2 && <span className="more-events">+{dayEvents.length - 2} more</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="cal-legend">
        <div className="legend-item"><span className="legend-dot available"></span><span>Available Slot</span></div>
        <div className="legend-item"><span className="legend-dot booked"></span><span>Student Booking</span></div>
      </div>
    </div>
  );
}
