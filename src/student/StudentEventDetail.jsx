
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/config";
import "../styles/StudentEventDetail.css";

export default function StudentEventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [ticketData, setTicketData] = useState(null);

  const studentId = sessionStorage.getItem("USER_ID");
  const role = sessionStorage.getItem("ROLE");

  // PublicEventDetailResponse: eventId, title, posterUrl, description,
  // eventDate(LocalDate), startTime(LocalTime), endTime(LocalTime),
  // venue, clubName, eventType("FREE"|"PAID")
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/public/events/${eventId}`)
      .then((r) => r.json())
      .then(setEvent)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [eventId]);

  /* ── FREE booking ── */
  const bookFree = async () => {
    if (!studentId || role !== "STUDENT") { navigate("/login"); return; }
    setBooking(true); setErrMsg("");
    try {
      // POST /api/events/bookings/book  body: { eventId, studentId }
      const res = await fetch(`${API_BASE_URL}/api/events/bookings/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          eventId: Number(eventId),
          studentId: Number(studentId),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // EventBookingResponse: ticketId, eventTitle, venue, eventDate,
        // eventTime, studentName, studentEmail, paid, amountPaid,
        // qrCodeUrl, googleCalendarLink
        setTicketData(data.data);
      } else {
        setErrMsg(data.message || "Booking failed");
      }
    } catch { setErrMsg("Server error"); }
    finally { setBooking(false); }
  };

  /* ── PAID booking via Razorpay ── */
  const bookPaid = async () => {
    if (!studentId || role !== "STUDENT") { navigate("/login"); return; }
    setBooking(true); setErrMsg("");
    try {
      // Step 1 — POST /api/payments/create  body: { eventId, studentId }
      // Returns PaymentResponse: { orderId, amount, status }
      const createRes = await fetch(`${API_BASE_URL}/api/payments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          eventId: Number(eventId),
          studentId: Number(studentId),
        }),
      });
      const createData = await createRes.json();
      if (!createRes.ok) {
        setErrMsg(createData.message || "Payment initiation failed");
        setBooking(false);
        return;
      }

      const { orderId, amount } = createData.data;

      // Step 2 — Open Razorpay checkout
      const options = {
        //key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_placeholder",
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: amount * 100,          // paise
        currency: "INR",
        name: "BookMySlot",
        description: event.title,
        order_id: orderId,

        handler: async (response) => {
          // Step 3 — POST /api/payments/verify
          // body: { orderId, paymentId, signature }
          const verifyRes = await fetch(`${API_BASE_URL}/api/payments/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              orderId:   response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            setTicketData(verifyData.data); // EventBookingResponse
          } else {
            setErrMsg(verifyData.message || "Payment verification failed");
          }
          setBooking(false);
        },

        modal: {
          ondismiss: () => setBooking(false),
        },
      };

      if (!window.Razorpay) {
        setErrMsg("Razorpay SDK not loaded. Add the script tag to index.html.");
        setBooking(false);
        return;
      }
      new window.Razorpay(options).open();
      // booking=false is set inside handler / ondismiss
    } catch {
      setErrMsg("Server error during payment");
      setBooking(false);
    }
  };

  const handleBook = () =>
    event?.eventType === "PAID" ? bookPaid() : bookFree();

  const downloadQR = () => {
    if (!ticketData?.qrCodeUrl) return;
    const a = document.createElement("a");
    a.href = ticketData.qrCodeUrl;
    a.download = `ticket-${ticketData.ticketId}.png`;
    a.click();
  };

  if (loading) return <div className="loading">Loading event…</div>;
  if (!event)  return <div className="loading">Event not found</div>;

  const posterUrl = event.posterUrl ? `${API_BASE_URL}${event.posterUrl}` : null;
  const isPaid    = event.eventType === "PAID";

  return (
    <div className="event-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="event-detail-card">

        {/* HERO */}
        <div className="event-detail-hero">
          {posterUrl
            ? <img src={posterUrl} alt={event.title} className="event-hero-img" />
            : <div className="event-hero-placeholder">🎪</div>}
          <div className="event-hero-overlay">
            <span className={`event-type-badge ${isPaid ? "paid" : "free"}`}>
              {isPaid ? "₹ PAID" : "FREE"}
            </span>
          </div>
        </div>

        <div className="event-detail-body">
          <h1>{event.title}</h1>
          <p className="club-tag">🏛️ {event.clubName}</p>

          <div className="event-info-grid">
            <div className="info-item">
              <span className="info-icon">📅</span>
              <div><small>Date</small><p>{String(event.eventDate)}</p></div>
            </div>
            <div className="info-item">
              <span className="info-icon">⏰</span>
              <div><small>Time</small><p>{String(event.startTime)} – {String(event.endTime)}</p></div>
            </div>
            <div className="info-item">
              <span className="info-icon">📍</span>
              <div><small>Venue</small><p>{event.venue}</p></div>
            </div>
          </div>

          <div className="event-description">
            <h3>About this Event</h3>
            <p>{event.description}</p>
          </div>

          {/* ── PAID NOTICE ── */}
          {isPaid && !ticketData && (
            <div className="paid-notice">
              <span>💳</span>
              <div>
                <strong>This is a paid event</strong>
                <p>You will be redirected to Razorpay to complete payment. Your ticket and QR code are issued immediately after successful payment.</p>
              </div>
            </div>
          )}

          {/* ── ERROR ── */}
          {errMsg && <div className="booking-msg error">{errMsg}</div>}

          {/* ── BOOK BUTTON ── */}
          {!ticketData && (
            <button className="book-now-btn" onClick={handleBook} disabled={booking}>
              {booking
                ? "Processing…"
                : isPaid
                  ? "Pay & Book Now 💳"
                  : "Book Free Ticket 🎟️"}
            </button>
          )}

          {/* ══ TICKET CARD ══ */}
          {ticketData && (
            <div className="ticket-card">
              <div className="ticket-banner">
                <span>🎟️</span>
                <div>
                  <h3>Booking Confirmed!</h3>
                  <p>Check your email — ticket details sent</p>
                </div>
                <span className="tick-check">✅</span>
              </div>

              <div className="ticket-body">
                <div className="ticket-details">
                  <div className="t-row"><span>Event</span>  <strong>{ticketData.eventTitle}</strong></div>
                  <div className="t-row"><span>Venue</span>  <strong>{ticketData.venue}</strong></div>
                  <div className="t-row"><span>Date</span>   <strong>{ticketData.eventDate}</strong></div>
                  <div className="t-row"><span>Time</span>   <strong>{ticketData.eventTime}</strong></div>
                  <div className="t-row"><span>Name</span>   <strong>{ticketData.studentName}</strong></div>
                  <div className="t-row ticket-id-row">
                    <span>Ticket ID</span>
                    <code>{ticketData.ticketId}</code>
                  </div>
                  {ticketData.paid && (
                    <div className="t-row paid-row">
                      <span>Amount Paid</span>
                      <strong className="paid-amount">₹{ticketData.amountPaid}</strong>
                    </div>
                  )}
                </div>

                {ticketData.qrCodeUrl && (
                  <div className="qr-block">
                    <img src={ticketData.qrCodeUrl} alt="QR Code" className="qr-image" />
                    <p className="qr-label">📲 Show at entry gate</p>
                  </div>
                )}
              </div>

              <div className="ticket-actions">
                {ticketData.qrCodeUrl && (
                  <button className="btn-dl" onClick={downloadQR}>⬇️ Download QR</button>
                )}
                {ticketData.googleCalendarLink && (
                  <a className="btn-cal" href={ticketData.googleCalendarLink} target="_blank" rel="noopener noreferrer">
                    📅 Add to Calendar
                  </a>
                )}
                <button className="btn-my" onClick={() => navigate("/student/my-bookings")}>
                  My Tickets →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}