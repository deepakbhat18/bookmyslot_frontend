import { useParams } from "react-router-dom";
import { useState } from "react";
import { API_BASE_URL } from "../api/config";
import "../styles/Staff.css";

export default function EditEvent() {
  const { eventId } = useParams();

  const [form, setForm] = useState({
    title: "",
    description: "",
    venue: "",
    startTime: "",
    endTime: "",
    paid: false,
    price: 0,
    maxSeats: 0
  });

  const submit = async () => {
    await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form)
    });

    alert("Event updated");
  };

  return (
    <div className="staff-card">
      <h2>Edit Event</h2>

      <input placeholder="Title" onChange={e => setForm({ ...form, title: e.target.value })} />
      <textarea placeholder="Description" onChange={e => setForm({ ...form, description: e.target.value })} />
      <input placeholder="Venue" onChange={e => setForm({ ...form, venue: e.target.value })} />
      <input type="time" onChange={e => setForm({ ...form, startTime: e.target.value })} />
      <input type="time" onChange={e => setForm({ ...form, endTime: e.target.value })} />

      <button onClick={submit}>Update</button>
    </div>
  );
}
