import { useEffect, useState } from "react";
import api from "../services/api";

function DarshanSlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response =
          await api.get("/darshan-slots");

        setSlots(
          response.data.slots || []
        );
      } catch (error) {
        console.error(
          "Darshan slots error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Could not load darshan slots"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <span className="section-label">
            DARSHAN AVAILABILITY
          </span>

          <h1>Darshan Slots</h1>

          <p>
            Loading available slots...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="page-header">
          <span className="section-label">
            DARSHAN AVAILABILITY
          </span>

          <h1>Darshan Slots</h1>
        </div>

        <div className="status-card error-card">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">

      <div className="page-header">
        <span className="section-label">
          DARSHAN AVAILABILITY
        </span>

        <h1>Available Darshan Slots</h1>

        <p>
          Choose a convenient time for
          your temple visit.
        </p>
      </div>

      {slots.length === 0 ? (
        <div className="status-card">
          <div className="status-icon">
            🕐
          </div>

          <h2>
            No darshan slots available
          </h2>

          <p>
            Please check again later for
            available timings.
          </p>
        </div>
      ) : (
        <div className="slot-grid">

          {slots.map((slot) => {
            const availableSeats =
              Math.max(
                0,
                slot.capacity -
                  slot.bookedSeats
              );

            const isAvailable =
              slot.isActive &&
              availableSeats > 0;

            return (
              <article
                className="slot-card"
                key={slot._id}
              >

                <div className="slot-card-top">

                  <div className="slot-icon">
                    🕐
                  </div>

                  <span
                    className={
                      isAvailable
                        ? "slot-status available"
                        : "slot-status unavailable"
                    }
                  >
                    {isAvailable
                      ? "Available"
                      : "Full"}
                  </span>

                </div>

                <h2>
                  {slot.startTime}{" "}
                  -{" "}
                  {slot.endTime}
                </h2>

                <p className="slot-date">
                  📅{" "}
                  {slot.date
                    ? new Date(
                        slot.date
                      ).toLocaleDateString()
                    : "Date not specified"}
                </p>

                <div className="slot-details">

                  <div>
                    <span>
                      Capacity
                    </span>

                    <strong>
                      {slot.capacity}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Booked
                    </span>

                    <strong>
                      {slot.bookedSeats}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Available
                    </span>

                    <strong
                      className={
                        isAvailable
                          ? "available-number"
                          : ""
                      }
                    >
                      {availableSeats}
                    </strong>
                  </div>

                </div>

                <div className="slot-card-footer">

                  <span>
                    {slot.temple?.name ||
                      "Temple"}
                  </span>

                  <span>
                    {slot.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>

                </div>

              </article>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default DarshanSlots;