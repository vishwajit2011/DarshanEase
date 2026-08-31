import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDarshanSlots() {
  const [slots, setSlots] = useState([]);
  const [temples, setTemples] = useState([]);

  const [formData, setFormData] = useState({
    temple: "",
    date: "",
    startTime: "",
    endTime: "",
    capacity: 0,
  });

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    try {
      const [slotResponse, templeResponse] =
        await Promise.all([
          api.get("/darshan-slots"),
          api.get("/temples"),
        ]);

      setSlots(slotResponse.data.slots || []);
      setTemples(templeResponse.data.temples || []);
    } catch (error) {
      console.error(
        "Darshan slots loading error:",
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]:
        name === "capacity"
          ? Number(value)
          : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      temple: "",
      date: "",
      startTime: "",
      endTime: "",
      capacity: 0,
    });

    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setSaving(true);

    try {
      if (editingId) {
        const response = await api.put(
          `/darshan-slots/${editingId}`,
          formData
        );

        setMessage(
          response.data.message ||
            "Darshan slot updated successfully"
        );
      } else {
        const response = await api.post(
          "/darshan-slots",
          formData
        );

        setMessage(
          response.data.message ||
            "Darshan slot created successfully"
        );
      }

      resetForm();
      await fetchData();
    } catch (error) {
      console.error(
        "Darshan slot save error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Could not save darshan slot"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (slot) => {
    setMessage("");
    setError("");

    setEditingId(slot._id);

    setFormData({
      temple:
        slot.temple?._id ||
        slot.temple ||
        "",
      date: slot.date
        ? new Date(slot.date)
            .toISOString()
            .split("T")[0]
        : "",
      startTime: slot.startTime || "",
      endTime: slot.endTime || "",
      capacity: slot.capacity || 0,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (slotId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this darshan slot?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");
    setDeletingId(slotId);

    try {
      const response = await api.delete(
        `/darshan-slots/${slotId}`
      );

      setMessage(
        response.data.message ||
          "Darshan slot deleted successfully"
      );

      if (editingId === slotId) {
        resetForm();
      }

      await fetchData();
    } catch (error) {
      console.error(
        "Darshan slot delete error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Could not delete darshan slot"
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <h1>Darshan Slot Management</h1>
        <p>Loading darshan slots...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Darshan Slot Management</h1>

      <section>
        <h2>
          {editingId
            ? "Edit Darshan Slot"
            : "Add Darshan Slot"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="temple">
              Temple
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
            <label htmlFor="date">
              Date
            </label>

            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="startTime">
              Start Time
            </label>

            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="endTime">
              End Time
            </label>

            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="capacity">
              Capacity
            </label>

            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingId
              ? "Update Slot"
              : "Create Slot"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              disabled={saving}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </section>

      {message && <p>{message}</p>}

      {error && <p>{error}</p>}

      <section>
        <h2>Existing Darshan Slots</h2>

        {slots.length === 0 ? (
          <p>No darshan slots found.</p>
        ) : (
          <div>
            {slots.map((slot) => (
              <div key={slot._id}>
                <h3>
                  {slot.temple?.name ||
                    "Temple"}
                </h3>

                <p>
                  Date:{" "}
                  {slot.date
                    ? new Date(
                        slot.date
                      ).toLocaleDateString()
                    : "N/A"}
                </p>

                <p>
                  Time:{" "}
                  {slot.startTime} -{" "}
                  {slot.endTime}
                </p>

                <p>
                  Capacity:{" "}
                  {slot.capacity}
                </p>

                <p>
                  Booked:{" "}
                  {slot.bookedSeats || 0}
                </p>

                <p>
                  Available:{" "}
                  {(slot.capacity || 0) -
                    (slot.bookedSeats || 0)}
                </p>

                <p>
                  Status:{" "}
                  {slot.isActive
                    ? "Active"
                    : "Inactive"}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    handleEdit(slot)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(slot._id)
                  }
                  disabled={
                    deletingId === slot._id
                  }
                >
                  {deletingId === slot._id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDarshanSlots;