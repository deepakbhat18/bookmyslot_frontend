import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../api/config";
import ClubEvents from "./ClubEvents";
import ClubAnalytics from "./ClubAnalytics";
import "../../styles/ClubDashboard.css";

export default function ClubDashboard() {
  const { clubId } = useParams();
  const navigate   = useNavigate();
  const [tab,  setTab]  = useState("EVENTS");
  const [club, setClub] = useState(null);

  // Load club details to show name/status in header
  // GET /api/admin/clubs → List<Club> (raw, no wrapper)
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/clubs`, { credentials: "include" })
      .then(r => r.json())
      .then(list => {
        const found = (Array.isArray(list) ? list : [])
          .find(c => String(c.id) === String(clubId));
        setClub(found || null);
      })
      .catch(console.error);
  }, [clubId]);

  const tabs = [
    { key: "EVENTS",    label: "📋 Events & Approvals" },
    { key: "ANALYTICS", label: "📊 Analytics"           },
  ];

  return (
    <div className="club-dash-page">
      {/* Header */}
      <div className="club-dash-header">
        <button className="back-link" onClick={() => navigate("/admin/clubs")}>← All Clubs</button>
        <div className="club-dash-title">
          <div className="club-dash-avatar">
            {club ? club.name.charAt(0).toUpperCase() : "?"}
          </div>
          <div>
            <h1>{club ? club.name : "Club Dashboard"}</h1>
            {club && (
              <p>
                {club.email}
                {" · "}
                <span className={`inline-pill ${club.status === "ACTIVE" ? "pill-green" : "pill-red"}`}>
                  {club.status}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="club-tabs">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`club-tab-btn ${tab === t.key ? "active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="club-tab-body">
        {/* clubId passed as PROP — children must not call useParams themselves */}
        {tab === "EVENTS"    && <ClubEvents    clubId={clubId} />}
        {tab === "ANALYTICS" && <ClubAnalytics clubId={clubId} />}
      </div>
    </div>
  );
}