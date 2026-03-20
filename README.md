# BookMySlot — Frontend

> React powering a multi-role slot and event booking platform for educational institutions — with role-based dashboards, Razorpay payments, QR check-in, and live analytics.

---

## Overview

BookMySlot's frontend serves four distinct user roles — **Admin**, **Club Staff**, **Student**, and **Teacher** — each with a dedicated dashboard and feature set. Role is determined at login and drives all routing and UI decisions throughout the session.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.0 | UI library with Concurrent Mode for non-blocking dashboard rendering |
| Vite | 7.x | ESM-native build tool — near-instant HMR, fast production builds |
| React Router DOM | 7.x | Client-side routing with parameterized and nested routes |
| Recharts | 3.x | Declarative chart components (Area, Bar, Pie) for analytics dashboards |
| Axios | 1.x | HTTP client for API communication |
| Plain CSS | — | Per-component scoped stylesheets; no CSS-in-JS overhead |

---

## Features by Role

**Student** — Browse public event feed, book free events instantly or paid events via Razorpay, receive QR-code tickets with Google Calendar links, view available teacher consultation slots by date, and manage all personal bookings.

**Teacher** — Create time slots with date and time range, view student bookings, and manage upcoming appointments through a calendar view.

**Club Staff** — Create and manage events (title, venue, pricing, seat count), upload event posters, edit or cancel events, and perform QR-code or manual ticket ID check-in on event day.

**Admin** — Monitor platform-wide KPIs (users, bookings, revenue), view 7-day booking trend charts, analyze per-teacher slot utilization, drill into per-event attendance and revenue analytics, manage clubs, and add or deactivate staff accounts.

---

## Project Structure

```
src/
├── admin/          # Admin dashboards, club management, staff management, analytics
├── staff/          # Event CRUD, poster upload, QR check-in
├── student/        # Event feed, event detail, slot booking, my bookings
├── teacher/        # Slot creation, booking list, calendar
├── components/     # Shared — Navbar, EventCard, EventFeed, AuthModal
├── pages/          # Public routes — Home, Login, Register, ForgotPassword, ResetPassword
├── api/            # config.js — API base URL and Razorpay key
├── utils/          # Date formatting helpers
├── styles/         # Per-component CSS + global.css
└── App.jsx         # Root router — all routes defined here
```

Each role is fully isolated in its own directory. A developer working on the Student flow only touches `src/student/` and shared `src/components/` — no cross-role coupling.

---

## Authentication Flow

1. User submits credentials → `POST /api/auth/login`
2. Backend sets an HttpOnly JWT cookie and returns `{ userId, role, clubId }`
3. Frontend stores `USER_ID` and `ROLE` in `sessionStorage`, redirects to the role dashboard
4. All subsequent API calls include `credentials: "include"` — the cookie is attached automatically

Registration is a two-step flow: form submission triggers an OTP email; OTP verification activates the account. Password reset follows a standard email-token flow.

---

## Setup & Installation

**Prerequisites:** Node.js 18+, backend running on port `8080`

```bash
git clone https://github.com/your-username/bookmyslot-frontend.git
cd bookmyslot-frontend
npm install
```

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_RAZORPAY_KEY=rzp_test_xxxxxxxxxxxx
```

```bash
npm run dev       # Development server → http://localhost:5173
npm run build     # Production build  → dist/
npm run preview   # Preview prod build locally
npm run lint      # ESLint check
```

---
## Related Repositories

| Layer | Repository |
|---|---|
| Backend | [bookmyslot-backend](https://github.com/deepakbhat18/bookmyslot.git) — Spring Boot, JWT, MySQL |

