import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardStats = async () => {
    try {
      setError("");

      const response = await api.get(
        "/dashboard/stats"
      );

      console.log(
        "Dashboard statistics:",
        response.data
      );

      setStats(
        response.data.statistics
      );
    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Could not load dashboard statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="page admin-dashboard-page">
        <div className="dashboard-loading">
          <div className="dashboard-loading-icon">
            🛕
          </div>

          <h2>
            Loading Dashboard...
          </h2>

          <p>
            Preparing your dashboard
            statistics.
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
      <div className="page admin-dashboard-page">

        <div className="dashboard-header">
          <span className="section-label">
            ADMINISTRATION
          </span>

          <h1>
            Admin Dashboard
          </h1>
        </div>

        <div className="status-card error-card">

          <div className="status-icon">
            ⚠️
          </div>

          <h2>
            Unable to load dashboard
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={
              fetchDashboardStats
            }
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="page admin-dashboard-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="dashboard-header">

        <div>
          <span className="section-label">
            ADMINISTRATION
          </span>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Welcome,{" "}
            <strong>
              {stats?.adminName ||
                "Administrator"}
            </strong>
          </p>
        </div>

        <div className="dashboard-header-icon">
          🛕
        </div>

      </div>

      {/* =========================
          OVERVIEW
      ========================= */}

      <section className="dashboard-section">

        <div className="dashboard-section-heading">

          <div>
            <span className="section-label">
              OVERVIEW
            </span>

            <h2>
              System Overview
            </h2>
          </div>

        </div>

        <div className="dashboard-stat-grid">

          {/* USERS */}

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon">
              👥
            </div>

            <div className="dashboard-stat-content">

              <span>
                Users
              </span>

              <strong>
                {stats?.users?.total ||
                  0}
              </strong>

              <Link to="/admin">
                View Dashboard →
              </Link>

            </div>

          </div>

          {/* TEMPLES */}

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon">
              🛕
            </div>

            <div className="dashboard-stat-content">

              <span>
                Temples
              </span>

              <strong>
                {stats?.temples?.total ||
                  0}
              </strong>

              <Link to="/admin/temples">
                Manage Temples →
              </Link>

            </div>

          </div>

          {/* DARSHAN SLOTS */}

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon">
              🕐
            </div>

            <div className="dashboard-stat-content">

              <span>
                Darshan Slots
              </span>

              <strong>
                {stats?.darshanSlots
                  ?.total || 0}
              </strong>

              <Link to="/admin/darshan-slots">
                Manage Slots →
              </Link>

            </div>

          </div>

          {/* BOOKINGS */}

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon">
              🎟️
            </div>

            <div className="dashboard-stat-content">

              <span>
                Bookings
              </span>

              <strong>
                {stats?.bookings?.total ||
                  0}
              </strong>

              <Link to="/admin/bookings">
                Manage Bookings →
              </Link>

            </div>

          </div>

          {/* DONATIONS */}

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon">
              🙏
            </div>

            <div className="dashboard-stat-content">

              <span>
                Donations
              </span>

              <strong>
                {stats?.donations?.total ||
                  0}
              </strong>

              <Link to="/admin/donations">
                Manage Donations →
              </Link>

            </div>

          </div>

          {/* DONATION AMOUNT */}

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon">
              💰
            </div>

            <div className="dashboard-stat-content">

              <span>
                Donation Amount
              </span>

              <strong>
                ₹
                {Number(
                  stats?.donations
                    ?.totalAmount || 0
                ).toLocaleString("en-IN")}
              </strong>

              <Link to="/admin/donations">
                View Donations →
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* =========================
          SUMMARY GRID
      ========================= */}

      <section className="dashboard-section">

        <div className="dashboard-section-heading">

          <div>
            <span className="section-label">
              ACTIVITY
            </span>

            <h2>
              System Summary
            </h2>
          </div>

        </div>

        <div className="dashboard-summary-grid">

          {/* BOOKING SUMMARY */}

          <div className="dashboard-summary-card">

            <div className="summary-card-header">

              <span className="summary-icon">
                🎟️
              </span>

              <h3>
                Booking Summary
              </h3>

            </div>

            <div className="summary-row">

              <span>
                Confirmed Bookings
              </span>

              <strong>
                {stats?.bookings
                  ?.confirmed || 0}
              </strong>

            </div>

            <div className="summary-row">

              <span>
                Cancelled Bookings
              </span>

              <strong>
                {stats?.bookings
                  ?.cancelled || 0}
              </strong>

            </div>

            <Link
              to="/admin/bookings"
              className="summary-link"
            >
              View All Bookings →
            </Link>

          </div>

          {/* TEMPLE SUMMARY */}

          <div className="dashboard-summary-card">

            <div className="summary-card-header">

              <span className="summary-icon">
                🛕
              </span>

              <h3>
                Temple Summary
              </h3>

            </div>

            <div className="summary-highlight">

              <strong>
                {stats?.temples
                  ?.active || 0}
              </strong>

              <span>
                Active Temples
              </span>

            </div>

            <Link
              to="/admin/temples"
              className="summary-link"
            >
              Manage Temples →
            </Link>

          </div>

          {/* SLOT SUMMARY */}

          <div className="dashboard-summary-card">

            <div className="summary-card-header">

              <span className="summary-icon">
                🕐
              </span>

              <h3>
                Darshan Slots
              </h3>

            </div>

            <div className="summary-highlight">

              <strong>
                {stats?.darshanSlots
                  ?.active || 0}
              </strong>

              <span>
                Active Slots
              </span>

            </div>

            <Link
              to="/admin/darshan-slots"
              className="summary-link"
            >
              Manage Slots →
            </Link>

          </div>

          {/* DONATION SUMMARY */}

          <div className="dashboard-summary-card">

            <div className="summary-card-header">

              <span className="summary-icon">
                🙏
              </span>

              <h3>
                Donation Summary
              </h3>

            </div>

            <div className="summary-row">

              <span>
                Successful Donations
              </span>

              <strong>
                {stats?.donations
                  ?.successful || 0}
              </strong>

            </div>

            <div className="summary-row">

              <span>
                Total Amount
              </span>

              <strong>
                ₹
                {Number(
                  stats?.donations
                    ?.totalAmount || 0
                ).toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <Link
              to="/admin/donations"
              className="summary-link"
            >
              View Donations →
            </Link>

          </div>

        </div>

      </section>

      {/* =========================
          QUICK ACTIONS
      ========================= */}

      <section className="dashboard-section">

        <div className="dashboard-section-heading">

          <div>
            <span className="section-label">
              QUICK ACTIONS
            </span>

            <h2>
              Manage DarshanEase
            </h2>
          </div>

        </div>

        <div className="dashboard-actions">

          <Link
            to="/admin/temples"
            className="dashboard-action"
          >
            <span>
              🛕
            </span>

            <div>
              <strong>
                Manage Temples
              </strong>

              <small>
                Add, edit or remove temples
              </small>
            </div>

            <span>
              →
            </span>
          </Link>

          <Link
            to="/admin/darshan-slots"
            className="dashboard-action"
          >
            <span>
              🕐
            </span>

            <div>
              <strong>
                Manage Slots
              </strong>

              <small>
                Create and manage darshan slots
              </small>
            </div>

            <span>
              →
            </span>
          </Link>

          <Link
            to="/admin/bookings"
            className="dashboard-action"
          >
            <span>
              🎟️
            </span>

            <div>
              <strong>
                Manage Bookings
              </strong>

              <small>
                View all devotee bookings
              </small>
            </div>

            <span>
              →
            </span>
          </Link>

          <Link
            to="/admin/donations"
            className="dashboard-action"
          >
            <span>
              🙏
            </span>

            <div>
              <strong>
                Manage Donations
              </strong>

              <small>
                View donation records
              </small>
            </div>

            <span>
              →
            </span>
          </Link>

        </div>

      </section>

    </div>
  );
}

export default AdminDashboard;