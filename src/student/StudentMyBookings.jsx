import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/config";
import "../styles/StudentMyBookings.css";

export default function StudentMyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [message, setMessage] = useState("");
  const [expandedQR, setExpandedQR] = useState(null); // bookingId whose QR is open
  const userId = sessionStorage.getItem("USER_ID");

  useEffect(() => {
    if (!userId) { navigate("/login"); return; }
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/events/bookings/my`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setBookings(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;
    setCancelling(bookingId);
    setMessage("");
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/events/bookings/cancel/${bookingId}`,
        { method: "POST", credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) { setMessage("Booking cancelled successfully."); fetchBookings(); }
      else setMessage(data.message || "Cancellation failed");
    } catch { setMessage("Server error"); }
    finally { setCancelling(null); }
  };

  const downloadQR = (b) => {
    if (!b.qrCodeUrl) return;
    const a = document.createElement("a");
    a.href = b.qrCodeUrl;
    a.download = `ticket-${b.ticketId}.png`;
    a.click();
  };

  const statusClass = (s) =>
    s === "CONFIRMED" ? "confirmed" : s === "CANCELLED" ? "cancelled" : "";

  return (
    <div className="my-bookings-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/student")}>
          ← Dashboard
        </button>
        <h1>My Tickets</h1>
        <p>All your event bookings in one place</p>
      </div>

      {message && <div className="alert-msg">{message}</div>}
      {loading && <div className="loading">Loading your tickets...</div>}

      {!loading && bookings.length === 0 && (
        <div className="empty-state">
          <span>🎟️</span>
          <p>No bookings yet</p>
          <button className="btn-primary" onClick={() => navigate("/student/events")}>
            Browse Events
          </button>
        </div>
      )}

      <div className="bookings-list">
        {bookings.map((b) => (
          <div key={b.bookingId} className={`booking-card ${statusClass(b.bookingStatus)}`}>

            {/* Left icon */}
            <div className="booking-card-left">
              <div className="booking-icon">🎟️</div>
            </div>

            {/* Main body */}
            <div className="booking-card-body">
              <h3>{b.eventTitle}</h3>
              <div className="booking-meta">
                <span>📅 {b.eventDate}</span>
                <span>⏰ {b.eventTime}</span>
                <span>📍 {b.venue}</span>
              </div>
              <div className="booking-footer">
                <span className={`status-badge ${statusClass(b.bookingStatus)}`}>
                  {b.bookingStatus}
                </span>
                {b.refundStatus && b.refundStatus !== "NOT_APPLICABLE" && (
                  <span className="refund-badge">Refund: {b.refundStatus}</span>
                )}
                <small>Booked: {b.bookingDate}</small>
              </div>

              {/* ── QR CODE SECTION (confirmed tickets only) ── */}
              {b.bookingStatus === "CONFIRMED" && b.qrCodeUrl && (
                <div className="qr-section">
                  <button
                    className="btn-show-qr"
                    onClick={() =>
                      setExpandedQR(expandedQR === b.bookingId ? null : b.bookingId)
                    }
                  >
                    {expandedQR === b.bookingId ? "▲ Hide QR" : "📲 Show QR Code"}
                  </button>

                  {expandedQR === b.bookingId && (
                    <div className="qr-popup">
                      <img
                        src={b.qrCodeUrl}
                        alt="Ticket QR Code"
                        className="qr-popup-img"
                      />
                      <p className="qr-popup-hint">Show this QR at event entry</p>
                      <p className="qr-popup-id">
                        Ticket ID: <code>{b.ticketId}</code>
                      </p>
                      <button className="btn-download-qr" onClick={() => downloadQR(b)}>
                        ⬇️ Save QR Image
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cancel button */}
            {b.bookingStatus === "CONFIRMED" && (
              <div className="booking-card-actions">
                <button
                  className="btn-cancel"
                  disabled={cancelling === b.bookingId}
                  onClick={() => cancelBooking(b.bookingId)}
                >
                  {cancelling === b.bookingId ? "Cancelling…" : "Cancel"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}