

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/config";
import "../../styles/AdminClubs.css";

export default function AdminClubs() {
  const navigate = useNavigate();

  // Club model fields: id, name, email, description, status("ACTIVE"|"INACTIVE"), createdAt
  const [clubs,    setClubs]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState({ name: "", email: "", description: "" });
  const [creating, setCreating] = useState(false);
  const [msg,      setMsg]      = useState({ text: "", type: "" });
  const [search,   setSearch]   = useState("");

  // GET /api/admin/clubs → raw List<Club> (NO ApiResponse wrapper)
  const loadClubs = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/admin/clubs`, { credentials: "include" })
      .then(r => r.json())
      .then(d => setClubs(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(loadClubs, []);

  // POST /api/admin/clubs → ApiResponse<Club>
  // Body: ClubCreateRequest { name, email, description }
  const createClub = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setMsg({ text: "Club name and email are required.", type: "error" });
      return;
    }
    setCreating(true);
    setMsg({ text: "", type: "" });
    try {
      const res  = await fetch(`${API_BASE_URL}/api/admin/clubs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ text: data.message || "Failed to create club.", type: "error" });
        return;
      }
      setMsg({ text: `✅ Club "${form.name}" created successfully!`, type: "ok" });
      setForm({ name: "", email: "", description: "" });
      setShowForm(false);
      loadClubs();
    } catch {
      setMsg({ text: "Server error.", type: "error" });
    } finally {
      setCreating(false);
    }
  };

  // PUT /api/admin/clubs/{clubId}/status?status=ACTIVE|INACTIVE → ApiResponse<String>
  const toggleStatus = async (clubId, currentStatus) => {
    const next = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await fetch(`${API_BASE_URL}/api/admin/clubs/${clubId}/status?status=${next}`, {
        method: "PUT",
        credentials: "include",
      });
      loadClubs();
    } catch {
      console.error("Status update failed");
    }
  };

  const filtered = clubs.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = clubs.filter(c => c.status === "ACTIVE").length;

  return (
    <div className="clubs-page">

      {/* Header */}
      <div className="clubs-header">
        <div>
          <button className="back-link" onClick={() => navigate("/admin")}>← Dashboard</button>
          <h1>Club Management</h1>
          <p>
            <span className="stat-badge green">{activeCount} active</span>
            <span className="stat-badge grey">{clubs.length - activeCount} inactive</span>
          </p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(v => !v); setMsg({ text: "", type: "" }); }}>
          {showForm ? "✕ Cancel" : "＋ New Club"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="create-form-card">
          <h3>Create New Club</h3>
          <div className="form-grid-3">
            <div className="field">
              <label>Club Name *</label>
              <input
                placeholder="e.g. Robotics Club"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Email Address *</label>
              <input
                type="email"
                placeholder="club@college.edu"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Description</label>
              <input
                placeholder="Short description of the club"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>
          {msg.text && <p className={`form-msg ${msg.type}`}>{msg.text}</p>}
          <button className="btn-create" onClick={createClub} disabled={creating}>
            {creating ? "Creating…" : "Create Club"}
          </button>
        </div>
      )}

      {/* Success banner outside form */}
      {msg.text && !showForm && msg.type === "ok" && (
        <div className="banner-ok">{msg.text}</div>
      )}

      {/* Search */}
      <div className="clubs-toolbar">
        <input
          className="search-input"
          placeholder="🔍  Search clubs by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Club list */}
      {loading ? (
        <div className="loading-state">Loading clubs…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span>🏛️</span>
          <p>{search ? "No clubs match your search." : "No clubs yet — create your first one!"}</p>
        </div>
      ) : (
        <div className="clubs-list">
          {filtered.map(club => (
            <div key={club.id} className={`club-card ${club.status === "INACTIVE" ? "card-inactive" : ""}`}>
              <div className="club-avatar">{club.name.charAt(0).toUpperCase()}</div>
              <div className="club-info">
                <h3>{club.name}</h3>
                <p className="club-email">{club.email}</p>
                {club.description && <p className="club-desc">{club.description}</p>}
                <p className="club-since">Created {club.createdAt?.split("T")[0] ?? "—"}</p>
              </div>
              <div className="club-actions">
                <span className={`status-pill ${club.status === "ACTIVE" ? "pill-green" : "pill-red"}`}>
                  {club.status}
                </span>
                <button className="btn-open" onClick={() => navigate(`/admin/clubs/${club.id}`)}>
                  Open →
                </button>
                <button
                  className={club.status === "ACTIVE" ? "btn-deactivate" : "btn-activate"}
                  onClick={() => toggleStatus(club.id, club.status)}
                >
                  {club.status === "ACTIVE" ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}