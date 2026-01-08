import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/config";
import "../styles/Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
  
      navigate("/reset-password", {
        state: { email },
      });
    } else {
      setMessage("Email not found");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSendOtp}>
        <h2>Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Send OTP</button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}
