// import { API_BASE_URL } from "../api/config";
// import "../styles/navbar.css";

// export default function Navbar() {
//    const handleLogout = async () => {
//     await fetch(`${API_BASE_URL}/api/auth/logout`, {
//       method: "POST",
//       credentials: "include",
//     });

//     window.location.href = "/login";
//   };
//   return (
//     <nav className="navbar">
//       <h2 className="logo">BookMySlot 🎯</h2>

//  <div className="nav-links">
//   <a href="/">Events</a>
//   <a href="/login">Login</a>
//   <a className="signup-btn" href="/register">Sign Up</a>
//   <a className="logout-btn" href="/logout" onClick={handleLogout}>Logout</a>
// </div>
//     </nav>
//   );
// }


import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../api/config";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = sessionStorage.getItem("ROLE");
  const userId = sessionStorage.getItem("USER_ID");

  const handleLogout = async () => {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    sessionStorage.clear();
    navigate("/login");
  };

  const isActive = (path) => location.pathname.startsWith(path) ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      <span className="logo" onClick={() => navigate("/")}>BookMySlot 🎯</span>

      <div className="nav-links">
        {/* Not logged in */}
        {!userId && (
          <>
            <span className={isActive("/")} onClick={() => navigate("/")}>Events</span>
            <span className="nav-link" onClick={() => navigate("/login")}>Login</span>
            <span className="nav-btn" onClick={() => navigate("/register")}>Sign Up</span>
          </>
        )}

        {/* ADMIN */}
        {role === "ADMIN" && (
          <>
            <span className={isActive("/admin/clubs")} onClick={() => navigate("/admin/clubs")}>Clubs</span>
            <span className={isActive("/admin/staff")} onClick={() => navigate("/admin/staff")}>Staff</span>
            <span className={isActive("/admin")} onClick={() => navigate("/admin")}>Dashboard</span>
          </>
        )}

        {/* CLUB STAFF */}
        {role === "CLUB" && (
          <>
            <span className={isActive("/staff/events")} onClick={() => navigate("/staff/events")}>Events</span>
            <span className={isActive("/staff/checkin")} onClick={() => navigate("/staff/checkin")}>Check-In</span>
            <span className={isActive("/staff")} onClick={() => navigate("/staff")}>Dashboard</span>
          </>
        )}

        {/* STUDENT */}
        {role === "STUDENT" && (
          <>
            <span className={isActive("/student/events")} onClick={() => navigate("/student/events")}>Events</span>
            <span className={isActive("/student/my-bookings")} onClick={() => navigate("/student/my-bookings")}>My Tickets</span>
            <span className={isActive("/student/book-slot")} onClick={() => navigate("/student/book-slot")}>Book Slot</span>
            <span className={isActive("/student/my-slots")} onClick={() => navigate("/student/my-slots")}>My Slots</span>
          </>
        )}

        {/* TEACHER */}
        {role === "TEACHER" && (
          <>
            <span className={isActive("/teacher/create-slot")} onClick={() => navigate("/teacher/create-slot")}>Create Slot</span>
            <span className={isActive("/teacher/bookings")} onClick={() => navigate("/teacher/bookings")}>Bookings</span>
            <span className={isActive("/teacher/calendar")} onClick={() => navigate("/teacher/calendar")}>Calendar</span>
          </>
        )}

        {userId && (
          <span className="nav-logout" onClick={handleLogout}>Logout</span>
        )}
      </div>
    </nav>
  );
}