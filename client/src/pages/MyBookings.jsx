import { useEffect, useState } from "react";
import api from "../services/api";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] =
    useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchBookings = async () => {
    try {
      setError("");

      const response =
        await api.get("/bookings/my");

      console.log(
        "My bookings:",
        response.data
      );

      setBookings(
        response.data.bookings || []
      );
    } catch (error) {
      console.error(
        "My bookings error:",
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
    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this booking?"
      );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");
    setCancellingId(bookingId);

    try {
      const response =
        await api.put(
          `/bookings/${bookingId}/cancel`
        );

      console.log(
        "Cancel booking response:",
        response.data
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
      <div className="page my-bookings-page">

        <div className="user-page-header">

          <span className="section-label">
            YOUR JOURNEY
          </span>

          <h1>
            My Bookings
          </h1>

          <p>
            Loading your darshan bookings...
          </p>

        </div>

        <div className="user-loading-card">

          <div className="user-loading-icon">
            🛕
          </div>

          <h2>
            Loading bookings...
          </h2>

          <p>
            Please wait while we retrieve
            your booking information.
          </p>

        </div>

      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (
    error &&
    bookings.length === 0
  ) {
    return (
      <div className="page my-bookings-page">

        <div className="user-page-header">

          <span className="section-label">
            YOUR JOURNEY
          </span>

          <h1>
            My Bookings
          </h1>

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
  // STATISTICS
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
    <div className="page my-bookings-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="user-page-header">

        <span className="section-label">
          YOUR JOURNEY
        </span>

        <h1>
          My Bookings
        </h1>

        <p>
          Manage your temple darshan
          bookings and view your visit
          details.
        </p>

      </div>


      {/* =========================
          MESSAGE
      ========================= */}

      {message && (
        <div className="booking-success-message">

          <span>
            ✓
          </span>

          <p>
            {message}
          </p>

        </div>
      )}


      {error && (
        <div className="booking-error-message">

          <span>
            ⚠️
          </span>

          <p>
            {error}
          </p>

        </div>
      )}


      {/* =========================
          SUMMARY
      ========================= */}

      <div className="booking-summary-grid">

        <div className="booking-summary-card">

          <div className="booking-summary-icon">
            🛕
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


        <div className="booking-summary-card">

          <div className="booking-summary-icon">
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


        <div className="booking-summary-card">

          <div className="booking-summary-icon">
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
          BOOKING RECORDS
      ========================= */}

      <section className="my-bookings-section">

        <div className="my-bookings-section-header">

          <div>

            <span className="section-label">
              DARSHAN RECORDS
            </span>

            <h2>
              Your Bookings
            </h2>

          </div>

          <span className="booking-count">
            {totalBookings}{" "}
            {totalBookings === 1
              ? "Booking"
              : "Bookings"}
          </span>

        </div>


        {/* =========================
            EMPTY STATE
        ========================= */}

        {bookings.length === 0 ? (

          <div className="status-card">

            <div className="status-icon">
              🛕
            </div>

            <h2>
              No bookings yet
            </h2>

            <p>
              You haven't made any darshan
              bookings yet.
            </p>

          </div>

        ) : (

          <div className="my-bookings-list">

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
                    className={`my-booking-card ${
                      isCancelled
                        ? "booking-cancelled"
                        : ""
                    }`}
                    key={booking._id}
                  >

                    {/* =========================
                        HEADER
                    ========================= */}

                    <div className="my-booking-header">

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
                        TEMPLE
                    ========================= */}

                    <div className="booking-temple-box">

                      <div className="booking-temple-icon">
                        🛕
                      </div>

                      <div>

                        <span>
                          TEMPLE
                        </span>

                        <h2>
                          {booking.temple?.name ||
                            "Temple information unavailable"}
                        </h2>

                        <p>
                          📍{" "}
                          {booking.temple?.city ||
                            "N/A"}

                          {booking.temple?.state
                            ? `, ${booking.temple.state}`
                            : ""}
                        </p>

                      </div>

                    </div>


                    {/* =========================
                        BOOKING INFORMATION
                    ========================= */}

                    <div className="my-booking-details">

                      <div className="my-booking-detail">

                        <span>
                          📅 BOOKING DATE
                        </span>

                        <strong>
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


                      <div className="my-booking-detail">

                        <span>
                          🕐 DARSHAN TIME
                        </span>

                        <strong>
                          {booking.darshanSlot
                            ? `${booking.darshanSlot.startTime} - ${booking.darshanSlot.endTime}`
                            : "N/A"}
                        </strong>

                      </div>


                      <div className="my-booking-detail">

                        <span>
                          👥 DEVOTEES
                        </span>

                        <strong>
                          {booking.numberOfDevotees ||
                            0}
                        </strong>

                      </div>


                      <div className="my-booking-detail">

                        <span>
                          📍 LOCATION
                        </span>

                        <strong>
                          {booking.temple?.city ||
                            "N/A"}

                          {booking.temple?.state
                            ? `, ${booking.temple.state}`
                            : ""}
                        </strong>

                      </div>

                    </div>


                    {/* =========================
                        FOOTER
                    ========================= */}

                    <div className="my-booking-footer">

                      <span className="booking-id">
                        Booking ID:{" "}
                        {booking._id}
                      </span>


                      {isConfirmed && (
                        <button
                          type="button"
                          className="cancel-booking-button"
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
                        <span className="cancelled-message">
                          ✕ Booking Cancelled
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

export default MyBookings;