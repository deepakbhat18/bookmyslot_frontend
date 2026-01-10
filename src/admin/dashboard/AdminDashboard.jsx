
import { useNavigate } from "react-router-dom";
import "../../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">Admin Control Panel</h1>
      <p className="admin-subtitle">
        Choose what you want to manage
      </p>

      <div className="admin-cards">
        <div
          className="admin-card"
          onClick={() => navigate("/admin/clubs")}
        >
          <h2>🏛 Club Events</h2>
          <p>Manage clubs, events, approvals, staff & analytics</p>
        </div>

        <div
          className="admin-card"
          onClick={() => navigate("/admin/slots")}
        >
          <h2>👨‍🏫 Teacher Slots</h2>
          <p>View slot usage and analytics</p>
        </div>
      </div>
    </div>
  );
}
