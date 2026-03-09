import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, ResponsiveContainer,
} from "recharts";
import { API_BASE_URL } from "../../api/config";
import "../../styles/AdminSlotAnalytics.css";

export default function AdminSlotAnalytics() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [daily, setDaily] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/admin/analytics/overview`, { credentials: "include" }).then((r) => r.json()),
      fetch(`${API_BASE_URL}/api/admin/analytics/daily-bookings?days=14`, { credentials: "include" }).then((r) => r.json()),
      fetch(`${API_BASE_URL}/api/admin/analytics/teacher-usage`, { credentials: "include" }).then((r) => r.json()),
    ])
      .then(([ov, dl, tc]) => { setOverview(ov); setDaily(dl); setTeachers(tc); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="slot-analytics-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/admin")}>← Admin Panel</button>
        <h1>Teacher Slot Analytics</h1>
        <p>System-wide usage statistics for teacher meeting slots</p>
      </div>
      {loading && <div className="loading">Loading analytics...</div>}
      {overview && (
        <div className="kpi-grid">
          <div className="kpi-card blue"><span className="kpi-icon">👨‍🎓</span><div><h3>{overview.totalStudents}</h3><p>Students</p></div></div>
          <div className="kpi-card green"><span className="kpi-icon">👨‍🏫</span><div><h3>{overview.totalTeachers}</h3><p>Teachers</p></div></div>
          <div className="kpi-card purple"><span className="kpi-icon">📅</span><div><h3>{overview.totalSlots}</h3><p>Total Slots</p></div></div>
          <div className="kpi-card orange"><span className="kpi-icon">✅</span><div><h3>{overview.totalBookings}</h3><p>Total Bookings</p></div></div>
        </div>
      )}
      {daily.length > 0 && (
        <div className="chart-card">
          <h3>📈 Daily Booking Trend (Last 14 Days)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={daily}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} dot={{ fill: "#6366f1", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {teachers.length > 0 && (
        <div className="chart-card">
          <h3>👨‍🏫 Teacher Usage</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={teachers}>
              <XAxis dataKey="teacherName" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="totalSlots" fill="#6366f1" name="Slots" radius={[6,6,0,0]} />
              <Bar dataKey="totalBookings" fill="#22c55e" name="Bookings" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="teacher-table">
            <table>
              <thead><tr><th>Teacher</th><th>Total Slots</th><th>Total Bookings</th><th>Utilization</th></tr></thead>
              <tbody>
                {teachers.map((t) => (
                  <tr key={t.teacherId}>
                    <td>{t.teacherName}</td>
                    <td>{t.totalSlots}</td>
                    <td>{t.totalBookings}</td>
                    <td>
                      <div className="util-bar-wrap">
                        <div className="util-bar" style={{ width: `${t.totalSlots > 0 ? Math.round((t.totalBookings / t.totalSlots) * 100) : 0}%` }} />
                        <span>{t.totalSlots > 0 ? Math.round((t.totalBookings / t.totalSlots) * 100) : 0}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
