// import { useEffect, useState } from "react";
// import { API_BASE_URL } from "../../api/config";

// export default function ClubAnalytics() {
//   const [analytics, setAnalytics] = useState([]);

//   useEffect(() => {
//     fetch(`${API_BASE_URL}/api/admin/event-analytics`, {
//       credentials: "include"
//     })
//       .then(res => res.json())
//       .then(data => setAnalytics(data))
//       .catch(err => console.error(err));
//   }, []);

//   return (
//     <div>
//       <h3>Event Analytics</h3>

//       <table>
//         <thead>
//           <tr>
//             <th>Event</th>
//             <th>Booked</th>
//             <th>Attendance</th>
//             <th>Revenue</th>
//             <th>Status</th>
//           </tr>
//         </thead>

//         <tbody>
//           {analytics.map(a => (
//             <tr key={a.eventId}>
//               <td>{a.eventTitle}</td>
//               <td>{a.bookedSeats}</td>
//               <td>{a.attendancePercentage}%</td>
//               <td>₹{a.revenue}</td>
//               <td>{a.status}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../api/config";

export default function ClubAnalytics() {
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/event-analytics`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setAnalytics(data));
  }, []);

  return (
    <div>
      <h3>Event Analytics</h3>

      <table>
        <thead>
          <tr>
            <th>Event</th>
            <th>Booked</th>
            <th>Attendance</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {analytics.map(a => (
            <tr key={a.eventId}>
              <td>{a.eventTitle}</td>
              <td>{a.bookedSeats}</td>
              <td>{a.attendancePercentage}%</td>
              <td>₹{a.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
