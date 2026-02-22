import { useState } from "react";
import { API_BASE_URL } from "../api/config";
import "../styles/Staff.css";

export default function CreateEvent() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    venue: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    paid: false,
    price: 0,
    maxSeats: 0
  });

  const submit = async () => {
    const res = await fetch(`${API_BASE_URL}/api/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form)
    });

    if (!res.ok) {
      alert("Failed to create event");
      return;
    }

    alert("Event created. Pending admin approval.");
  };

  return (
    <div className="staff-card">
      <h2>Create Event</h2>

      <input placeholder="Title" onChange={e => setForm({ ...form, title: e.target.value })} />
      <textarea placeholder="Description" onChange={e => setForm({ ...form, description: e.target.value })} />
      <input placeholder="Venue" onChange={e => setForm({ ...form, venue: e.target.value })} />

      <input type="date" onChange={e => setForm({ ...form, eventDate: e.target.value })} />
      <input type="time" onChange={e => setForm({ ...form, startTime: e.target.value })} />
      <input type="time" onChange={e => setForm({ ...form, endTime: e.target.value })} />

      <label>
        <input type="checkbox" onChange={e => setForm({ ...form, paid: e.target.checked })} />
        Paid Event
      </label>

      {form.paid && (
        <input type="number" placeholder="Price" onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
      )}

      <input type="number" placeholder="Max Seats" onChange={e => setForm({ ...form, maxSeats: Number(e.target.value) })} />

      <button onClick={submit}>Create</button>
    </div>
  );
}
