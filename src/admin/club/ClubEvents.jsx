import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../../api/config";
import "../../styles/ClubEvents.css";
export default function ClubEvents() {
  const { clubId } = useParams();

  const [events, setEvents] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [message, setMessage] = useState("");


  const fetchClubEvents = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/clubs/${clubId}/events`,
        { credentials: "include" }
      );
      const data = await res.json();
      setEvents(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPendingEvents = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/events/pending`,
        { credentials: "include" }
      );
      const data = await res.json();
      setPendingEvents(data || []);
    } catch (err) {
      setMessage("Failed to load pending events");
    }
  };

  useEffect(() => {
    fetchClubEvents();
    fetchPendingEvents();
  }, [clubId]);

  const approveEvent = async (eventId) => {
    await fetch(
      `${API_BASE_URL}/api/admin/events/${eventId}/approve`,
      {
        method: "PUT",
        credentials: "include",
      }
    );
    fetchPendingEvents();
    fetchClubEvents();
  };

  const rejectEvent = async (eventId) => {
    await fetch(
      `${API_BASE_URL}/api/admin/events/${eventId}/reject`,
      {
        method: "PUT",
        credentials: "include",
      }
    );
    fetchPendingEvents();
  };

  return (
    <div className="admin-clubs">
      <h2>Club Events</h2>

      <h3>Published Events</h3>

      {events.length === 0 && <p>No events yet</p>}

      {events.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Venue</th>
              <th>Paid</th>
              <th>Seats</th>
            </tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e.eventId}>
                <td>{e.title}</td>
                <td>{e.eventDate}</td>
                <td>{e.venue}</td>
                <td>{e.paid ? "Yes" : "No"}</td>
                <td>{e.availableSeats}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3 style={{ marginTop: "40px" }}>Pending Events</h3>

      {message && <p style={{ color: "red" }}>{message}</p>}

      {pendingEvents.length === 0 && <p>No pending events 🎉</p>}

      {pendingEvents.length > 0 && (
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
            {pendingEvents.map(e => (
              <tr key={e.eventId}>
                <td>{e.title}</td>
                <td>{e.eventDate}</td>
                <td>{e.venue}</td>
                <td>
                  <button
                    style={{ marginRight: "10px", background: "green", color: "white" }}
                    onClick={() => approveEvent(e.eventId)}
                  >
                    Approve
                  </button>

                  <button
                    style={{ background: "red", color: "white" }}
                    onClick={() => rejectEvent(e.eventId)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
