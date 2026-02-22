import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../api/config";

export default function ViewEvent() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/events/${eventId}`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(setEvent);
  }, [eventId]);

  if (!event) return <p>Loading...</p>;

  return (
    <div className="staff-card">
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p><b>Date:</b> {event.eventDate}</p>
      <p><b>Time:</b> {event.startTime} - {event.endTime}</p>
      <p><b>Venue:</b> {event.venue}</p>
      <p><b>Seats:</b> {event.availableSeats}/{event.totalSeats}</p>
    </div>
  );
}
