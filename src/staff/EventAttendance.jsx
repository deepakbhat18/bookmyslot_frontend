import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch, API_BASE_URL } from "../api/config";
import "../styles/EventAttendance.css";

export default function EventAttendance() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryEventId = searchParams.get("eventId");

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(queryEventId || "");
  const [eventsLoading, setEventsLoading] = useState(true);

  const [summary, setSummary] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [regsLoading, setRegsLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | ATTENDED | NOT_ATTENDED

  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: '' }

  // Modal confirmation state
  const [confirmModal, setConfirmModal] = useState(null); // { bookingId, studentName, usn }

  // 1. Load Club Events for Dropdown
  useEffect(() => {
    const role = sessionStorage.getItem("ROLE");
    const userId = sessionStorage.getItem("USER_ID");
    if (!userId || role !== "CLUB") {
      navigate("/login");
      return;
    }

    setEventsLoading(true);
    apiFetch(`${API_BASE_URL}/api/staff/attendance/events`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setEvents(data.data);
          // Auto-select event if not specified or if matching
          if (queryEventId && data.data.some((e) => String(e.eventId) === String(queryEventId))) {
            setSelectedEventId(String(queryEventId));
          } else if (data.data.length > 0 && !selectedEventId) {
            setSelectedEventId(String(data.data[0].eventId));
            setSearchParams({ eventId: String(data.data[0].eventId) });
          }
        } else {
          setNotification({ type: "error", message: data.message || "Failed to load events" });
        }
      })
      .catch(() => {
        setNotification({ type: "error", message: "Failed to connect to server." });
      })
      .finally(() => setEventsLoading(false));
  }, [navigate]);

  // 2. Load Registrations when Selected Event Changes
  useEffect(() => {
    if (!selectedEventId) return;

    setRegsLoading(true);
    setNotification(null);
    apiFetch(`${API_BASE_URL}/api/staff/attendance/events/${selectedEventId}/registrations`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setSummary(data.data);
          setRegistrations(data.data.registrations || []);
        } else {
          setNotification({ type: "error", message: data.message || "Failed to load registrations" });
          setSummary(null);
          setRegistrations([]);
        }
      })
      .catch(() => {
        setNotification({ type: "error", message: "Error loading registrations for selected event." });
      })
      .finally(() => setRegsLoading(false));
  }, [selectedEventId]);

  // Handle Event Selector Change
  const handleEventChange = (newId) => {
    setSelectedEventId(newId);
    setSearchParams(newId ? { eventId: newId } : {});
    setSearch("");
    setStatusFilter("ALL");
  };

  // 3. Mark Attendance Action
  const confirmMarkAttended = (reg) => {
    setConfirmModal({
      bookingId: reg.bookingId,
      studentName: reg.studentName,
      usn: reg.usn || "N/A",
    });
  };

  const executeMarkAttended = async () => {
    if (!confirmModal || !selectedEventId) return;
    const { bookingId, studentName } = confirmModal;
    setConfirmModal(null);
    setActionLoadingId(bookingId);
    setNotification(null);

    try {
      const res = await apiFetch(
        `${API_BASE_URL}/api/staff/attendance/events/${selectedEventId}/registrations/${bookingId}/mark-attended`,
        { method: "POST" }
      );
      const data = await res.json();

      if (res.ok && data.success) {
        // Update local state immediately
        const updated = data.data;
        setRegistrations((prev) =>
          prev.map((r) => (r.bookingId === bookingId ? { ...r, ...updated, attended: true, attendanceStatus: "ATTENDED" } : r))
        );

        // Update counts
        setSummary((prev) => {
          if (!prev) return prev;
          const wasAttended = prev.registrations?.find((r) => r.bookingId === bookingId)?.attended;
          if (wasAttended) return prev;
          return {
            ...prev,
            attendedCount: prev.attendedCount + 1,
            notAttendedCount: Math.max(0, prev.notAttendedCount - 1),
          };
        });

        setNotification({
          type: "success",
          message: `Attendance marked successfully for ${studentName}!`,
        });
      } else {
        setNotification({
          type: "error",
          message: data.message || "Failed to mark attendance.",
        });
      }
    } catch {
      setNotification({
        type: "error",
        message: "Server error occurred while marking attendance.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // 4. Excel Export
  const handleExportExcel = async () => {
    if (!selectedEventId || !summary) return;
    setExporting(true);
    setNotification(null);

    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const url = `${API_BASE_URL}/api/staff/attendance/events/${selectedEventId}/export?${params.toString()}`;
      const res = await apiFetch(url);

      if (!res.ok) {
        throw new Error("Excel export failed on server");
      }

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;

      // Extract filename from header or fallback
      const contentDisposition = res.headers.get("content-disposition");
      let filename = `${summary.eventTitle || "Event"}_Registrations.xlsx`.replaceAll(" ", "_");
      if (contentDisposition && contentDisposition.includes("filename=")) {
        const match = contentDisposition.match(/filename=["']?([^"']+)["']?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setNotification({
        type: "success",
        message: `Excel sheet "${filename}" exported successfully!`,
      });
    } catch (err) {
      setNotification({
        type: "error",
        message: "Failed to download Excel file. Please try again.",
      });
    } finally {
      setExporting(false);
    }
  };

  // Filter and search registrations
  const filteredRegistrations = useMemo(() => {
    const q = search.trim().toLowerCase();
    return registrations.filter((r) => {
      // Status filter
      if (statusFilter === "ATTENDED" && !r.attended) return false;
      if (statusFilter === "NOT_ATTENDED" && r.attended) return false;

      // Search filter
      if (!q) return true;
      const nameMatch = r.studentName && r.studentName.toLowerCase().includes(q);
      const usnMatch = r.usn && r.usn.toLowerCase().includes(q);
      const emailMatch = r.studentEmail && r.studentEmail.toLowerCase().includes(q);
      return nameMatch || usnMatch || emailMatch;
    });
  }, [registrations, search, statusFilter]);

  const selectedEvent = events.find((e) => String(e.eventId) === String(selectedEventId));

  return (
    <div className="attendance-page">
      {/* Top Header */}
      <div className="attendance-header">
        <div>
          <button className="back-link" onClick={() => navigate("/staff")}>
            ← Staff Dashboard
          </button>
          <h1>Event Registrations & Attendance</h1>
          <p>Track attendee registrations, record verified check-ins, and export reports to Excel</p>
        </div>
      </div>

      {/* Global Notification Banner */}
      {notification && (
        <div className={`attendance-banner ${notification.type}`}>
          <span>{notification.type === "success" ? "✅" : "⚠️"}</span>
          <span>{notification.message}</span>
          <button className="banner-close" onClick={() => setNotification(null)}>
            ✕
          </button>
        </div>
      )}

      {/* Event Selection Bar */}
      <div className="event-selection-card">
        <div className="selector-group">
          <label htmlFor="event-select">Select Club Event:</label>
          {eventsLoading ? (
            <div className="selector-loading">Loading events…</div>
          ) : events.length === 0 ? (
            <div className="no-events-text">No events found for your club.</div>
          ) : (
            <select
              id="event-select"
              className="event-dropdown"
              value={selectedEventId}
              onChange={(e) => handleEventChange(e.target.value)}
            >
              {events.map((e) => (
                <option key={e.eventId} value={e.eventId}>
                  {e.title} ({e.eventDate}) — {e.bookedSlots}/{e.totalSlots} Booked
                </option>
              ))}
            </select>
          )}
        </div>

        {selectedEvent && (
          <div className="selected-event-meta">
            <span className="meta-pill">📍 {selectedEvent.venue || "Campus"}</span>
            <span className="meta-pill">📅 {selectedEvent.eventDate}</span>
            <span className={`status-pill pill-${selectedEvent.status === "PUBLISHED" ? "green" : "grey"}`}>
              {selectedEvent.status}
            </span>
          </div>
        )}
      </div>

      {selectedEventId && (
        <>
          {/* Metrics Summary Cards */}
          <div className="metrics-grid">
            <div className="metric-card card-total">
              <div className="metric-icon">👥</div>
              <div className="metric-content">
                <span className="metric-label">Total Registrations</span>
                <strong className="metric-value">{summary?.totalRegistrations ?? 0}</strong>
              </div>
            </div>

            <div className="metric-card card-attended">
              <div className="metric-icon">✅</div>
              <div className="metric-content">
                <span className="metric-label">Attended / Checked-In</span>
                <strong className="metric-value">{summary?.attendedCount ?? 0}</strong>
              </div>
            </div>

            <div className="metric-card card-pending">
              <div className="metric-icon">⏳</div>
              <div className="metric-content">
                <span className="metric-label">Not Yet Attended</span>
                <strong className="metric-value">{summary?.notAttendedCount ?? 0}</strong>
              </div>
            </div>
          </div>

          {/* Controls Toolbar: Search, Filters, and Excel Export */}
          <div className="attendance-toolbar">
            <div className="toolbar-left">
              <div className="search-wrap">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  className="attendance-search"
                  placeholder="Search by student name, USN, or email…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button className="clear-search" onClick={() => setSearch("")}>
                    ✕
                  </button>
                )}
              </div>

              <div className="filter-pill-group">
                <button
                  className={`filter-pill-btn ${statusFilter === "ALL" ? "active" : ""}`}
                  onClick={() => setStatusFilter("ALL")}
                >
                  All ({registrations.length})
                </button>
                <button
                  className={`filter-pill-btn ${statusFilter === "ATTENDED" ? "active" : ""}`}
                  onClick={() => setStatusFilter("ATTENDED")}
                >
                  Attended ({registrations.filter((r) => r.attended).length})
                </button>
                <button
                  className={`filter-pill-btn ${statusFilter === "NOT_ATTENDED" ? "active" : ""}`}
                  onClick={() => setStatusFilter("NOT_ATTENDED")}
                >
                  Not Attended ({registrations.filter((r) => !r.attended).length})
                </button>
              </div>
            </div>

            <div className="toolbar-right">
              <button
                className="btn-export-excel"
                onClick={handleExportExcel}
                disabled={exporting || regsLoading || registrations.length === 0}
                title="Export attendee list to an Excel (.xlsx) file"
              >
                <span>{exporting ? "⏳" : "📊"}</span>
                <span>{exporting ? "Exporting…" : "Export to Excel (.xlsx)"}</span>
              </button>
            </div>
          </div>

          {/* Registrations Table */}
          {regsLoading ? (
            <div className="table-loading-card">
              <div className="spinner"></div>
              <p>Loading registrations and attendance records…</p>
            </div>
          ) : registrations.length === 0 ? (
            <div className="table-empty-card">
              <span className="empty-icon">📋</span>
              <h3>No Registrations Yet</h3>
              <p>No students have booked or registered for this event yet.</p>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="table-empty-card">
              <span className="empty-icon">🔍</span>
              <h3>No Matching Registrations</h3>
              <p>No records matched your search query or filter selection.</p>
              <button
                className="btn-reset-filters"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="table-card">
              <div className="table-responsive">
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th style={{ width: "60px", textAlign: "center" }}>Sl. No.</th>
                      <th>Student Name</th>
                      <th>USN</th>
                      <th>Student Email</th>
                      <th>Event Name</th>
                      <th>Registration Date</th>
                      <th style={{ textAlign: "center" }}>Booking Status</th>
                      <th style={{ textAlign: "center" }}>Attendance Status</th>
                      <th style={{ textAlign: "center" }}>Attendance Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegistrations.map((reg, index) => {
                      const isCancelled = reg.bookingStatus === "CANCELLED";
                      const isAttended = reg.attended;
                      const isActionBusy = actionLoadingId === reg.bookingId;

                      const formattedDate = reg.bookedAt
                        ? new Date(reg.bookedAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—";

                      return (
                        <tr key={reg.bookingId} className={isCancelled ? "row-cancelled" : isAttended ? "row-attended" : ""}>
                          {/* Sl. No. */}
                          <td style={{ textAlign: "center", fontWeight: "600", color: "#64748b" }}>
                            {index + 1}
                          </td>

                          {/* Student Name */}
                          <td>
                            <div className="student-cell">
                              <div className="student-avatar">
                                {(reg.studentName || "U").charAt(0).toUpperCase()}
                              </div>
                              <span className="student-name-text">{reg.studentName}</span>
                            </div>
                          </td>

                          {/* USN */}
                          <td>
                            <span className="usn-tag">{reg.usn || "N/A"}</span>
                          </td>

                          {/* Student Email */}
                          <td className="email-cell">{reg.studentEmail}</td>

                          {/* Event Name */}
                          <td className="event-name-cell">{reg.eventTitle}</td>

                          {/* Registration Date */}
                          <td className="date-cell">{formattedDate}</td>

                          {/* Booking Status */}
                          <td style={{ textAlign: "center" }}>
                            <span className={`badge-booking ${isCancelled ? "booking-cancelled" : "booking-confirmed"}`}>
                              {reg.bookingStatus || "CONFIRMED"}
                            </span>
                          </td>

                          {/* Attendance Status */}
                          <td style={{ textAlign: "center" }}>
                            {isAttended ? (
                              <div className="attendance-status-wrap">
                                <span className="status-badge-attended">
                                  ✓ Attended
                                </span>
                                {reg.checkedInAt && (
                                  <small className="checkin-time-subtext">
                                    {new Date(reg.checkedInAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  </small>
                                )}
                              </div>
                            ) : (
                              <span className="status-badge-not-attended">
                                Not Attended
                              </span>
                            )}
                          </td>

                          {/* Attendance Action */}
                          <td style={{ textAlign: "center" }}>
                            {isCancelled ? (
                              <button className="btn-action-cancelled" disabled title="Booking has been cancelled">
                                Cancelled
                              </button>
                            ) : isAttended ? (
                              <button className="btn-action-done" disabled title="Attendance already recorded">
                                Attended ✓
                              </button>
                            ) : (
                              <button
                                className="btn-mark-attended"
                                onClick={() => confirmMarkAttended(reg)}
                                disabled={isActionBusy}
                                title="Click to verify check-in and mark attendance"
                              >
                                {isActionBusy ? "Saving…" : "Mark Attended"}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="table-footer-summary">
                <span>
                  Showing <strong>{filteredRegistrations.length}</strong> of <strong>{registrations.length}</strong> registrations
                </span>
                <span className="footer-legend">
                  <span className="legend-item"><span className="legend-dot green"></span> Attended</span>
                  <span className="legend-item"><span className="legend-dot grey"></span> Not Attended</span>
                </span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Confirmation Modal for Marking Attendance */}
      {confirmModal && (
        <div className="modal-backdrop" onClick={() => setConfirmModal(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">✅</div>
            <h3>Confirm Check-In</h3>
            <p>
              Are you sure you want to mark <strong>{confirmModal.studentName}</strong> (USN: <code>{confirmModal.usn}</code>) as <strong>Attended</strong>?
            </p>
            <p className="modal-subtext">
              This confirms the student has physically checked in for this event.
            </p>
            <div className="modal-actions">
              <button className="modal-btn-cancel" onClick={() => setConfirmModal(null)}>
                Cancel
              </button>
              <button className="modal-btn-confirm" onClick={executeMarkAttended}>
                Confirm & Mark Attended
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
