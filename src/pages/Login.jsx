import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/config";
import "../styles/Auth.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 🔴 REQUIRED for session
        body: JSON.stringify({ email, password }),
      });

const data = await res.json();

sessionStorage.setItem("USER_ID", data.data.userId);
sessionStorage.setItem("ROLE", data.data.role);

if (data.data.role === "ADMIN") {
  navigate("/admin");
} else if (data.data.role === "CLUB") {
  navigate("/staff");
} else {
  navigate("/");
}

    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleLogin}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
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

        <button type="submit">Login</button>

        {message && <p className="message error">{message}</p>}

        <div className="auth-links">
          <span onClick={() => navigate("/forgot-password")}>
            Forgot Password?
          </span>
          <span onClick={() => navigate("/reset-password")}>
            Reset Password
          </span>
        </div>

        <p className="switch-auth">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </form>
    </div>
  );
}
