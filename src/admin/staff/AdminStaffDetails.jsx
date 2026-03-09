

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/config";
import "../../styles/AdminStaff.css";

export default function AdminStaffDetails() {
  const { staffId } = useParams();
  const navigate    = useNavigate();

  // GET /api/admin/staff/{staffId} → AdminStaffResponse
  // Fields: id, name, email, clubName, active(boolean)
  const [staff,   setStaff]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg,     setMsg]     = useState({ text: "", type: "" });
  const [working, setWorking] = useState(false);

  const loadStaff = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/admin/staff/${staffId}`, { credentials: "include" })
      .then(r => r.json())
      .then(setStaff)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(loadStaff, [staffId]);

  // PUT /api/admin/staff/{staffId}/deactivate → ApiResponse<String>
  const deactivate = async () => {
    if (!window.confirm(`Deactivate ${staff?.name}? They will lose all access.`)) return;
    setWorking(true);
    setMsg({ text: "", type: "" });
    const res  = await fetch(`${API_BASE_URL}/api/admin/staff/${staffId}/deactivate`, {
      method: "PUT", credentials: "include",
    });
    const data = await res.json();
    setMsg(res.ok
      ? { text: "Staff deactivated successfully.", type: "ok" }
      : { text: data.message || "Deactivation failed.", type: "error" }
    );
    setWorking(false);
    loadStaff();
  };

  // POST /api/admin/staff/{staffId}/reset-password → ApiResponse<String>
  // Sends OTP to staff email — does NOT return a new password
  const resetPassword = async () => {
    setWorking(true);
    setMsg({ text: "", type: "" });
    const res  = await fetch(`${API_BASE_URL}/api/admin/staff/${staffId}/reset-password`, {
      method: "POST", credentials: "include",
    });
    const data = await res.json();
    setMsg(res.ok
      ? { text: "Password reset OTP sent to staff email.", type: "ok" }
      : { text: data.message || "Reset failed.", type: "error" }
    );
    setWorking(false);
  };

  if (loading) return <div className="staff-page"><p className="loading-state">Loading…</p></div>;
  if (!staff)  return <div className="staff-page"><p className="loading-state">Staff not found.</p></div>;

  return (
    <div className="staff-page">
      <div className="staff-header">
        <div>
          <button className="back-link" onClick={() => navigate("/admin/staff")}>← Staff List</button>
          <h1>Staff Details</h1>
        </div>
      </div>

      {msg.text && <div className={`staff-banner ${msg.type}`}>{msg.text}</div>}

      <div className="staff-detail-card">
        {/* Avatar + headline */}
        <div className="detail-hero">
          <div className="detail-avatar">{staff.name.charAt(0).toUpperCase()}</div>
          <div>
            <h2>{staff.name}</h2>
            <p className="detail-club">🏛️ {staff.clubName}</p>
            <span className={`status-pill ${staff.active ? "pill-green" : "pill-red"}`}>
              {staff.active ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>
        </div>

        {/* Info grid */}
        <div className="detail-info-grid">
          <div className="detail-row">
            <span>Email</span>
            <strong>{staff.email}</strong>
          </div>
          <div className="detail-row">
            <span>Club</span>
            <strong>{staff.clubName}</strong>
          </div>
          <div className="detail-row">
            <span>Account ID</span>
            <strong>#{staff.id}</strong>
          </div>
          <div className="detail-row">
            <span>Status</span>
            <strong className={staff.active ? "text-green" : "text-red"}>
              {staff.active ? "Active — has login access" : "Inactive — access revoked"}
            </strong>
          </div>
        </div>

        {/* Actions */}
        <div className="detail-actions">
          <button
            className="btn-reset"
            onClick={resetPassword}
            disabled={working}
          >
            🔑 Send Password Reset OTP
          </button>
          {staff.active && (
            <button
              className="btn-deactivate"
              onClick={deactivate}
              disabled={working}
            >
              🚫 Deactivate Account
            </button>
          )}
          <button className="btn-cancel" onClick={() => navigate("/admin/staff")}>
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}