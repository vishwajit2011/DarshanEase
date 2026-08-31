import { useEffect, useState } from "react";
import api from "../services/api";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(
          "/auth/profile"
        );

        console.log(
          "Profile response:",
          response.data
        );

        setUser(response.data.user);
      } catch (error) {
        console.error(
          "Profile error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Could not load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="page profile-page">

        <div className="user-page-header">

          <span className="section-label">
            ACCOUNT
          </span>

          <h1>
            My Profile
          </h1>

          <p>
            Loading your account information...
          </p>

        </div>

        <div className="user-loading-card">

          <div className="user-loading-icon">
            👤
          </div>

          <h2>
            Loading profile...
          </h2>

          <p>
            Please wait while we retrieve
            your profile information.
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
      <div className="page profile-page">

        <div className="user-page-header">

          <span className="section-label">
            ACCOUNT
          </span>

          <h1>
            My Profile
          </h1>

        </div>

        <div className="status-card error-card">

          <div className="status-icon">
            ⚠️
          </div>

          <h2>
            Unable to load profile
          </h2>

          <p>
            {error}
          </p>

        </div>

      </div>
    );
  }

  const userName =
    user?.name || "User";

  const userEmail =
    user?.email || "N/A";

  const userRole =
    user?.role || "USER";

  // Create initials for avatar
  const initials =
    userName
      .split(" ")
      .filter(Boolean)
      .map(
        (name) =>
          name.charAt(0).toUpperCase()
      )
      .slice(0, 2)
      .join("") || "U";

  const isAdmin =
    userRole === "ADMIN";

  return (
    <div className="page profile-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="user-page-header">

        <span className="section-label">
          ACCOUNT
        </span>

        <h1>
          My Profile
        </h1>

        <p>
          View your DarshanEase account
          information.
        </p>

      </div>


      {/* =========================
          PROFILE CARD
      ========================= */}

      <section className="profile-main-card">

        {/* PROFILE HERO */}

        <div className="profile-hero">

          <div className="profile-avatar">
            {initials}
          </div>

          <div className="profile-hero-info">

            <span className="profile-welcome">
              WELCOME
            </span>

            <h2>
              {userName}
            </h2>

            <p>
              {userEmail}
            </p>

          </div>

          <span
            className={
              isAdmin
                ? "profile-role admin-role"
                : "profile-role user-role"
            }
          >
            {isAdmin
              ? "ADMIN"
              : "DEVOTEE"}
          </span>

        </div>


        {/* PROFILE INFORMATION */}

        <div className="profile-information">

          <div className="profile-section-title">

            <span className="section-label">
              PERSONAL INFORMATION
            </span>

            <h3>
              Account Details
            </h3>

          </div>


          <div className="profile-details-grid">

            {/* NAME */}

            <div className="profile-detail-card">

              <div className="profile-detail-icon">
                👤
              </div>

              <div>

                <span>
                  FULL NAME
                </span>

                <strong>
                  {userName}
                </strong>

              </div>

            </div>


            {/* EMAIL */}

            <div className="profile-detail-card">

              <div className="profile-detail-icon">
                ✉️
              </div>

              <div>

                <span>
                  EMAIL ADDRESS
                </span>

                <strong>
                  {userEmail}
                </strong>

              </div>

            </div>


            {/* ROLE */}

            <div className="profile-detail-card">

              <div className="profile-detail-icon">
                🛡️
              </div>

              <div>

                <span>
                  ACCOUNT ROLE
                </span>

                <strong>
                  {userRole}
                </strong>

              </div>

            </div>


            {/* ACCOUNT STATUS */}

            <div className="profile-detail-card">

              <div className="profile-detail-icon">
                ✓
              </div>

              <div>

                <span>
                  ACCOUNT STATUS
                </span>

                <strong className="profile-active">
                  Active
                </strong>

              </div>

            </div>

          </div>

        </div>


        {/* FOOTER */}

        <div className="profile-footer">

          <div>

            <span>
              DARSHANEASE ACCOUNT
            </span>

            <p>
              Your spiritual journey,
              managed with ease.
            </p>

          </div>

          <div className="profile-footer-icon">
            🛕
          </div>

        </div>

      </section>

    </div>
  );
}

export default Profile;