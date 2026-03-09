import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/config";
import "../styles/StaffCheckIn.css";

export default function StaffCheckIn() {
  const navigate  = useNavigate();
  const staffId   = sessionStorage.getItem("USER_ID");

  const [mode, setMode]         = useState("manual"); // "manual" | "camera"
  const [ticketId, setTicketId] = useState("");
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState("");
  const [camError, setCamError] = useState("");
  const [processing, setProcessing] = useState(false); // scan debounce

  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef    = useRef(null);
  const doneRef   = useRef(false); // prevent double-scan

  /* ── cleanup on unmount ── */
  useEffect(() => () => killCamera(), []);

  /* ── start camera when mode switches to "camera" ── */
  useEffect(() => {
    if (mode === "camera") openCamera();
    else killCamera();
  }, [mode]);

  /* ─────────────────── CAMERA ─────────────────── */
  const openCamera = async () => {
    setCamError(""); doneRef.current = false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });
      streamRef.current = stream;
      // give React time to render the <video> before attaching
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().then(() => {
            rafRef.current = requestAnimationFrame(tick);
          });
        }
      });
    } catch {
      setCamError("Camera access denied — please allow camera permission.");
    }
  };

  const killCamera = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  /* ── per-frame scan ── */
  const tick = useCallback(() => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || doneRef.current) return;
    if (video.readyState < 2) { rafRef.current = requestAnimationFrame(tick); return; }

    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(video, 0, 0);

    decodeQR(canvas, ctx)
      .then((raw) => {
        if (raw && !doneRef.current) {
          doneRef.current = true;
          const extracted = parseTicketId(raw);
          if (extracted) {
            killCamera();
            checkIn(extracted);
          } else {
            // QR found but payload unrecognised — keep scanning
            doneRef.current = false;
            rafRef.current = requestAnimationFrame(tick);
          }
        } else {
          rafRef.current = requestAnimationFrame(tick);
        }
      })
      .catch(() => { rafRef.current = requestAnimationFrame(tick); });
  }, []);

  /* ── QR decode: BarcodeDetector (Chrome/Android) → jsQR (Firefox/Safari) ── */
  const decodeQR = async (canvas, ctx) => {
    if ("BarcodeDetector" in window) {
      try {
        const det  = new window.BarcodeDetector({ formats: ["qr_code"] });
        const hits = await det.detect(canvas);
        return hits.length > 0 ? hits[0].rawValue : null;
      } catch { /* fall through */ }
    }
    // jsQR fallback (loaded via <script> in index.html)
    if (window.jsQR) {
      const img  = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = window.jsQR(img.data, canvas.width, canvas.height);
      return code ? code.data : null;
    }
    return null;
  };

  /* ── extract ticketId from "ticketId=xxx&eventId=yyy" or plain UUID ── */
  const parseTicketId = (raw) => {
    const m = raw.match(/ticketId=([^&\s]+)/);
    if (m) return m[1];
    // plain UUID pattern
    if (/^[0-9a-f-]{36}$/i.test(raw.trim())) return raw.trim();
    return null;
  };

  /* ─────────────────── CHECK-IN API ─────────────────── */
  const checkIn = async (tid) => {
    setLoading(true); setResult(null); setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/events/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ticketId: tid.trim(), staffUserId: Number(staffId) }),
      });
      const data = await res.json();
      if (res.ok) { setResult(data.data); setTicketId(""); }
      else setError(data.message || "Check-in failed");
    } catch { setError("Server error — please try again"); }
    finally { setLoading(false); }
  };

  const handleManual = () => {
    if (!ticketId.trim()) { setError("Please enter a ticket ID"); return; }
    checkIn(ticketId.trim());
  };

  const reset = () => {
    setResult(null); setError(""); setTicketId("");
    if (mode === "camera") { doneRef.current = false; openCamera(); }
  };

  const switchMode = (m) => {
    setResult(null); setError(""); setTicketId(""); setCamError("");
    setMode(m);
  };

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <div className="checkin-page">

      {/* header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => { killCamera(); navigate("/staff"); }}>
          ← Dashboard
        </button>
        <h1>Event Check-In</h1>
        <p>Scan QR code or enter ticket ID manually</p>
      </div>

      {/* mode tabs */}
      <div className="checkin-tabs">
        <button
          className={`checkin-tab ${mode === "manual" ? "active" : ""}`}
          onClick={() => switchMode("manual")}
        >
          ⌨️ Manual Entry
        </button>
        <button
          className={`checkin-tab ${mode === "camera" ? "active" : ""}`}
          onClick={() => switchMode("camera")}
        >
          📷 Scan QR Code
        </button>
      </div>

      {/* ── CAMERA VIEW ── */}
      {mode === "camera" && (
        <div className="camera-card">
          <div className="camera-frame">
            <video ref={videoRef} className="camera-video" playsInline muted />
            {/* hidden canvas used for decoding */}
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {/* animated scanning UI overlay */}
            <div className="scan-overlay">
              <div className="scan-box">
                <span className="corner tl" /><span className="corner tr" />
                <span className="corner bl" /><span className="corner br" />
                <div className="scan-line" />
              </div>
            </div>
          </div>
          <p className="cam-hint">📱 Point camera at the student's QR code ticket</p>
          {loading && <p className="scanning-msg">⏳ Verifying ticket…</p>}
          {camError && <p className="cam-error">⚠️ {camError}</p>}
        </div>
      )}

      {/* ── MANUAL VIEW ── */}
      {mode === "manual" && !result && !error && (
        <div className="checkin-card">
          <div className="card-icon">🎟️</div>
          <h2>Enter Ticket ID</h2>
          <p>Paste or type the UUID from the student's booking email</p>
          <div className="input-row">
            <input
              className="ticket-input"
              type="text"
              placeholder="550e8400-e29b-41d4-a716-446655440000"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleManual()}
              autoFocus
            />
            <button className="btn-checkin" onClick={handleManual} disabled={loading}>
              {loading ? "Checking…" : "Check In ✓"}
            </button>
          </div>
        </div>
      )}

      {/* ── RESULT ── */}
      {error && (
        <div className="result-box error">
          <span className="result-icon">❌</span>
          <div className="result-body">
            <h3>Check-In Failed</h3>
            <p>{error}</p>
          </div>
          <button className="btn-retry" onClick={reset}>Try Again</button>
        </div>
      )}

      {result && (
        <div className={`result-box ${result.checkedIn ? "success" : "warning"}`}>
          <span className="result-icon">{result.checkedIn ? "✅" : "⚠️"}</span>
          <div className="result-body">
            <h3>{result.checkedIn ? "Entry Allowed!" : "Already Checked In"}</h3>
            <div className="result-grid">
              <div className="r-row"><span>Student</span><strong>{result.studentName}</strong></div>
              <div className="r-row"><span>Event</span>  <strong>{result.eventTitle}</strong></div>
              <div className="r-row"><span>Ticket</span> <code>{result.ticketId}</code></div>
              {result.checkInTime && (
                <div className="r-row">
                  <span>Time</span>
                  <strong>{new Date(result.checkInTime).toLocaleTimeString()}</strong>
                </div>
              )}
            </div>
          </div>
          <button className="btn-next" onClick={reset}>Next →</button>
        </div>
      )}

      {/* ── TIPS (manual idle only) ── */}
      {mode === "manual" && !result && !error && (
        <div className="checkin-tips">
          <h3>📌 How it works</h3>
          <ul>
            <li>Switch to <strong>Scan QR Code</strong> for fast camera scanning</li>
            <li>Or paste the UUID ticket ID from the student's email</li>
            <li><span className="tip-green">Green</span> = entry granted &nbsp;|&nbsp; <span className="tip-yellow">Yellow</span> = already entered</li>
            <li>Each ticket is single-use — duplicate scans are rejected</li>
          </ul>
        </div>
      )}

    </div>
  );
}