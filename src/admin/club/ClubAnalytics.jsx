import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../api/config";
import "../../styles/ClubAnalytics.css";

export default function ClubAnalytics() {
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/event-analytics`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(err => console.error(err));
  }, []);

  const totalRevenue = analytics.reduce((sum, e) => sum + e.revenue, 0);
  const totalBookings = analytics.reduce((sum, e) => sum + e.bookedSeats, 0);

  return (
    <div className="analytics-page">
      <h2>📊 Club Event Analytics</h2>

     
      <div className="kpi-grid">
        <div className="kpi-card">
          <span>Total Events</span>
          <h3>{analytics.length}</h3>
        </div>

        <div className="kpi-card">
          <span>Total Bookings</span>
          <h3>{totalBookings}</h3>
        </div>

        <div className="kpi-card revenue">
          <span>Total Revenue</span>
          <h3>₹{totalRevenue}</h3>
        </div>
      </div>

   
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Event</th>
              <th>Club</th>
              <th>Booked</th>
              <th>Attendance</th>
              <th>Revenue</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {analytics.map(event => (
              <tr key={event.eventId}>
                <td>{event.eventTitle}</td>
                <td>{event.clubName}</td>
                <td>{event.bookedSeats}</td>
                <td>{event.attendancePercentage}%</td>
                <td>₹{event.revenue}</td>
                <td>
                  <span className={`status ${event.status.toLowerCase()}`}>
                    {event.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {analytics.length === 0 && (
          <p className="empty">No analytics data available</p>
        )}
      </div>
    </div>
  );
}
