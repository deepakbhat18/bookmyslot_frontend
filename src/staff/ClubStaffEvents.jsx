import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/config";
import "../styles/ClubStaffEvents.css";

export default function ClubStaffEvents() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/events?date=2026-01-01`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(setEvents)
      .catch(console.error);
  }, []);

  return (
    <div className="staff-events">
      <h2>Your Events</h2>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Venue</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {events.map(e => (
            <tr key={e.eventId}>
              <td>{e.title}</td>
              <td>{e.eventDate}</td>
              <td>{e.venue}</td>
              <td>
                <button
                  onClick={() =>
                    navigate(`/staff/events/${e.eventId}/edit`)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    navigate(`/staff/events/${e.eventId}/poster`)
                  }
                >
                  Upload Poster
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
