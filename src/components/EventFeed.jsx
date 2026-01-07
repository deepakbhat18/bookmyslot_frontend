import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { API_BASE_URL } from "../api/config";
import "../styles/EventFeed.css";

export default function EventFeed() {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const todayStr = new Date().toLocaleDateString("en-CA");

  useEffect(() => {
  fetch(`${API_BASE_URL}/api/public/events?page=0&size=50`)
    .then(res => res.json())
    .then(data => {
      const newEvents = data.content || [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const filtered = newEvents.filter(e => {
        const eventDate = new Date(e.eventDate);
        return eventDate >= today;
      });

      setEvents(filtered);
    })
    .catch(err => console.error(err));
}, []);


  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        hasMore
      ) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  return (
    <div className="feed-wrapper">
      <h1 className="feed-title">Today & Upcoming Events</h1>

    <div className="feed-container">
  {events.map(event => (
    <EventCard key={event.eventId} event={event} />
  ))}
</div>


      {!hasMore && (
        <p className="end-text">No more upcoming events</p>
      )}
    </div>
  );
}