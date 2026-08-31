import { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import api from "../services/api";

function TempleDetails() {
  const { id } = useParams();

  const [temple, setTemple] =
    useState(null);

  const [selectedImage, setSelectedImage] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================
  // Fetch Temple
  // =========================

  useEffect(() => {
    const fetchTemple = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get(
            `/temples/${id}`
          );

        setTemple(
          response.data.temple
        );

        setSelectedImage(0);
      } catch (error) {
        console.error(
          "Temple details error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Could not load temple details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTemple();
    }
  }, [id]);

  // =========================
  // Image URL
  // =========================

  const getImageUrl = (
    image
  ) => {
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

    return `${baseURL.replace(
      "/api",
      ""
    )}${image}`;
  };

  // =========================
  // Get All Images
  // =========================

  const getTempleImages = () => {
    if (!temple) {
      return [];
    }

    if (
      temple.images &&
      temple.images.length > 0
    ) {
      return temple.images;
    }

    if (temple.image) {
      return [
        temple.image,
      ];
    }

    return [];
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="temple-details-status">

        <div className="temple-loading-icon">
          🛕
        </div>

        <h2>
          Loading Temple...
        </h2>

        <p>
          Please wait while we
          prepare the temple details.
        </p>

      </div>
    );
  }

  // =========================
  // Error
  // =========================

  if (
    error ||
    !temple
  ) {
    return (
      <div className="temple-details-status">

        <div className="temple-error-icon">
          ⚠️
        </div>

        <h2>
          Temple Not Found
        </h2>

        <p>
          {error ||
            "The requested temple could not be found."}
        </p>

        <Link
          to="/temples"
          className="temple-back-button"
        >
          ← Back to Temples
        </Link>

      </div>
    );
  }

  const images =
    getTempleImages();

  const currentImage =
    images[
      selectedImage
    ];

  return (
    <div className="temple-details-page">

      {/* =========================
          TOP HEADER
      ========================= */}

      <div className="temple-details-topbar">

        <Link
          to="/temples"
          className="temple-details-back"
        >
          ← Back to Temples
        </Link>

        <span>
          🛕 DARSHANEASE
        </span>

      </div>

      {/* =========================
          IMAGE SECTION
      ========================= */}

      <section className="temple-gallery-section">

        <div className="temple-main-image-wrapper">

          {currentImage ? (

            <img
              src={getImageUrl(
                currentImage
              )}
              alt={
                temple.name
              }
              className="temple-main-image"
            />

          ) : (

            <div className="temple-main-placeholder">
              🛕
            </div>

          )}

          <div className="temple-image-counter">
            {images.length > 0
              ? `${selectedImage + 1} / ${images.length}`
              : "No image"}
          </div>

        </div>

        {/* =========================
            THUMBNAILS
        ========================= */}

        {images.length >
          1 && (

          <div className="temple-thumbnail-container">

            <div className="temple-thumbnail-scroll">

              {images.map(
                (
                  image,
                  index
                ) => (

                  <button
                    type="button"
                    key={`${image}-${index}`}
                    className={
                      selectedImage ===
                      index
                        ? "temple-thumbnail active"
                        : "temple-thumbnail"
                    }
                    onClick={() =>
                      setSelectedImage(
                        index
                      )
                    }
                  >

                    <img
                      src={getImageUrl(
                        image
                      )}
                      alt={`${temple.name} ${
                        index + 1
                      }`}
                    />

                  </button>

                )
              )}

            </div>

          </div>
        )}

      </section>

      {/* =========================
          TEMPLE HEADER
      ========================= */}

      <section className="temple-details-heading">

        <span className="section-label">
          ✦ SACRED TEMPLE
        </span>

        <h1>
          {temple.name}
        </h1>

        <p className="temple-heading-location">
          📍 {temple.location},{" "}
          {temple.city},{" "}
          {temple.state}
        </p>

      </section>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <section className="temple-details-content">

        <main className="temple-description-area">

          <span className="section-label">
            ABOUT THE TEMPLE
          </span>

          <h2>
            A Sacred Place of Devotion
          </h2>

          <div className="temple-full-description">

            {temple.description
              .split("\n")
              .map(
                (
                  paragraph,
                  index
                ) => (

                  <p
                    key={index}
                  >
                    {paragraph ||
                      "\u00A0"}
                  </p>

                )
              )}

          </div>

        </main>

        {/* =========================
            SIDE INFORMATION
        ========================= */}

        <aside className="temple-details-sidebar">

          <div className="temple-info-panel">

            <div className="temple-info-item">

              <div className="temple-info-icon">
                📍
              </div>

              <div>

                <span>
                  LOCATION
                </span>

                <strong>
                  {
                    temple.location ||
                      "Not available"
                  }
                </strong>

                <small>
                  {
                    temple.city
                  }
                  ,{" "}
                  {
                    temple.state
                  }
                </small>

              </div>

            </div>

            <div className="temple-info-item">

              <div className="temple-info-icon">
                🕐
              </div>

              <div>

                <span>
                  TEMPLE TIMINGS
                </span>

                <strong>
                  {temple.timings ||
                    "Not available"}
                </strong>

              </div>

            </div>

            <div className="temple-info-item">

              <div className="temple-info-icon">
                🛕
              </div>

              <div>

                <span>
                  STATUS
                </span>

                <strong>
                  {temple.isActive
                    ? "Currently Active"
                    : "Currently Inactive"}
                </strong>

              </div>

            </div>

            <div className="temple-info-item">

              <div className="temple-info-icon">
                📸
              </div>

              <div>

                <span>
                  GALLERY
                </span>

                <strong>
                  {images.length}{" "}
                  image
                  {images.length !==
                  1
                    ? "s"
                    : ""}
                </strong>

              </div>

            </div>

          </div>

          {/* =========================
              VISIT PANEL
          ========================= */}

          <div className="temple-action-panel">

            <span>
              PLAN YOUR VISIT
            </span>

            <h3>
              Ready for Darshan?
            </h3>

            <p>
              Check available
              darshan slots and
              plan your spiritual
              journey.
            </p>

            <Link
              to="/darshan-slots"
              className="temple-darshan-button"
            >
              View Darshan Slots
              <span>→</span>
            </Link>

            <Link
              to="/donation"
              className="temple-donation-button"
            >
              Make a Donation
            </Link>

          </div>

        </aside>

      </section>

      {/* =========================
          BOTTOM BACK BUTTON
      ========================= */}

      <div className="temple-details-bottom">

        <Link
          to="/temples"
          className="temple-bottom-back"
        >
          ← Explore More Temples
        </Link>

      </div>

    </div>
  );
}

export default TempleDetails;