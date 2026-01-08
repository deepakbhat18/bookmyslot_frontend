import { API_BASE_URL } from "../api/config";
import "../styles/navbar.css";

export default function Navbar() {
   const handleLogout = async () => {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    window.location.href = "/login";
  };
  return (
    <nav className="navbar">
      <h2 className="logo">BookMySlot 🎯</h2>

 <div className="nav-links">
  <a href="/">Events</a>
  <a href="/login">Login</a>
  <a className="signup-btn" href="/register">Sign Up</a>
  <a className="logout-btn" href="/logout" onClick={handleLogout}>Logout</a>
</div>
    </nav>
  );
}


