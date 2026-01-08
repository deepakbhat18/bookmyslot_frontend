import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/config";
import "../styles/Auth.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const emailFromState = location.state?.email || "";

  const [email] = useState(emailFromState);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);


  const handleResendOtp = async () => {
    await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setMessage("OTP resent");
    setTimer(60);
    setCanResend(false);
  };

  const handleReset = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        otp,
        newPassword,
      }),
    });

    if (res.ok) {
      setMessage("Password reset successful");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setMessage("Invalid OTP or password");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleReset}>
        <h2>Reset Password</h2>

        <input type="email" value={email} disabled />

        <input
          type="text"
          placeholder="Enter OTP"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button type="submit">Reset Password</button>

        <div className="otp-resend">
          {canResend ? (
            <button type="button" onClick={handleResendOtp}>
              Resend OTP
            </button>
          ) : (
            <p>Resend OTP in {timer}s</p>
          )}
        </div>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}
