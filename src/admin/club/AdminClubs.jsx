import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/config";
import "../../styles/AdminClubs.css";

export default function AdminClubs() {
  const navigate = useNavigate();

  const [clubs, setClubs] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    description: ""
  });

 
  const loadClubs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/clubs`, {
        credentials: "include"
      });
      const data = await res.json();
      setClubs(data || []);
    } catch (err) {
      console.error("Failed to load clubs", err);
    }
  };

  useEffect(() => {
    loadClubs();
  }, []);

  const createClub = async () => {
    await fetch(`${API_BASE_URL}/api/admin/clubs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form)
    });

    setForm({ name: "", email: "", description: "" });
    loadClubs();
  };

  const updateStatus = async (clubId, status) => {
    await fetch(
      `${API_BASE_URL}/api/admin/clubs/${clubId}/status?status=${status}`,
      { method: "PUT", credentials: "include" }
    );
    loadClubs();
  };

  return (
    <div className="admin-clubs">
      <h1>Club Management</h1>

    
      <div className="club-form">
        <input
          placeholder="Club Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
        <button onClick={createClub}>Create Club</button>
      </div>

  
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {clubs.map(club => (
            <tr key={club.id}>
              <td>{club.name}</td>
              <td>{club.email}</td>
              <td>{club.status}</td>
              <td>{club.createdAt?.split("T")[0]}</td>
              <td>
             
                <button
                  className="info"
                  onClick={() => navigate(`/admin/clubs/${club.id}`)}
                >
                  Open
                </button>

                {club.status === "ACTIVE" ? (
                  <button
                    className="danger"
                    onClick={() => updateStatus(club.id, "INACTIVE")}
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    className="success"
                    onClick={() => updateStatus(club.id, "ACTIVE")}
                  >
                    Activate
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
