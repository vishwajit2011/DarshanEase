import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { isAuthenticated, user } = useAuth();

  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="home-page">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-badge">
            <span>✦</span>
            Spiritual Journey Made Simple
          </div>

          <h1>
            Your Journey to
            <span> Divine Darshan </span>
            Starts Here
          </h1>

          <p className="hero-description">
            Discover sacred temples, explore available
            darshan slots, and book your spiritual visit
            with ease.
          </p>

          <div className="hero-actions">

            <Link
              to="/temples"
              className="primary-button"
            >
              Explore Temples
              <span>→</span>
            </Link>

            {!isAuthenticated && (
              <Link
                to="/login"
                className="secondary-button"
              >
                Login to Book
              </Link>
            )}

            {isAuthenticated && !isAdmin && (
              <Link
                to="/book-darshan"
                className="secondary-button"
              >
                Book Darshan
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="secondary-button"
              >
                Admin Dashboard
              </Link>
            )}

          </div>

          {/* Hero trust information */}

          <div className="hero-trust">

            <div className="hero-trust-item">
              <span>🛕</span>
              <div>
                <strong>Sacred Temples</strong>
                <small>Explore divine places</small>
              </div>
            </div>

            <div className="hero-trust-divider"></div>

            <div className="hero-trust-item">
              <span>🎟️</span>
              <div>
                <strong>Easy Booking</strong>
                <small>Simple & convenient</small>
              </div>
            </div>

          </div>

        </div>


        {/* =================================================
            HERO VISUAL
        ================================================= */}

        <div className="hero-visual">

          <div className="hero-circle hero-circle-one"></div>

          <div className="hero-circle hero-circle-two"></div>

          <div className="temple-glow">
            <div className="temple-symbol">
              🛕
            </div>

            <span>
              ॐ
            </span>
          </div>


          <div className="floating-card card-one">
            <span className="floating-icon">
              🪔
            </span>

            <div>
              <strong>
                Sacred Experience
              </strong>

              <small>
                Begin your journey
              </small>
            </div>
          </div>


          <div className="floating-card card-two">
            <span className="floating-icon">
              🙏
            </span>

            <div>
              <strong>
                Easy Booking
              </strong>

              <small>
                Plan with peace
              </small>
            </div>
          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURES SECTION
      ===================================================== */}

      <section className="features-section">

        <div className="section-heading">

          <span>
            WHY DARSHANEASE
          </span>

          <h2>
            Everything You Need for
            <br />
            Your Temple Visit
          </h2>

          <p>
            A simple and convenient way to plan
            your spiritual journey.
          </p>

        </div>


        <div className="feature-grid">

          {/* Explore Temples */}

          <div className="feature-card">

            <div className="feature-card-top">
              <div className="feature-icon">
                🛕
              </div>

              <span className="feature-number">
                01
              </span>
            </div>

            <h3>
              Explore Temples
            </h3>

            <p>
              Discover temples and learn about
              their location, details, history,
              and spiritual significance.
            </p>

            <Link to="/temples">
              Explore
              <span>→</span>
            </Link>

          </div>


          {/* Darshan Slots */}

          <div className="feature-card">

            <div className="feature-card-top">
              <div className="feature-icon">
                🕐
              </div>

              <span className="feature-number">
                02
              </span>
            </div>

            <h3>
              Darshan Slots
            </h3>

            <p>
              Check available darshan timings
              and seats before planning your
              temple visit.
            </p>

            <Link to="/darshan-slots">
              View Slots
              <span>→</span>
            </Link>

          </div>


          {/* Easy Booking */}

          <div className="feature-card">

            <div className="feature-card-top">
              <div className="feature-icon">
                🎟️
              </div>

              <span className="feature-number">
                03
              </span>
            </div>

            <h3>
              Easy Booking
            </h3>

            <p>
              Select your temple and preferred
              slot and complete your booking
              in just a few simple steps.
            </p>

            {isAuthenticated && !isAdmin ? (
              <Link to="/book-darshan">
                Book Now
                <span>→</span>
              </Link>
            ) : (
              <Link to="/login">
                Login to Book
                <span>→</span>
              </Link>
            )}

          </div>


          {/* Support Temples */}

          <div className="feature-card">

            <div className="feature-card-top">
              <div className="feature-icon">
                ❤️
              </div>

              <span className="feature-number">
                04
              </span>
            </div>

            <h3>
              Support Temples
            </h3>

            <p>
              Make a contribution and support
              temples and their spiritual
              activities.
            </p>

            {isAuthenticated && !isAdmin ? (
              <Link to="/donation">
                Donate
                <span>→</span>
              </Link>
            ) : (
              <Link to="/login">
                Login to Donate
                <span>→</span>
              </Link>
            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section className="how-it-works">

        <div className="section-heading">

          <span>
            SIMPLE & PEACEFUL
          </span>

          <h2>
            Plan Your Darshan in
            <br />
            Three Simple Steps
          </h2>

          <p>
            From discovering a temple to completing
            your booking, everything is simple.
          </p>

        </div>


        <div className="steps-grid">

          <div className="step-card">

            <div className="step-number">
              01
            </div>

            <div className="step-icon">
              🛕
            </div>

            <h3>
              Choose a Temple
            </h3>

            <p>
              Explore sacred temples and
              select the one you wish to visit.
            </p>

          </div>


          <div className="step-connector">
            →
          </div>


          <div className="step-card">

            <div className="step-number">
              02
            </div>

            <div className="step-icon">
              🕐
            </div>

            <h3>
              Select a Slot
            </h3>

            <p>
              Check available timings and
              choose a convenient darshan slot.
            </p>

          </div>


          <div className="step-connector">
            →
          </div>


          <div className="step-card">

            <div className="step-number">
              03
            </div>

            <div className="step-icon">
              🎟️
            </div>

            <h3>
              Book Your Darshan
            </h3>

            <p>
              Confirm your visit and prepare
              for a peaceful spiritual experience.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA SECTION
      ===================================================== */}

      <section className="home-cta">

        <div className="home-cta-content">

          <span>
            YOUR SPIRITUAL JOURNEY AWAITS
          </span>

          <h2>
            Plan Your Next Darshan Today
          </h2>

          <p>
            Find a temple, choose a slot,
            and experience a peaceful
            spiritual journey.
          </p>

        </div>

        <Link
          to="/temples"
          className="primary-button"
        >
          Find a Temple
          <span>→</span>
        </Link>

      </section>

    </div>
  );
}

export default Home;