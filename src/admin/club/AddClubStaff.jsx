
import { useState } from "react";
import { API_BASE_URL } from "../../api/config";

export default function AddClubStaff({ clubId }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");

  const submit = async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/clubs/staff`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...form, clubId: Number(clubId) })
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div>
      <h3>Add Club Staff</h3>

      <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />

      <button onClick={submit}>Create</button>
      {message && <p>{message}</p>}
    </div>
  );
}
