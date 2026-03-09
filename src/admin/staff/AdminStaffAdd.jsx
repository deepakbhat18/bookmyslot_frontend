
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/config";
import "../../styles/AdminStaff.css";

export default function AdminStaffAdd() {
  const navigate = useNavigate();

  // Club model fields: id, name, email, status
  const [clubs, setClubs] = useState([]);

  // ClubStaffCreateRequest: name, email, password, clubId(Long)
  const [form, setForm] = useState({ name: "", email: "", password: "", clubId: "" });
  const [msg,  setMsg]  = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  // GET /api/admin/clubs → raw List<Club>
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/clubs`, { credentials: "include" })
      .then(r => r.json())
      .then(d => setClubs(Array.isArray(d) ? d.filter(c => c.status === "ACTIVE") : []))
      .catch(console.error);
  }, []);

  // POST /api/admin/staff → ApiResponse<String>
  // Backend blocks if club already has active staff
  const submit = async () => {
    if (!form.name || !form.email || !form.password || !form.clubId) {
      setMsg({ text: "All fields are required.", type: "error" });
      return;
    }
    setLoading(true);
    setMsg({ text: "", type: "" });
    try {
      const res  = await fetch(`${API_BASE_URL}/api/admin/staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name:     form.name,
          email:    form.email,
          password: form.password,
          clubId:   Number(form.clubId),   // must be Long
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ text: data.message || "Failed to create staff.", type: "error" });
        return;
      }
      setMsg({ text: "✅ Staff created & credentials emailed successfully!", type: "ok" });
      setTimeout(() => navigate("/admin/staff"), 1500);
    } catch {
      setMsg({ text: "Server error.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const set = (f, v) => setForm(prev => ({ ...prev, [f]: v }));

  return (
    <div className="staff-page">
      <div className="staff-header">
        <div>
          <button className="back-link" onClick={() => navigate("/admin/staff")}>← Staff List</button>
          <h1>Add Club Staff</h1>
          <p>Creates a staff account and emails credentials to them. One active staff per club allowed.</p>
        </div>
      </div>

      <div className="staff-form-card">
        <div className="form-grid-2">
          <div className="field">
            <label>Full Name *</label>
            <input
              placeholder="e.g. Rahul Sharma"
              value={form.name}
              onChange={e => set("name", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Email Address *</label>
            <input
              type="email"
              placeholder="staff@college.edu"
              value={form.email}
              onChange={e => set("email", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Temporary Password *</label>
            <input
              type="text"
              placeholder="e.g. Welcome@2026"
              value={form.password}
              onChange={e => set("password", e.target.value)}
            />
            <small className="field-hint">Staff will receive this via email. Advise them to change it after login.</small>
          </div>
          <div className="field">
            <label>Assign to Club *</label>
            <select value={form.clubId} onChange={e => set("clubId", e.target.value)}>
              <option value="">— Select Club —</option>
              {clubs.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <small className="field-hint">Only active clubs with no current staff are shown.</small>
          </div>
        </div>

        {msg.text && (
          <div className={`form-msg ${msg.type}`}>{msg.text}</div>
        )}

        <div className="form-actions">
          <button className="btn-cancel" onClick={() => navigate("/admin/staff")}>
            Cancel
          </button>
          <button className="btn-submit" onClick={submit} disabled={loading}>
            {loading ? "Creating…" : "Create Staff & Send Email"}
          </button>
        </div>
      </div>
    </div>
  );
}