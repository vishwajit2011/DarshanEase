import { useEffect, useState } from "react";
import api from "../services/api";

function AdminTemples() {
  const [temples, setTemples] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    city: "",
    state: "",
    timings: "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // =========================================================
  // FETCH TEMPLES
  // =========================================================

  const fetchTemples = async () => {
    try {
      setError("");

      const response = await api.get("/temples");

      setTemples(response.data.temples || []);
    } catch (error) {
      console.error("Temples error:", error);

      setError(
        error.response?.data?.message ||
          "Could not load temples"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemples();
  }, []);

  // =========================================================
  // HANDLE TEXT INPUT
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // =========================================================
  // HANDLE MULTIPLE IMAGE UPLOAD
  // =========================================================

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);

    setError("");

    if (files.length === 0) {
      return;
    }

    // Maximum 8 images
    if (files.length > 8) {
      setError(
        "You can upload a maximum of 8 images at once."
      );

      event.target.value = "";
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    // Validate every image
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setError(
          `Invalid file "${file.name}". Only JPG, JPEG, PNG and WEBP images are allowed.`
        );

        event.target.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError(
          `Image "${file.name}" is larger than 5 MB.`
        );

        event.target.value = "";
        return;
      }
    }

    // Save selected files
    setImageFiles(files);

    // Create preview URLs
    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreviews(previews);
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      location: "",
      city: "",
      state: "",
      timings: "",
    });

    setImageFiles([]);
    setImagePreviews([]);
    setEditingId(null);
    setError("");

    const imageInput = document.getElementById("images");

    if (imageInput) {
      imageInput.value = "";
    }
  };

  // =========================================================
  // IMAGE URL
  // =========================================================

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    const baseURL =
      api.defaults.baseURL ||
      "http://localhost:5000/api";

    return `${baseURL.replace("/api", "")}${image}`;
  };

  // =========================================================
  // CREATE / UPDATE TEMPLE
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setSaving(true);

    try {
      const data = new FormData();

      // Text fields
      data.append("name", formData.name);
      data.append(
        "description",
        formData.description
      );
      data.append("location", formData.location);
      data.append("city", formData.city);
      data.append("state", formData.state);
      data.append("timings", formData.timings);

      // Multiple images
      imageFiles.forEach((file) => {
        data.append("images", file);
      });

      // UPDATE
      if (editingId) {
        const response = await api.put(
          `/temples/${editingId}`,
          data
        );

        setMessage(
          response.data.message ||
            "Temple updated successfully"
        );
      }

      // CREATE
      else {
        const response = await api.post(
          "/temples",
          data
        );

        setMessage(
          response.data.message ||
            "Temple created successfully"
        );
      }

      resetForm();

      await fetchTemples();
    } catch (error) {
      console.error(
        "Save temple error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Could not save temple"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // EDIT TEMPLE
  // =========================================================

  const handleEdit = (temple) => {
    setMessage("");
    setError("");

    setEditingId(temple._id);

    setFormData({
      name: temple.name || "",
      description: temple.description || "",
      location: temple.location || "",
      city: temple.city || "",
      state: temple.state || "",
      timings: temple.timings || "",
    });

    setImageFiles([]);
    setImagePreviews([]);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // DELETE TEMPLE
  // =========================================================

  const handleDelete = async (templeId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this temple?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");
    setDeletingId(templeId);

    try {
      const response = await api.delete(
        `/temples/${templeId}`
      );

      setMessage(
        response.data.message ||
          "Temple deleted successfully"
      );

      if (editingId === templeId) {
        resetForm();
      }

      await fetchTemples();
    } catch (error) {
      console.error(
        "Delete temple error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Could not delete temple"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="page admin-temple-page">
        <div className="admin-temple-loading">
          <div className="loading-icon">🛕</div>

          <h1>Temple Management</h1>

          <p>Loading temples...</p>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <div className="page admin-temple-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="admin-temple-header">
        <div>
          <span className="section-label">
            ADMINISTRATION
          </span>

          <h1>Temple Management</h1>

          <p>
            Add, edit and manage temples with
            complete information and multiple
            temple images.
          </p>
        </div>
      </div>

      {/* =====================================================
          SUCCESS / ERROR MESSAGE
      ===================================================== */}

      {message && (
        <div className="admin-alert admin-success">
          <span>✓</span>
          <p>{message}</p>
        </div>
      )}

      {error && (
        <div className="admin-alert admin-error">
          <span>!</span>
          <p>{error}</p>
        </div>
      )}

      {/* =====================================================
          ADD / EDIT TEMPLE
      ===================================================== */}

      <section className="admin-temple-form-section">

        <div className="admin-section-heading">
          <div className="admin-section-icon">
            🛕
          </div>

          <div>
            <span className="admin-small-label">
              TEMPLE INFORMATION
            </span>

            <h2>
              {editingId
                ? "Edit Temple"
                : "Add Temple"}
            </h2>

            <p>
              Enter the temple details below.
            </p>
          </div>
        </div>

        <form
          className="admin-temple-form"
          onSubmit={handleSubmit}
        >

          {/* =================================================
              TEMPLE NAME
          ================================================= */}

          <div className="admin-form-group admin-full-width">
            <label htmlFor="name">
              Temple Name
            </label>

            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter temple name"
              required
            />
          </div>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="admin-form-group admin-full-width">
            <label htmlFor="description">
              Temple Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter complete temple description..."
              rows="10"
              required
            />

            <small>
              You can enter a detailed description
              including history, importance,
              architecture, festivals and other
              information.
            </small>
          </div>

          {/* =================================================
              LOCATION
          ================================================= */}

          <div className="admin-form-group">
            <label htmlFor="location">
              Location
            </label>

            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter temple location"
              required
            />
          </div>

          {/* =================================================
              CITY
          ================================================= */}

          <div className="admin-form-group">
            <label htmlFor="city">
              City
            </label>

            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
              required
            />
          </div>

          {/* =================================================
              STATE
          ================================================= */}

          <div className="admin-form-group">
            <label htmlFor="state">
              State
            </label>

            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter state"
              required
            />
          </div>

          {/* =================================================
              TIMINGS
          ================================================= */}

          <div className="admin-form-group">
            <label htmlFor="timings">
              Temple Timings
            </label>

            <input
              type="text"
              id="timings"
              name="timings"
              value={formData.timings}
              onChange={handleChange}
              placeholder="Example: 6:00 AM - 10:00 PM"
            />
          </div>

          {/* =================================================
              IMAGE UPLOAD
          ================================================= */}

          <div className="admin-form-group admin-full-width">

            <label htmlFor="images">
              Temple Images
            </label>

            <div className="admin-upload-box">

              <div className="admin-upload-icon">
                📸
              </div>

              <h3>
                Upload Temple Images
              </h3>

              <p>
                Select multiple images at once.
              </p>

              <input
                type="file"
                id="images"
                name="images"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handleImageChange}
              />

              <label
                htmlFor="images"
                className="admin-upload-button"
              >
                Choose Images
              </label>

              <p className="admin-upload-help">
                Maximum 8 images • Maximum 5 MB
                per image • JPG, JPEG, PNG or WEBP
              </p>

            </div>

            {/* IMAGE COUNT */}

            {imageFiles.length > 0 && (
              <div className="admin-selected-count">
                <span>✓</span>

                <strong>
                  {imageFiles.length}
                </strong>

                image
                {imageFiles.length !== 1
                  ? "s"
                  : ""}{" "}
                selected
              </div>
            )}

            {/* IMAGE PREVIEWS */}

            {imagePreviews.length > 0 && (
              <div className="admin-image-preview-section">

                <h3>
                  Selected Images
                </h3>

                <div className="admin-image-preview-grid">

                  {imagePreviews.map(
                    (preview, index) => (
                      <div
                        className="admin-image-preview"
                        key={preview}
                      >
                        <img
                          src={preview}
                          alt={`Temple preview ${
                            index + 1
                          }`}
                        />

                        <span>
                          Image {index + 1}
                        </span>
                      </div>
                    )
                  )}

                </div>
              </div>
            )}

          </div>

          {/* =================================================
              FORM BUTTONS
          ================================================= */}

          <div className="admin-form-actions">

            <button
              type="submit"
              disabled={saving}
              className="admin-primary-button"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Temple"
                : "Create Temple"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="admin-secondary-button"
              >
                Cancel Edit
              </button>
            )}

          </div>

        </form>
      </section>

      {/* =====================================================
          EXISTING TEMPLES
      ===================================================== */}

      <section className="admin-existing-temples">

        <div className="admin-section-heading">

          <div className="admin-section-icon">
            🛕
          </div>

          <div>
            <span className="admin-small-label">
              MANAGE TEMPLES
            </span>

            <h2>
              Existing Temples
            </h2>

            <p>
              View and manage all temples in
              your system.
            </p>
          </div>

        </div>

        {temples.length === 0 ? (

          <div className="admin-no-temples">

            <div className="no-temple-icon">
              🛕
            </div>

            <h2>
              No Temples Found
            </h2>

            <p>
              Create your first temple using
              the form above.
            </p>

          </div>

        ) : (

          <div className="admin-temple-grid">

            {temples.map((temple) => {

              const templeImages =
                temple.images &&
                temple.images.length > 0
                  ? temple.images
                  : temple.image
                  ? [temple.image]
                  : [];

              return (
                <article
                  className="admin-temple-card"
                  key={temple._id}
                >

                  {/* TEMPLE IMAGE */}

                  <div className="admin-card-image-wrapper">

                    {templeImages.length > 0 ? (

                      <img
                        src={getImageUrl(
                          templeImages[0]
                        )}
                        alt={temple.name}
                        className="admin-temple-image"
                      />

                    ) : (

                      <div className="admin-temple-placeholder">
                        🛕
                      </div>

                    )}

                    <span
                      className={
                        temple.isActive
                          ? "admin-status-badge active"
                          : "admin-status-badge inactive"
                      }
                    >
                      {temple.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </div>

                  {/* CARD CONTENT */}

                  <div className="admin-temple-content">

                    <h3>
                      {temple.name}
                    </h3>

                    <p className="admin-location">
                      📍{" "}
                      {temple.location ||
                        "Location not available"}
                    </p>

                    <p className="admin-city-state">
                      {temple.city},{" "}
                      {temple.state}
                    </p>

                    {temple.timings && (
                      <p className="admin-timings">
                        🕐 {temple.timings}
                      </p>
                    )}

                    <div className="admin-card-meta">

                      <span>
                        📸{" "}
                        {templeImages.length}{" "}
                        image
                        {templeImages.length !==
                        1
                          ? "s"
                          : ""}
                      </span>

                    </div>

                    <div className="admin-card-actions">

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(
                            temple
                          )
                        }
                        className="admin-edit-button"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            temple._id
                          )
                        }
                        disabled={
                          deletingId ===
                          temple._id
                        }
                        className="admin-delete-button"
                      >
                        {deletingId ===
                        temple._id
                          ? "Deleting..."
                          : "🗑 Delete"}
                      </button>

                    </div>

                  </div>

                </article>
              );
            })}

          </div>

        )}

      </section>

    </div>
  );
}

export default AdminTemples;