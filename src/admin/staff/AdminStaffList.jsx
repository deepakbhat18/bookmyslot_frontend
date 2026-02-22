import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/config";
import "../../styles/AdminStaff.css";

export default function AdminStaffList() {
  const [staff, setStaff] = useState([]);
  const navigate = useNavigate();

  const loadStaff = async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/staff`, {
      credentials: "include"
    });
    const data = await res.json();
    setStaff(data || []);
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const deactivate = async (id) => {
    if (!window.confirm("Deactivate this staff?")) return;

    await fetch(`${API_BASE_URL}/api/admin/staff/${id}/deactivate`, {
      method: "PUT",
      credentials: "include"
    });

    loadStaff();
  };

  return (
    <div className="admin-staff">
      <div className="header">
        <h1>Club Staff</h1>
        <button onClick={() => navigate("/admin/staff/add")}>
          ➕ Add / Replace Staff
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Club</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {staff.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.clubName}</td>
              <td className={s.active ? "active" : "inactive"}>
                {s.active ? "ACTIVE" : "INACTIVE"}
              </td>
              <td>
                <button onClick={() => navigate(`/admin/staff/${s.id}`)}>
                  View
                </button>
                {s.active && (
                  <button className="danger" onClick={() => deactivate(s.id)}>
                    Deactivate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
