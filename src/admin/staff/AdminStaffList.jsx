
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/config";
import "../../styles/AdminStaff.css";

export default function AdminStaffList() {
  const navigate = useNavigate();

  // GET /api/admin/staff → AdminStaffResponse[]
  // Fields: id, name, email, clubName, active(boolean)
  const [staff,   setStaff]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("ALL");   // ALL | ACTIVE | INACTIVE
  const [search,  setSearch]  = useState("");
  const [msg,     setMsg]     = useState("");

  const loadStaff = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/admin/staff`, { credentials: "include" })
      .then(r => r.json())
      .then(d => setStaff(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(loadStaff, []);

  // PUT /api/admin/staff/{staffId}/deactivate → ApiResponse<String>
  const deactivate = async (id, name) => {
    if (!window.confirm(`Deactivate ${name}? They will lose access immediately.`)) return;
    setMsg("");
    const res  = await fetch(`${API_BASE_URL}/api/admin/staff/${id}/deactivate`, {
      method: "PUT", credentials: "include",
    });
    const data = await res.json();
    setMsg(res.ok ? `${name} has been deactivated.` : data.message || "Failed.");
    loadStaff();
  };

  const activeCount   = staff.filter(s =>  s.active).length;
  const inactiveCount = staff.filter(s => !s.active).length;

  const displayed = staff.filter(s => {
    const matchFilter =
      filter === "ALL"      ? true :
      filter === "ACTIVE"   ? s.active :
      !s.active;
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.clubName.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="staff-page">

      {/* Header */}
      <div className="staff-header">
        <div>
          <button className="back-link" onClick={() => navigate("/admin")}>← Dashboard</button>
          <h1>Club Staff</h1>
          <p>
            <span className="stat-badge green">{activeCount} active</span>
            <span className="stat-badge grey">{inactiveCount} inactive</span>
          </p>
        </div>
        <button className="btn-primary" onClick={() => navigate("/admin/staff/add")}>
          ＋ Add Staff
        </button>
      </div>

      {msg && <div className="staff-banner">{msg}</div>}

      {/* Toolbar */}
      <div className="staff-toolbar">
        <div className="filter-tabs">
          {["ALL", "ACTIVE", "INACTIVE"].map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          className="search-input"
          placeholder="🔍  Search by name, email or club…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading-state">Loading staff…</div>
      ) : displayed.length === 0 ? (
        <div className="empty-state"><span>👥</span><p>No staff found.</p></div>
      ) : (
        <div className="staff-table-wrap">
          <table className="staff-tbl">
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
              {displayed.map(s => (
                <tr key={s.id} className={!s.active ? "row-dim" : ""}>
                  <td>
                    <div className="staff-name-cell">
                      <div className="staff-avatar">{s.name.charAt(0).toUpperCase()}</div>
                      <span>{s.name}</span>
                    </div>
                  </td>
                  <td className="muted-cell">{s.email}</td>
                  <td>{s.clubName}</td>
                  <td>
                    <span className={`status-pill ${s.active ? "pill-green" : "pill-red"}`}>
                      {s.active ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                  <td>
                    <div className="row-btns">
                      <button className="btn-view" onClick={() => navigate(`/admin/staff/${s.id}`)}>
                        View
                      </button>
                      {s.active && (
                        <button className="btn-deactivate" onClick={() => deactivate(s.id, s.name)}>
                          Deactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}