import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

import { API_BASE_URL } from "../../api/config";
import "../../styles/ClubAnalytics.css";

export default function ClubAnalytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/event-analytics`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const totalRevenue = data.reduce((s, e) => s + (e.revenue || 0), 0);
  const totalBookings = data.reduce((s, e) => s + (e.bookedSeats || 0), 0);
  const avgAttendance =
    data.length === 0
      ? 0
      : Math.round(
          data.reduce((s, e) => s + (e.attendancePercentage || 0), 0) /
            data.length
        );

  return (
    <div className="club-analytics">
      <h2>📊 Club Analytics</h2>

 
      <div className="kpi-grid">
        <div className="kpi">
          <span>Total Events</span>
          <h2>{data.length}</h2>
        </div>

        <div className="kpi">
          <span>Total Bookings</span>
          <h2>{totalBookings}</h2>
        </div>

        <div className="kpi">
          <span>Total Revenue</span>
          <h2>₹{totalRevenue}</h2>
        </div>

        <div className="kpi">
          <span>Avg Attendance</span>
          <h2>{avgAttendance}%</h2>
        </div>
      </div>

      <div className="analytics-grid">

        <div className="card">
          <h3>🎟 Bookings Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                dataKey="bookedSeats"
                nameKey="eventTitle"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
              >
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={["#6366f1", "#22c55e", "#f97316", "#ef4444"][i % 4]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>💰 Revenue</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data}>
              <XAxis dataKey="eventTitle" hide />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="revenue"
                fill="#22c55e"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card wide">
          <h3>📈 Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data}>
              <XAxis dataKey="eventTitle" hide />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="attendancePercentage"
                stroke="#6366f1"
                strokeWidth={3}
                fill="rgba(99,102,241,0.25)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
