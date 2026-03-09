import { useNavigate } from "react-router-dom";
import "../styles/TeacherDashboard.css";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const name = sessionStorage.getItem("NAME") || "Teacher";
  const cards = [
    { icon: "➕", title: "Create Slots", desc: "Add new meeting slots for students to book", path: "/teacher/slots/create", color: "blue" },
    { icon: "📋", title: "My Bookings", desc: "See which students have booked your slots", path: "/teacher/bookings", color: "green" },
    { icon: "🗓️", title: "Calendar View", desc: "View your schedule in calendar format", path: "/teacher/calendar", color: "purple" },
  ];
  return (
    <div className="teacher-dashboard">
      <div className="teacher-hero">
        <h1>Welcome, {name} 👋</h1>
        <p>Manage your meeting slots and student appointments</p>
      </div>
      <div className="teacher-cards">
        {cards.map((card) => (
          <div key={card.path} className={`teacher-card ${card.color}`} onClick={() => navigate(card.path)}>
            <div className="card-icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
            <span className="card-arrow">→</span>
          </div>
        ))}
      </div>
    </div>
  );
}
