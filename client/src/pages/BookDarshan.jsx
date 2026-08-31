import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function BookDarshan() {
  const navigate = useNavigate();

  const [temples, setTemples] = useState([]);
  const [slots, setSlots] = useState([]);

  const [formData, setFormData] = useState({
    temple: "",
    darshanSlot: "",
    bookingDate: "",
    numberOfDevotees: 1,
  });

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templeResponse, slotResponse] =
          await Promise.all([
            api.get("/temples"),
            api.get("/darshan-slots"),
          ]);

        setTemples(
          templeResponse.data.temples || []
        );

        setSlots(
          slotResponse.data.slots || []
        );
      } catch (error) {
        console.error(
          "Booking page data error:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Could not load booking information"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    if (name === "temple") {
      setFormData((previousData) => ({
        ...previousData,
        temple: value,
        darshanSlot: "",
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setBooking(true);

    try {
      const response = await api.post(
        "/bookings",
        {
          temple: formData.temple,
          darshanSlot: formData.darshanSlot,
          bookingDate: formData.bookingDate,
          numberOfDevotees: Number(
            formData.numberOfDevotees
          ),
        }
      );

      console.log(
        "Booking response:",
        response.data
      );

      setSuccess(
        `Booking successful! Reference: ${
          response.data.booking?.bookingReference ||
          "Generated successfully"
        }`
      );

      setFormData({
        temple: "",
        darshanSlot: "",
        bookingDate: "",
        numberOfDevotees: 1,
      });
    } catch (error) {
      console.error(
        "Booking error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Booking failed. Please try again."
      );
    } finally {
      setBooking(false);
    }
  };

  const availableSlots = slots.filter(
    (slot) =>
      slot.isActive &&
      (!formData.temple ||
        slot.temple?._id === formData.temple ||
        slot.temple === formData.temple)
  );

  if (loading) {
    return (
      <div className="page">
        <h1>Book Darshan</h1>
        <p>Loading booking information...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Book Darshan</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="temple">
            Select Temple
          </label>

          <select
            id="temple"
            name="temple"
            value={formData.temple}
            onChange={handleChange}
            required
          >
            <option value="">
              Select a temple
            </option>

            {temples.map((temple) => (
              <option
                key={temple._id}
                value={temple._id}
              >
                {temple.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="darshanSlot">
            Select Darshan Slot
          </label>

          <select
            id="darshanSlot"
            name="darshanSlot"
            value={formData.darshanSlot}
            onChange={handleChange}
            required
            disabled={!formData.temple}
          >
            <option value="">
              Select a darshan slot
            </option>

            {availableSlots.map((slot) => (
              <option
                key={slot._id}
                value={slot._id}
              >
                {slot.startTime} - {slot.endTime}
                {" | "}
                Available:{" "}
                {slot.capacity - slot.bookedSeats}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="bookingDate">
            Booking Date
          </label>

          <input
            type="date"
            id="bookingDate"
            name="bookingDate"
            value={formData.bookingDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="numberOfDevotees">
            Number of Devotees
          </label>

          <input
            type="number"
            id="numberOfDevotees"
            name="numberOfDevotees"
            value={formData.numberOfDevotees}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <button
          type="submit"
          disabled={booking}
        >
          {booking
            ? "Booking..."
            : "Book Darshan"}
        </button>
      </form>

      {success && (
        <div>
          <p>{success}</p>

          <button
            type="button"
            onClick={() =>
              navigate("/my-bookings")
            }
          >
            View My Bookings
          </button>
        </div>
      )}

      {error && (
        <p>{error}</p>
      )}
    </div>
  );
}

export default BookDarshan;