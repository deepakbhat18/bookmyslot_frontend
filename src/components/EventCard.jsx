import { API_BASE_URL } from "../api/config";
import "../styles/EventCard.css";

export default function EventCard({ event }) {
  const imageUrl = event.posterUrl
    ? `${API_BASE_URL}${event.posterUrl}`
    : "/placeholder-event.jpg";

  const today = new Date();
  const eventDate = new Date(event.eventDate);
  const isToday =
    eventDate.toDateString() === today.toDateString();

  return (
    <div className="event-card">
      <div className="event-image-wrapper">
        <img src={imageUrl} alt={event.title} />
        {isToday && <span className="today-badge">TODAY</span>}
      </div>

      <div className="event-content">
        <h3>{event.title}</h3>
        <p className="event-desc">{event.description}</p>

        <div className="event-footer">
          <span className="event-date">
            {eventDate.toDateString()}
          </span>
          <span className="event-location">
            📍 {event.location}
          </span>
        </div>

        <button className="book-btn">Book Now</button>
      </div>
    </div>
  );
}
