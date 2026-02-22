import { useNavigate } from "react-router-dom";
import "../styles/Staff.css";

export default function StaffDashboard() {
  const navigate = useNavigate();

  return (
    <div className="staff-container">
      <h1>Club Staff Dashboard</h1>

      <div className="staff-actions">
        <button onClick={() => navigate("/staff/events/new")}>
          ➕ Create Event
        </button>

        <button onClick={() => navigate("/staff/events")}>
          📋 My Events
        </button>
      </div>
    </div>
  );
}
