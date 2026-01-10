import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

/* ADMIN */
import AdminDashboard from "./admin/dashboard/AdminDashboard";

/* ADMIN → CLUB */
import AdminClubs from "./admin/club/AdminClubs";
import ClubDashboard from "./admin/club/ClubDashboard";
import ClubEventAnalytics from "./admin/club/ClubEventAnalytics";

import "./styles/global.css";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* ---------- PUBLIC ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ---------- ADMIN ---------- */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/clubs" element={<AdminClubs />} />

        {/* ---------- CLUB DASHBOARD (NESTED) ---------- */}
        <Route path="/admin/clubs/:clubId" element={<ClubDashboard />}>
          <Route
            path="events/:eventId/analytics"
            element={<ClubEventAnalytics />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
