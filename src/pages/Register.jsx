import { useState } from "react";
import { API_BASE_URL } from "../api/config";
import "../styles/Register.css";

export default function Register() {
  const [step, setStep] = useState("REGISTER");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    usn: "",
    password: "",
    role: "STUDENT",
    clubId: ""
  });

  const [otp, setOtp] = useState("");

  const handleRegister = async () => {
    setMessage("");

    if (!form.name || !form.email || !form.password) {
      setMessage("All required fields must be filled");
      return;
    }

    if (form.role === "STUDENT" && !form.usn) {
      setMessage("USN is required for students");
      return;
    }

    if (form.role === "CLUB" && !form.clubId) {
      setMessage("Club ID is required for club staff");
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role
    };

    if (form.role === "STUDENT") payload.usn = form.usn;
    if (form.role === "CLUB") payload.clubId = Number(form.clubId);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Registration failed");
        return;
      }

      setMessage("OTP sent to email 📩");
      setStep("OTP");

    } catch {
      setMessage("Server error during registration");
    }
  };

  const handleVerifyOtp = async () => {
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          otp: otp.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "OTP verification failed");
        return;
      }

      setMessage("Email verified successfully 🎉 You can login now");

    } catch {
      setMessage("Server error during OTP verification");
    }
  };

  const resendOtp = async () => {
    await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email })
    });

    setMessage("OTP resent to email 📩");
  };
  return (
    <div className="register-container">
      <div className="register-card">

        <h2>{step === "REGISTER" ? "Register" : "Verify OTP"}</h2>

        {step === "REGISTER" && (
          <>
            <input
              placeholder="Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />

            <input
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />

            {form.role === "STUDENT" && (
              <input
                placeholder="USN"
                value={form.usn}
                onChange={e => setForm({ ...form, usn: e.target.value })}
              />
            )}

            {form.role === "CLUB" && (
              <input
                placeholder="Club ID"
                value={form.clubId}
                onChange={e => setForm({ ...form, clubId: e.target.value })}
              />
            )}

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />

            <select
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
            >
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
              <option value="CLUB">Club Staff</option>
            </select>

            <button onClick={handleRegister}>Register</button>
          </>
        )}

        {step === "OTP" && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />

            <button onClick={handleVerifyOtp}>Verify OTP</button>
            <button onClick={resendOtp} className="link-btn">
              Resend OTP
            </button>
          </>
        )}

        {message && <p className="message">{message}</p>}

      </div>
    </div>
  );
}
