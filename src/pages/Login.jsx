


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/config";
import "../styles/Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      // LoginResponse: { userId, name, email, role, usn, clubId }
      const { userId, role, clubId } = data.data;
      sessionStorage.setItem("USER_ID", userId);
      sessionStorage.setItem("ROLE", role);
      if (clubId) sessionStorage.setItem("CLUB_ID", clubId);

      if (role === "ADMIN")    navigate("/admin");
      else if (role === "CLUB")    navigate("/staff");
      else if (role === "STUDENT") navigate("/student");
      else if (role === "TEACHER") navigate("/teacher");
      else navigate("/");

    } catch {
      setMessage("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleLogin}>
        <h2>Welcome Back</h2>
        <p className="auth-sub">Sign in to BookMySlot</p>

        <input
          type="email"
          placeholder="Email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>

        {message && <p className="message error">{message}</p>}

        <div className="auth-links">
          <span onClick={() => navigate("/forgot-password")}>Forgot Password?</span>
        </div>

        <p className="switch-auth">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </form>
    </div>
  );
}