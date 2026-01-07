import "../styles/navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo"> BookMySlot</div>
      <div className="nav-links">
        <span>Events</span>
        <span>Signup</span>
      </div>
    </nav>
  );
}