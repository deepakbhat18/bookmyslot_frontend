// import { API_BASE_URL } from "../api/config";
// import "../styles/EventCard.css";

// export default function EventCard({ event }) {
//   const imageUrl = event.posterUrl
//     ? `${API_BASE_URL}${event.posterUrl}`
//     : "/placeholder-event.jpg";

//   const today = new Date();
//   const eventDate = new Date(event.eventDate);
//   const isToday =
//     eventDate.toDateString() === today.toDateString();
// const handleBook = () => {
//   fetch(`${API_BASE_URL}/api/auth/me`, {
//     credentials: "include"
//   })
//     .then(res => {
//       if (res.status === 401) {
//         window.location.href = "/login";
//       } else {
//         window.location.href = `/events/${event.eventId}`;
//       }
//     });
// };

//   return (
//     <div className="event-card">
//       <div className="event-image-wrapper">
//         <img src={imageUrl} alt={event.title} />
//         {isToday && <span className="today-badge">TODAY</span>}
//       </div>

//       <div className="event-content">
//         <h3>{event.title}</h3>
//         <p className="event-desc">{event.description}</p>

//         <div className="event-footer">
//           <span className="event-date">
//             {eventDate.toDateString()}
//           </span>
//           <span className="event-location">
//             📍 {event.location}
//           </span>
//         </div>
//         <button className="book-btn">Book Now</button>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import AuthModal from "./AuthModal";
import { API_BASE_URL } from "../api/config";
import "../styles/EventCard.css";

export default function EventCard({ event }) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleBook = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/events/bookings/book`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.eventId }),
      });

      if (res.status === 401) {
        setShowAuthModal(true);
        return;
      }

      if (!res.ok) {
        alert("Booking failed");
        return;
      }

      alert("Booking successful!");
    } catch (err) {
      console.error(err);
    }
  };

  const imageUrl = event.posterUrl
    ? `${API_BASE_URL}${event.posterUrl}`
    : "/placeholder-event.jpg";

  // Check if event is today (for badge)
  const isToday = new Date(event.eventDate).toDateString() === new Date().toDateString();

  return (
    <>
      <div className="event-card">
        <div className="event-image-wrapper">
          <img src={imageUrl} alt={event.title} />
          {isToday && <span className="today-badge">Today</span>}
        </div>

        <div className="event-content">
          <h3>{event.title}</h3>
          <p className="event-desc">{event.description}</p>
          
          <div className="event-footer">
            <span>{event.eventDate}</span>
            <span>{event.location}</span>
          </div>

          <button className="book-btn" onClick={handleBook}>
            Book
          </button>
        </div>
      </div>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
}
