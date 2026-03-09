import { useNavigate } from "react-router-dom";
import "../styles/StudentDashboard.css";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const name = sessionStorage.getItem("NAME") || "Student";
  const cards = [
    { icon: "🎪", title: "Browse Events", desc: "Discover and book upcoming college events", path: "/student/events", color: "purple" },
    { icon: "🎟️", title: "My Tickets", desc: "View and manage your event bookings", path: "/student/my-bookings", color: "green" },
    { icon: "📅", title: "Book Teacher Slot", desc: "Schedule a meeting with your teacher", path: "/student/book-slot", color: "blue" },
    { icon: "📋", title: "My Slot Bookings", desc: "View your scheduled teacher meetings", path: "/student/my-slots", color: "orange" },
  ];
  return (
    <div className="student-dashboard">
      <div className="student-hero">
        <h1>Welcome back, {name} 👋</h1>
        <p>What would you like to do today?</p>
      </div>
      <div className="student-cards">
        {cards.map((card) => (
          <div key={card.path} className={`student-card ${card.color}`} onClick={() => navigate(card.path)}>
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
