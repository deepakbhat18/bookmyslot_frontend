import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../../api/config";
import "../../styles/ClubEventAnalytics.css";

export default function ClubEventAnalytics() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/event-analytics/${eventId}`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setEvent(data))
      .catch(err => console.error(err));
  }, [eventId]);

  if (!event) return <p>Loading analytics...</p>;

  return (
    <div className="event-analytics">
      <h2>{event.eventTitle}</h2>
      <p className="club">{event.clubName}</p>

      <div className="stats">
        <div className="card">
          <span>Total Seats</span>
          <h3>{event.totalSeats}</h3>
        </div>

        <div className="card">
          <span>Booked Seats</span>
          <h3>{event.bookedSeats}</h3>
        </div>

        <div className="card">
          <span>Checked In</span>
          <h3>{event.checkedInCount}</h3>
        </div>

        <div className="card">
          <span>Attendance</span>
          <h3>{event.attendancePercentage}%</h3>
        </div>

        <div className="card revenue">
          <span>Revenue</span>
          <h3>₹{event.revenue}</h3>
        </div>
      </div>
    </div>
  );
}
