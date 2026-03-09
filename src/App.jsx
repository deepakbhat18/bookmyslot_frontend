// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ForgotPassword from "./pages/ForgotPassword";
// import ResetPassword from "./pages/ResetPassword";

// /* ADMIN */
// import AdminDashboard from "./admin/dashboard/AdminDashboard";
// import AdminClubs from "./admin/club/AdminClubs";
// import ClubDashboard from "./admin/club/ClubDashboard";
// import AdminStaffList from "./admin/staff/AdminStaffList";
// import AdminStaffDetails from "./admin/staff/AdminStaffDetails";
// import AdminStaffAdd from "./admin/staff/AdminStaffAdd";
// import AdminSlotAnalytics from "./admin/slots/AdminSlotAnalytics";

// /* CLUB STAFF */
// import StaffDashboard from "./staff/StaffDashboard";
// import CreateEvent from "./staff/CreateEvent";
// import EditEvent from "./staff/EditEvent";
// import UploadPoster from "./staff/UploadPoster";
// import ClubStaffEvents from "./staff/ClubStaffEvents";
// import StaffCheckIn from "./staff/StaffCheckIn";

// /* STUDENT */
// import StudentDashboard from "./student/StudentDashboard";
// import StudentEvents from "./student/StudentEvents";
// import StudentEventDetail from "./student/StudentEventDetail";
// import StudentMyBookings from "./student/StudentMyBookings";
// import StudentBookSlot from "./student/StudentBookSlot";
// import StudentMySlots from "./student/StudentMySlots";

// /* TEACHER */
// import TeacherDashboard from "./teacher/TeacherDashboard";
// import TeacherCreateSlot from "./teacher/TeacherCreateSlot";
// import TeacherBookings from "./teacher/TeacherBookings";
// import TeacherCalendar from "./teacher/TeacherCalendar";

// import "./styles/global.css";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Navbar />
//       <Routes>
//         {/* PUBLIC */}
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/reset-password" element={<ResetPassword />} />

//         {/* ADMIN */}
//         <Route path="/admin" element={<AdminDashboard />} />
//         <Route path="/admin/clubs" element={<AdminClubs />} />
//         <Route path="/admin/clubs/:clubId" element={<ClubDashboard />} />
//         <Route path="/admin/staff" element={<AdminStaffList />} />
//         <Route path="/admin/staff/add" element={<AdminStaffAdd />} />
//         <Route path="/admin/staff/:staffId" element={<AdminStaffDetails />} />
//         <Route path="/admin/slots" element={<AdminSlotAnalytics />} />

//         {/* CLUB STAFF */}
//         <Route path="/staff" element={<StaffDashboard />} />
//         <Route path="/staff/events" element={<ClubStaffEvents />} />
//         <Route path="/staff/events/new" element={<CreateEvent />} />
//         <Route path="/staff/events/:eventId/edit" element={<EditEvent />} />
//         <Route path="/staff/events/:eventId/poster" element={<UploadPoster />} />
//         <Route path="/staff/checkin" element={<StaffCheckIn />} />

//         {/* STUDENT */}
//         <Route path="/student" element={<StudentDashboard />} />
//         <Route path="/student/events" element={<StudentEvents />} />
//         <Route path="/student/events/:eventId" element={<StudentEventDetail />} />
//         <Route path="/student/my-bookings" element={<StudentMyBookings />} />
//         <Route path="/student/book-slot" element={<StudentBookSlot />} />
//         <Route path="/student/my-slots" element={<StudentMySlots />} />

//         {/* TEACHER */}
//         <Route path="/teacher" element={<TeacherDashboard />} />
//         <Route path="/teacher/slots/create" element={<TeacherCreateSlot />} />
//         <Route path="/teacher/bookings" element={<TeacherBookings />} />
//         <Route path="/teacher/calendar" element={<TeacherCalendar />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }


import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

/* ADMIN */
import AdminDashboard from "./admin/dashboard/AdminDashboard";
import AdminClubs from "./admin/club/AdminClubs";
import ClubDashboard from "./admin/club/ClubDashboard";
import AdminStaffList from "./admin/staff/AdminStaffList";
import AdminStaffDetails from "./admin/staff/AdminStaffDetails";
import AdminStaffAdd from "./admin/staff/AdminStaffAdd";

/* CLUB STAFF */
import StaffDashboard from "./staff/StaffDashboard";
import CreateEvent from "./staff/CreateEvent";
import EditEvent from "./staff/EditEvent";
import UploadPoster from "./staff/UploadPoster";
import ClubStaffEvents from "./staff/ClubStaffEvents";
import StaffCheckIn from "./staff/StaffCheckIn";

/* STUDENT */
import StudentDashboard from "./student/StudentDashboard";
import StudentEvents from "./student/StudentEvents";
import StudentEventDetail from "./student/StudentEventDetail";
import StudentMyBookings from "./student/StudentMyBookings";
import StudentBookSlot from "./student/StudentBookSlot";
import StudentMySlots from "./student/StudentMySlots";

/* TEACHER */
import TeacherDashboard from "./teacher/TeacherDashboard";
import TeacherCreateSlot from "./teacher/TeacherCreateSlot";
import TeacherBookings from "./teacher/TeacherBookings";
import TeacherCalendar from "./teacher/TeacherCalendar";

import "./styles/global.css";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/clubs" element={<AdminClubs />} />
        <Route path="/admin/clubs/:clubId" element={<ClubDashboard />} />
        <Route path="/admin/staff" element={<AdminStaffList />} />
        <Route path="/admin/staff/add" element={<AdminStaffAdd />} />
        <Route path="/admin/staff/:staffId" element={<AdminStaffDetails />} />

        {/* CLUB STAFF */}
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/staff/events" element={<ClubStaffEvents />} />
        <Route path="/staff/events/new" element={<CreateEvent />} />
        <Route path="/staff/events/:eventId/edit" element={<EditEvent />} />
        <Route path="/staff/events/:eventId/poster" element={<UploadPoster />} />
        <Route path="/staff/checkin" element={<StaffCheckIn />} />

        {/* STUDENT */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/events" element={<StudentEvents />} />
        <Route path="/student/events/:eventId" element={<StudentEventDetail />} />
        <Route path="/student/my-bookings" element={<StudentMyBookings />} />
        <Route path="/student/book-slot" element={<StudentBookSlot />} />
        <Route path="/student/my-slots" element={<StudentMySlots />} />

        {/* TEACHER */}
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/create-slot" element={<TeacherCreateSlot />} />
        <Route path="/teacher/bookings" element={<TeacherBookings />} />
        <Route path="/teacher/calendar" element={<TeacherCalendar />} />
      </Routes>
    </BrowserRouter>
  );
}