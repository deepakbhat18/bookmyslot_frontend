
import { useNavigate } from "react-router-dom";
import "../styles/ClubStaffDashboard.css";

export default function StaffDashboard() {
  const navigate = useNavigate();

  const cards = [
    { icon: "➕", label: "Create Event",   sub: "Draft a new club event",           path: "/staff/events/new",  color: "card-indigo" },
    { icon: "📋", label: "My Events",      sub: "View, edit & manage all events",    path: "/staff/events",      color: "card-blue"   },
    { icon: "✅", label: "Check-In",       sub: "Scan QR codes at the event gate",   path: "/staff/checkin",     color: "card-green"  },
  ];

  return (
    <div className="staff-dash">
      <div className="dash-header">
        <h1>Club Staff Dashboard</h1>
        <p>Manage your events and check students in</p>
      </div>

      <div className="dash-grid">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`dash-card ${c.color}`}
            onClick={() => navigate(c.path)}
          >
            <span className="dash-card-icon">{c.icon}</span>
            <div>
              <h3>{c.label}</h3>
              <p>{c.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}