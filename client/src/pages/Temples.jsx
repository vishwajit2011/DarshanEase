import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Temples() {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const response = await api.get("/temples");

        setTemples(
          response.data.temples || []
        );
      } catch (error) {
        console.error(
          "Temple loading error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Could not load temples"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTemples();
  }, []);

  // =========================
  // IMAGE URL
  // =========================

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

    return `${baseURL.replace(
      "/api",
      ""
    )}${image}`;
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="page">

        <div className="page-header">

          <span className="section-label">
            SACRED PLACES
          </span>

          <h1>
            Explore Temples
          </h1>

          <p>
            Loading temples...
          </p>

        </div>

      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="page">

        <div className="page-header">

          <span className="section-label">
            SACRED PLACES
          </span>

          <h1>
            Explore Temples
          </h1>

        </div>

        <div className="status-card error-card">

          <p>
            {error}
          </p>

        </div>

      </div>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <div className="page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-header">

        <span className="section-label">
          SACRED PLACES
        </span>

        <h1>
          Explore Temples
        </h1>

        <p>
          Discover sacred temples and
          plan your next spiritual
          journey.
        </p>

      </div>

      {/* =========================
          NO TEMPLES
      ========================= */}

      {temples.length === 0 ? (

        <div className="status-card">

          <div className="status-icon">
            🛕
          </div>

          <h2>
            No temples available
          </h2>

          <p>
            There are currently no
            active temples to display.
          </p>

        </div>

      ) : (

        /* =========================
           TEMPLE GRID
        ========================= */

        <div className="temple-grid">

          {temples.map(
            (temple) => {

              // Support both:
              // images[] and old image field

              const templeImage =
                temple.images &&
                temple.images.length > 0
                  ? temple.images[0]
                  : temple.image || "";

              return (
                <article
                  className="temple-card"
                  key={temple._id}
                >

                  {/* =========================
                      TEMPLE IMAGE
                  ========================= */}

                  <div className="temple-card-image">

                    {templeImage ? (

                      <img
                        src={getImageUrl(
                          templeImage
                        )}
                        alt={
                          temple.name
                        }
                      />

                    ) : (

                      <span>
                        🛕
                      </span>

                    )}

                    <span className="active-badge">
                      {temple.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </div>

                  {/* =========================
                      CONTENT
                  ========================= */}

                  <div className="temple-card-content">

                    <h2>
                      {temple.name}
                    </h2>

                    <p className="temple-location">
                      📍{" "}
                      {temple.city},{" "}
                      {temple.state}
                    </p>

                    <p>
                      {temple.description ||
                        "Experience the spiritual beauty and divine atmosphere of this sacred temple."}
                    </p>

                    {/* =========================
                        FOOTER
                    ========================= */}

                    <div className="temple-card-footer">

                      <span>
                        ✨ Sacred Temple
                      </span>

                      <Link
                        to={`/temples/${temple._id}`}
                        className="card-button"
                      >
                        View Details →
                      </Link>

                    </div>

                  </div>

                </article>
              );
            }
          )}

        </div>

      )}

    </div>
  );
}

export default Temples;