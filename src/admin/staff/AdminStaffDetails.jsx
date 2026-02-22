import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/config";
import "../../styles/AdminStaff.css";

export default function AdminStaffDetails() {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/staff/${staffId}`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(setStaff);
  }, [staffId]);

  const resetPassword = async () => {
    await fetch(
      `${API_BASE_URL}/api/admin/staff/${staffId}/reset-password`,
      { method: "POST", credentials: "include" }
    );
    alert("Reset email sent");
  };

  if (!staff) return <p>Loading...</p>;

  return (
    <div className="admin-staff-details">
      <h2>Staff Details</h2>

      <p><b>Name:</b> {staff.name}</p>
      <p><b>Email:</b> {staff.email}</p>
      <p><b>Club:</b> {staff.clubName}</p>
      <p><b>Status:</b> {staff.active ? "ACTIVE" : "INACTIVE"}</p>

      <button onClick={resetPassword}>Reset Password</button>
      <button className="secondary" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}
