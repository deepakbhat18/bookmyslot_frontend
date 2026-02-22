// // import { useState } from "react";
// // import { useParams } from "react-router-dom";
// // import { API_BASE_URL } from "../../api/config";
// // import "../../styles/AdminClubs.css";

// // export default function AddClubStaff() {
// //   const { clubId } = useParams();

// //   const [form, setForm] = useState({
// //     name: "",
// //     email: "",
// //     password: ""
// //   });

// //   const [message, setMessage] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   const submit = async () => {
// //     setMessage("");

// //     if (!clubId) {
// //       setMessage("Club ID missing");
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       const res = await fetch(`${API_BASE_URL}/api/admin/clubs/staff`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         credentials: "include",
// //         body: JSON.stringify({
// //           name: form.name,
// //           email: form.email,
// //           password: form.password,
// //           clubId: Number(clubId) // ✅ GUARANTEED NUMBER
// //         })
// //       });

// //       const data = await res.json();

// //       if (!res.ok) {
// //         setMessage(data.message || "Failed to create staff");
// //         return;
// //       }

// //       setMessage("✅ Club staff created successfully");
// //       setForm({ name: "", email: "", password: "" });

// //     } catch (err) {
// //       setMessage("Server error");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="admin-clubs">
// //       <h2>Add Club Staff</h2>

// //       <input
// //         placeholder="Name"
// //         value={form.name}
// //         onChange={e => setForm({ ...form, name: e.target.value })}
// //       />

// //       <input
// //         placeholder="Email"
// //         value={form.email}
// //         onChange={e => setForm({ ...form, email: e.target.value })}
// //       />

// //       <input
// //         type="password"
// //         placeholder="Password"
// //         value={form.password}
// //         onChange={e => setForm({ ...form, password: e.target.value })}
// //       />

// //       <button onClick={submit} disabled={loading}>
// //         {loading ? "Creating..." : "Create Staff"}
// //       </button>

// //       {message && <p>{message}</p>}
// //     </div>
// //   );
// // }
// import { useState } from "react";
// import { useParams } from "react-router-dom";
// import { API_BASE_URL } from "../../api/config";
// import "../../styles/AdminClubs.css";

// export default function AddClubStaff() {
//   const { clubId } = useParams();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: ""
//   });

//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const submit = async () => {
//     setMessage("");

//     if (!clubId) {
//       setMessage("Club ID missing");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await fetch(
//         `${API_BASE_URL}/api/admin/clubs/staff`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             name: form.name,
//             email: form.email,
//             password: form.password,
//             clubId: Number(clubId)
//           })
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         setMessage(data.message || "Failed to create staff");
//         return;
//       }

//       setMessage("✅ Club staff created successfully");
//       setForm({ name: "", email: "", password: "" });

//     } catch (err) {
//       setMessage("Server error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="admin-clubs">
//       <h2>Add Club Staff</h2>

//       <input
//         placeholder="Name"
//         value={form.name}
//         onChange={e => setForm({ ...form, name: e.target.value })}
//       />

//       <input
//         placeholder="Email"
//         value={form.email}
//         onChange={e => setForm({ ...form, email: e.target.value })}
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         value={form.password}
//         onChange={e => setForm({ ...form, password: e.target.value })}
//       />

//       <button onClick={submit} disabled={loading}>
//         {loading ? "Creating..." : "Create Staff"}
//       </button>

//       {message && <p>{message}</p>}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/config";
import "../../styles/AdminStaff.css";

export default function AdminStaffAdd() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    clubId: ""
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/clubs`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(setClubs);
  }, []);

  const submit = async () => {
    setMessage("");

    const res = await fetch(`${API_BASE_URL}/api/admin/staff`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...form,
        clubId: Number(form.clubId)
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Failed");
      return;
    }

    alert("Staff created & email sent");
    navigate("/admin/staff");
  };

  return (
    <div className="admin-staff-form">
      <h2>Add / Replace Club Staff</h2>

      <input
        placeholder="Name"
        onChange={e => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Email"
        onChange={e => setForm({ ...form, email: e.target.value })}
      />

      <input
        placeholder="Temporary Password"
        onChange={e => setForm({ ...form, password: e.target.value })}
      />

      <select onChange={e => setForm({ ...form, clubId: e.target.value })}>
        <option value="">Select Club</option>
        {clubs.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <button onClick={submit}>Create Staff</button>

      {message && <p className="error">{message}</p>}
    </div>
  );
}
