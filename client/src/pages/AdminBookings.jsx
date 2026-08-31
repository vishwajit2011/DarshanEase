import { useEffect, useState } from "react";
import api from "../services/api";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchBookings = async () => {
    try {
      setError("");

      const response = await api.get("/bookings");

      console.log(
        "Admin bookings:",
        response.data
      );

      setBookings(
        response.data.bookings || []
      );
    } catch (error) {
      console.error(
        "Admin bookings error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Could not load bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (
    bookingId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");
    setCancellingId(bookingId);

    try {
      const response = await api.put(
        `/bookings/${bookingId}/cancel`
      );

      setMessage(
        response.data.message ||
          "Booking cancelled successfully"
      );

      setBookings(
        (previousBookings) =>
          previousBookings.map(
            (booking) =>
              booking._id === bookingId
                ? {
                    ...booking,
                    bookingStatus:
                      "CANCELLED",
                  }
                : booking
          )
      );
    } catch (error) {
      console.error(
        "Cancel booking error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Could not cancel booking"
      );
    } finally {
      setCancellingId(null);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="page admin-bookings-page">
        <div className="admin-page-header">
          <span className="section-label">
            ADMINISTRATION
          </span>

          <h1>
            Booking Management
          </h1>

          <p>
            Manage devotee darshan bookings.
          </p>
        </div>

        <div className="admin-loading-card">
          <div className="admin-loading-icon">
            🎟️
          </div>

          <h2>
            Loading bookings...
          </h2>

          <p>
            Please wait while we fetch the
            latest booking information.
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // COMPLETE ERROR
  // =========================

  if (
    error &&
    bookings.length === 0
  ) {
    return (
      <div className="page admin-bookings-page">
        <div className="admin-page-header">
          <span className="section-label">
            ADMINISTRATION
          </span>

          <h1>
            Booking Management
          </h1>

          <p>
            Manage devotee darshan bookings.
          </p>
        </div>

        <div className="status-card error-card">
          <div className="status-icon">
            ⚠️
          </div>

          <h2>
            Unable to load bookings
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={() => {
              setLoading(true);
              fetchBookings();
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // COUNTS
  // =========================

  const totalBookings =
    bookings.length;

  const confirmedBookings =
    bookings.filter(
      (booking) =>
        booking.bookingStatus ===
        "CONFIRMED"
    ).length;

  const cancelledBookings =
    bookings.filter(
      (booking) =>
        booking.bookingStatus ===
        "CANCELLED"
    ).length;

  return (
    <div className="page admin-bookings-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="admin-page-header">

        <span className="section-label">
          ADMINISTRATION
        </span>

        <h1>
          Booking Management
        </h1>

        <p>
          View and manage all devotee
          darshan bookings.
        </p>

      </div>

      {/* =========================
          STATISTICS
      ========================= */}

      <div className="booking-stat-grid">

        <div className="booking-stat-card">

          <div className="booking-stat-icon">
            🎟️
          </div>

          <div>
            <span>
              Total Bookings
            </span>

            <strong>
              {totalBookings}
            </strong>
          </div>

        </div>

        <div className="booking-stat-card">

          <div className="booking-stat-icon">
            ✅
          </div>

          <div>
            <span>
              Confirmed
            </span>

            <strong>
              {confirmedBookings}
            </strong>
          </div>

        </div>

        <div className="booking-stat-card">

          <div className="booking-stat-icon">
            ❌
          </div>

          <div>
            <span>
              Cancelled
            </span>

            <strong>
              {cancelledBookings}
            </strong>
          </div>

        </div>

      </div>

      {/* =========================
          MESSAGES
      ========================= */}

      {message && (
        <div className="admin-success-message">
          <span>✓</span>

          <p>
            {message}
          </p>
        </div>
      )}

      {error && (
        <div className="admin-error-message">
          <span>⚠️</span>

          <p>
            {error}
          </p>
        </div>
      )}

      {/* =========================
          BOOKINGS
      ========================= */}

      <section className="admin-bookings-section">

        <div className="admin-section-heading">

          <div>
            <span className="section-label">
              BOOKING RECORDS
            </span>

            <h2>
              All Bookings
            </h2>
          </div>

          <span className="booking-count">
            {totalBookings}{" "}
            {totalBookings === 1
              ? "Booking"
              : "Bookings"}
          </span>

        </div>

        {bookings.length === 0 ? (
          <div className="status-card">

            <div className="status-icon">
              🎟️
            </div>

            <h2>
              No bookings found
            </h2>

            <p>
              There are currently no
              devotee bookings.
            </p>

          </div>
        ) : (
          <div className="admin-bookings-list">

            {bookings.map(
              (booking) => {

                const isConfirmed =
                  booking.bookingStatus ===
                  "CONFIRMED";

                const isCancelled =
                  booking.bookingStatus ===
                  "CANCELLED";

                return (
                  <article
                    className="admin-booking-card"
                    key={booking._id}
                  >

                    {/* =========================
                        CARD HEADER
                    ========================= */}

                    <div className="booking-card-header">

                      <div>

                        <span className="booking-reference-label">
                          BOOKING REFERENCE
                        </span>

                        <h3>
                          {booking.bookingReference ||
                            "N/A"}
                        </h3>

                      </div>

                      <span
                        className={
                          isConfirmed
                            ? "booking-status confirmed"
                            : isCancelled
                            ? "booking-status cancelled"
                            : "booking-status"
                        }
                      >
                        {booking.bookingStatus ||
                          "UNKNOWN"}
                      </span>

                    </div>

                    {/* =========================
                        USER INFORMATION
                    ========================= */}

                    <div className="booking-card-grid">

                      <div className="booking-info">

                        <span className="booking-info-label">
                          DEVOTEE
                        </span>

                        <strong>
                          👤{" "}
                          {booking.user?.name ||
                            "N/A"}
                        </strong>

                      </div>

                      <div className="booking-info">

                        <span className="booking-info-label">
                          EMAIL
                        </span>

                        <strong>
                          {booking.user?.email ||
                            "N/A"}
                        </strong>

                      </div>

                      <div className="booking-info">

                        <span className="booking-info-label">
                          TEMPLE
                        </span>

                        <strong>
                          🛕{" "}
                          {booking.temple?.name ||
                            "N/A"}
                        </strong>

                      </div>

                      <div className="booking-info">

                        <span className="booking-info-label">
                          DARSHAN DATE
                        </span>

                        <strong>
                          📅{" "}
                          {booking.bookingDate
                            ? new Date(
                                booking.bookingDate
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month:
                                    "short",
                                  year:
                                    "numeric",
                                }
                              )
                            : "N/A"}
                        </strong>

                      </div>

                      <div className="booking-info">

                        <span className="booking-info-label">
                          DARSHAN SLOT
                        </span>

                        <strong>
                          🕐{" "}
                          {booking.darshanSlot
                            ? `${booking.darshanSlot.startTime} - ${booking.darshanSlot.endTime}`
                            : "N/A"}
                        </strong>

                      </div>

                      <div className="booking-info">

                        <span className="booking-info-label">
                          DEVOTEES
                        </span>

                        <strong>
                          👥{" "}
                          {booking.numberOfDevotees ||
                            0}
                        </strong>

                      </div>

                    </div>

                    {/* =========================
                        CARD FOOTER
                    ========================= */}

                    <div className="booking-card-footer">

                      <span>
                        Booking ID:{" "}
                        {booking._id}
                      </span>

                      {isConfirmed && (
                        <button
                          type="button"
                          className="booking-cancel-button"
                          onClick={() =>
                            handleCancelBooking(
                              booking._id
                            )
                          }
                          disabled={
                            cancellingId ===
                            booking._id
                          }
                        >
                          {cancellingId ===
                          booking._id
                            ? "Cancelling..."
                            : "Cancel Booking"}
                        </button>
                      )}

                      {isCancelled && (
                        <span className="cancelled-label">
                          Booking Cancelled
                        </span>
                      )}

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

      </section>

    </div>
  );
}

export default AdminBookings;