
import { useEffect, useState } from "react";
import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { API_BASE_URL } from "../../api/config";
import "../../styles/ClubAnalytics.css";

const COLORS = ["#6366f1", "#22c55e", "#f97316", "#ef4444", "#8b5cf6", "#0ea5e9"];

// clubId passed as PROP from ClubDashboard
export default function ClubAnalytics({ clubId }) {
  // GET /api/admin/event-analytics → EventAnalyticsDto[] (raw, no .data wrapper)
  // Fields: eventId, eventTitle, clubName, totalSeats, bookedSeats,
  //         checkedInCount, attendancePercentage, revenue, status
  const [data,     setData]     = useState([]);
  const [loading,  setLoading]  = useState(true);

  // GET /api/admin/event-analytics/{eventId} → single EventAnalyticsDto (raw)
  const [selected, setSelected] = useState(null); // drill-in row
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/event-analytics`, { credentials: "include" })
      .then(r => r.json())
      .then(d => setData(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const loadDetail = (eventId) => {
    if (selected?.eventId === eventId) { setSelected(null); return; }
    setLoadingDetail(true);
    fetch(`${API_BASE_URL}/api/admin/event-analytics/${eventId}`, { credentials: "include" })
      .then(r => r.json())
      .then(setSelected)
      .catch(console.error)
      .finally(() => setLoadingDetail(false));
  };

  // Totals across all events
  const totalRev     = data.reduce((s, e) => s + (e.revenue     || 0), 0);
  const totalBooked  = data.reduce((s, e) => s + (e.bookedSeats || 0), 0);
  const totalChecked = data.reduce((s, e) => s + (e.checkedInCount || 0), 0);
  const avgAttend    = data.length
    ? (data.reduce((s, e) => s + (e.attendancePercentage || 0), 0) / data.length).toFixed(1)
    : 0;

  if (loading) return <div className="loading-inline">Loading analytics…</div>;

  return (
    <div className="ana-panel">

      {/* KPI strip */}
      <div className="ana-kpis">
        {[
          { icon: "🎪", label: "Events",       val: data.length           },
          { icon: "🎟️", label: "Total Booked", val: totalBooked           },
          { icon: "✅", label: "Checked In",   val: totalChecked          },
          { icon: "📈", label: "Avg Attend.",  val: `${avgAttend}%`       },
          { icon: "💰", label: "Revenue",      val: `₹${totalRev.toFixed(0)}` },
        ].map(k => (
          <div key={k.label} className="ana-kpi-item">
            <span>{k.icon}</span>
            <div>
              <p>{k.label}</p>
              <h3>{k.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 ? (
        <div className="empty-inline">No event data available yet.</div>
      ) : (
        <>
          {/* Charts */}
          <div className="ana-charts">

            <div className="ana-chart-card">
              <h4>Booked vs Checked-In</h4>
              <ResponsiveContainer width="250%" height={230}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="eventTitle" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" interval={0} height={50} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bookedSeats"   name="Booked"     fill="#6366f1" radius={[5,5,0,0]} />
                  <Bar dataKey="checkedInCount" name="Checked In" fill="#22c55e" radius={[5,5,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
{/* 
            <div className="ana-chart-card">
              <h4>Revenue per Event (₹)</h4>
              <ResponsiveContainer width="200%" height={230}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="eventTitle" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" interval={0} height={50} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={v => `₹${v}`} />
                  <Bar dataKey="revenue" fill="#f97316" radius={[50,50,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div> */}
{/* 
            <div className="ana-chart-card">
              <h4>Booking Share</h4>
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie data={data} dataKey="bookedSeats" nameKey="eventTitle"
                    innerRadius={60} outerRadius={90} paddingAngle={4}>
                    {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" iconSize={10} />
                </PieChart>
              </ResponsiveContainer>
            </div> */}

            <div className="ana-chart-card wide">
              <h4>Attendance % Trend</h4>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="eventTitle" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" interval={0} height={50} />
                  <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                  <Tooltip formatter={v => `${Number(v).toFixed(1)}%`} />
                  <Area type="monotone" dataKey="attendancePercentage" name="Attendance"
                    stroke="#6366f1" strokeWidth={2} fill="rgba(99,102,241,.15)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

          </div>

          {/* Per-event breakdown table */}
          <h4 className="tbl-heading">Event Breakdown — click Details for drill-in</h4>
          <div className="ana-table-wrap">
            <table className="ana-tbl">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Club</th>
                  <th>Status</th>
                  <th>Total Seats</th>
                  <th>Booked</th>
                  <th>Checked In</th>
                  <th>Attendance</th>
                  <th>Revenue</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.map(e => (
                  <>
                    <tr key={e.eventId} className="tbl-row">
                      <td><strong>{e.eventTitle}</strong></td>
                      <td>{e.clubName}</td>
                      <td>
                        <span className={`spill spill-${e.status?.toLowerCase()}`}>
                          {e.status}
                        </span>
                      </td>
                      <td>{e.totalSeats}</td>
                      <td>{e.bookedSeats}</td>
                      <td>{e.checkedInCount}</td>
                      <td>
                        <div className="mini-bar">
                          <div className="mini-fill" style={{ width: `${Math.min(e.attendancePercentage || 0, 100)}%` }} />
                        </div>
                        <small>{(e.attendancePercentage || 0).toFixed(1)}%</small>
                      </td>
                      <td className="rev-td">₹{(e.revenue || 0).toFixed(0)}</td>
                      <td>
                        <button
                          className={`btn-detail ${selected?.eventId === e.eventId ? "active" : ""}`}
                          onClick={() => loadDetail(e.eventId)}
                        >
                          {selected?.eventId === e.eventId ? "Close" : "Details"}
                        </button>
                      </td>
                    </tr>

                    {/* Inline detail expansion */}
                    {selected?.eventId === e.eventId && (
                      <tr key={`detail-${e.eventId}`} className="detail-expand">
                        <td colSpan={9}>
                          {loadingDetail
                            ? <p className="loading-inline">Loading details…</p>
                            : (
                              <div className="detail-box">
                                <strong>{selected.eventTitle}</strong>
                                {" — "}{selected.clubName}
                                {" · "}
                                <span className={`spill spill-${selected.status?.toLowerCase()}`}>{selected.status}</span>
                                <div className="detail-stats">
                                  <span>🪑 Total Seats: <b>{selected.totalSeats}</b></span>
                                  <span>🎟️ Booked: <b>{selected.bookedSeats}</b></span>
                                  <span>✅ Checked In: <b>{selected.checkedInCount}</b></span>
                                  <span>📈 Attendance: <b>{(selected.attendancePercentage || 0).toFixed(1)}%</b></span>
                                  <span>💰 Revenue: <b>₹{(selected.revenue || 0).toFixed(0)}</b></span>
                                </div>
                              </div>
                            )}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}