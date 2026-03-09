

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { API_BASE_URL } from "../../api/config";
import "../../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // GET /api/admin/analytics/overview → raw Map (no .data wrapper)
  // Keys: totalUsers, totalStudents, totalTeachers, totalAdmins, totalSlots, totalBookings
  const [stats, setStats]         = useState(null);

  // GET /api/admin/analytics/daily-bookings?days=7 → DailyCountDto[] (no .data)
  // Fields: date("YYYY-MM-DD"), count
  const [daily, setDaily]         = useState([]);

  // GET /api/admin/analytics/teacher-usage → TeacherUsageDto[] (no .data)
  // Fields: teacherId, teacherName, totalSlots, totalBookings
  const [teachers, setTeachers]   = useState([]);

  // GET /api/admin/event-analytics → EventAnalyticsDto[] (no .data)
  // Fields: eventId, eventTitle, clubName, totalSeats, bookedSeats,
  //         checkedInCount, attendancePercentage, revenue, status
  const [eventAna, setEventAna]   = useState([]);

  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/admin/analytics/overview`,      { credentials: "include" }).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/admin/analytics/daily-bookings?days=7`, { credentials: "include" }).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/admin/analytics/teacher-usage`, { credentials: "include" }).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/admin/event-analytics`,         { credentials: "include" }).then(r => r.json()),
    ])
      .then(([ov, db, tu, ea]) => {
        setStats(ov);
        setDaily(Array.isArray(db) ? db : []);
        setTeachers(Array.isArray(tu) ? tu : []);
        setEventAna(Array.isArray(ea) ? ea : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = eventAna.reduce((s, e) => s + (e.revenue || 0), 0);

  const kpis = stats ? [
    { label: "Total Users",   value: stats.totalUsers,    icon: "👥", cls: "kpi-blue"   },
    { label: "Students",      value: stats.totalStudents, icon: "🎓", cls: "kpi-indigo" },
    { label: "Teachers",      value: stats.totalTeachers, icon: "🧑‍🏫", cls: "kpi-violet" },
    { label: "Slot Bookings", value: stats.totalBookings, icon: "📅", cls: "kpi-green"  },
    { label: "Total Slots",   value: stats.totalSlots,    icon: "🕐", cls: "kpi-amber"  },
    { label: "Total Revenue", value: `₹${totalRevenue.toFixed(0)}`, icon: "💰", cls: "kpi-rose" },
  ] : [];

  const navCards = [
    { icon: "🏛️", label: "Club Management",  sub: "Create clubs, manage status & events",        path: "/admin/clubs" },
    { icon: "👥", label: "Club Staff",        sub: "Add, deactivate and reset staff accounts",    path: "/admin/staff" },
  ];

  return (
    <div className="adm-dash">
      <div className="adm-dash-header">
        <div>
          <h1>Admin Control Panel</h1>
          <p>Platform overview — all numbers are live from the database</p>
        </div>
      </div>

      {/* ── KPI STRIP ── */}
      <div className="adm-kpi-strip">
        {loading
          ? Array(6).fill(0).map((_, i) => <div key={i} className="adm-kpi skeleton" />)
          : kpis.map(k => (
              <div key={k.label} className={`adm-kpi ${k.cls}`}>
                <span className="kpi-icon">{k.icon}</span>
                <div>
                  <p>{k.label}</p>
                  <h2>{k.value ?? "—"}</h2>
                </div>
              </div>
            ))}
      </div>

      {/* ── CHARTS ROW ── */}
      <div className="adm-charts-row">

        {/* Daily bookings (slot) – last 7 days */}
        <div className="adm-chart-card wide">
          <h3>📅 Slot Bookings — Last 7 Days</h3>
          {daily.length === 0
            ? <p className="no-data">No booking data available</p>
            : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={daily}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" name="Bookings"
                    stroke="#6366f1" strokeWidth={2} fill="rgba(99,102,241,.15)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
        </div>

        {/* Teacher usage */}
        <div className="adm-chart-card">
          <h3>🧑‍🏫 Teacher Slot Usage</h3>
          {teachers.length === 0
            ? <p className="no-data">No teacher data</p>
            : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={teachers} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <YAxis dataKey="teacherName" type="category" width={90} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="totalSlots"    name="Slots"    fill="#6366f1" radius={[0,4,4,0]} />
                  <Bar dataKey="totalBookings" name="Bookings" fill="#22c55e" radius={[0,4,4,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
        </div>
      </div>

      {/* ── EVENT ANALYTICS SUMMARY TABLE ── */}
      <div className="adm-section">
        <div className="adm-section-header">
          <h3>🎪 Event Analytics Summary</h3>
          <button className="btn-sm" onClick={() => navigate("/admin/clubs")}>Manage Events →</button>
        </div>
        {eventAna.length === 0
          ? <p className="no-data">No events yet</p>
          : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Club</th>
                    <th>Status</th>
                    <th>Booked / Total</th>
                    <th>Checked In</th>
                    <th>Attendance</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {eventAna.map(e => (
                    <tr key={e.eventId}>
                      <td><strong>{e.eventTitle}</strong></td>
                      <td>{e.clubName}</td>
                      <td><span className={`pill pill-${e.status?.toLowerCase()}`}>{e.status}</span></td>
                      <td>{e.bookedSeats} / {e.totalSeats}</td>
                      <td>{e.checkedInCount}</td>
                      <td>
                        <div className="prog-bar">
                          <div className="prog-fill" style={{ width: `${Math.min(e.attendancePercentage || 0, 100)}%` }} />
                        </div>
                        <small>{(e.attendancePercentage || 0).toFixed(1)}%</small>
                      </td>
                      <td className="rev-cell">₹{(e.revenue || 0).toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {/* ── NAV CARDS ── */}
      <div className="adm-nav-grid">
        {navCards.map(c => (
          <div key={c.label} className="adm-nav-card" onClick={() => navigate(c.path)}>
            <span className="nav-icon">{c.icon}</span>
            <div>
              <h3>{c.label}</h3>
              <p>{c.sub}</p>
            </div>
            <span className="nav-arrow">→</span>
          </div>
        ))}
      </div>
    </div>
  );
}