import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDonations = async () => {
    try {
      setError("");

      const response = await api.get("/donations");

      console.log(
        "Admin donations:",
        response.data
      );

      setDonations(
        response.data.donations || []
      );
    } catch (error) {
      console.error(
        "Admin donations error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Could not load donations"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="page admin-donations-page">

        <div className="admin-page-header">

          <span className="section-label">
            ADMINISTRATION
          </span>

          <h1>
            Donation Management
          </h1>

          <p>
            View and manage temple donation
            records.
          </p>

        </div>

        <div className="admin-loading-card">

          <div className="admin-loading-icon">
            🙏
          </div>

          <h2>
            Loading donations...
          </h2>

          <p>
            Please wait while we fetch the
            latest donation information.
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
      <div className="page admin-donations-page">

        <div className="admin-page-header">

          <span className="section-label">
            ADMINISTRATION
          </span>

          <h1>
            Donation Management
          </h1>

          <p>
            View and manage temple donation
            records.
          </p>

        </div>

        <div className="status-card error-card">

          <div className="status-icon">
            ⚠️
          </div>

          <h2>
            Unable to load donations
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={() => {
              setLoading(true);
              fetchDonations();
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

  const totalDonations =
    donations.length;

  const successfulDonations =
    donations.filter(
      (donation) =>
        donation.paymentStatus ===
        "SUCCESS"
    ).length;

  const pendingDonations =
    donations.filter(
      (donation) =>
        donation.paymentStatus ===
        "PENDING"
    ).length;

  const failedDonations =
    donations.filter(
      (donation) =>
        donation.paymentStatus ===
        "FAILED"
    ).length;

  const totalAmount =
    donations.reduce(
      (total, donation) =>
        total +
        Number(donation.amount || 0),
      0
    );

  const successfulAmount =
    donations
      .filter(
        (donation) =>
          donation.paymentStatus ===
          "SUCCESS"
      )
      .reduce(
        (total, donation) =>
          total +
          Number(donation.amount || 0),
        0
      );

  return (
    <div className="page admin-donations-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="admin-page-header">

        <span className="section-label">
          ADMINISTRATION
        </span>

        <h1>
          Donation Management
        </h1>

        <p>
          View temple donations and payment
          information.
        </p>

      </div>


      {/* =========================
          STATISTICS
      ========================= */}

      <div className="donation-stat-grid">

        {/* TOTAL */}

        <div className="donation-stat-card">

          <div className="donation-stat-icon">
            🙏
          </div>

          <div>

            <span>
              Total Donations
            </span>

            <strong>
              {totalDonations}
            </strong>

          </div>

        </div>


        {/* SUCCESSFUL */}

        <div className="donation-stat-card">

          <div className="donation-stat-icon">
            ✅
          </div>

          <div>

            <span>
              Successful
            </span>

            <strong>
              {successfulDonations}
            </strong>

          </div>

        </div>


        {/* PENDING */}

        <div className="donation-stat-card">

          <div className="donation-stat-icon">
            🕐
          </div>

          <div>

            <span>
              Pending
            </span>

            <strong>
              {pendingDonations}
            </strong>

          </div>

        </div>


        {/* FAILED */}

        <div className="donation-stat-card">

          <div className="donation-stat-icon">
            ❌
          </div>

          <div>

            <span>
              Failed
            </span>

            <strong>
              {failedDonations}
            </strong>

          </div>

        </div>


        {/* TOTAL AMOUNT */}

        <div className="donation-stat-card">

          <div className="donation-stat-icon">
            💰
          </div>

          <div>

            <span>
              Total Amount
            </span>

            <strong>
              ₹
              {totalAmount.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

        </div>


        {/* SUCCESSFUL AMOUNT */}

        <div className="donation-stat-card">

          <div className="donation-stat-icon">
            💎
          </div>

          <div>

            <span>
              Successful Amount
            </span>

            <strong>
              ₹
              {successfulAmount.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

        </div>

      </div>


      {/* =========================
          DONATION RECORDS
      ========================= */}

      <section className="admin-donations-section">

        <div className="admin-section-heading">

          <div>

            <span className="section-label">
              DONATION RECORDS
            </span>

            <h2>
              All Donations
            </h2>

          </div>

          <span className="donation-count">
            {totalDonations}{" "}
            {totalDonations === 1
              ? "Donation"
              : "Donations"}
          </span>

        </div>


        {/* =========================
            EMPTY STATE
        ========================= */}

        {donations.length === 0 ? (

          <div className="status-card">

            <div className="status-icon">
              🙏
            </div>

            <h2>
              No donations found
            </h2>

            <p>
              There are currently no
              donation records.
            </p>

          </div>

        ) : (

          <div className="admin-donations-list">

            {donations.map(
              (donation) => {

                const isSuccess =
                  donation.paymentStatus ===
                  "SUCCESS";

                const isPending =
                  donation.paymentStatus ===
                  "PENDING";

                const isFailed =
                  donation.paymentStatus ===
                  "FAILED";

                return (

                  <article
                    className="admin-donation-card"
                    key={donation._id}
                  >

                    {/* =========================
                        CARD HEADER
                    ========================= */}

                    <div className="donation-card-header">

                      <div>

                        <span className="donation-reference-label">
                          DONATION REFERENCE
                        </span>

                        <h3>
                          {donation.donationReference ||
                            "N/A"}
                        </h3>

                      </div>


                      <span
                        className={
                          isSuccess
                            ? "donation-status success"
                            : isPending
                            ? "donation-status pending"
                            : isFailed
                            ? "donation-status failed"
                            : "donation-status"
                        }
                      >
                        {donation.paymentStatus ||
                          "UNKNOWN"}
                      </span>

                    </div>


                    {/* =========================
                        DONATION DETAILS
                    ========================= */}

                    <div className="donation-card-grid">

                      {/* USER */}

                      <div className="donation-info">

                        <span className="donation-info-label">
                          DONOR
                        </span>

                        <strong>
                          👤{" "}
                          {donation.user?.name ||
                            "N/A"}
                        </strong>

                      </div>


                      {/* EMAIL */}

                      <div className="donation-info">

                        <span className="donation-info-label">
                          EMAIL
                        </span>

                        <strong>
                          {donation.user?.email ||
                            "N/A"}
                        </strong>

                      </div>


                      {/* TEMPLE */}

                      <div className="donation-info">

                        <span className="donation-info-label">
                          TEMPLE
                        </span>

                        <strong>
                          🛕{" "}
                          {donation.temple?.name ||
                            "N/A"}
                        </strong>

                      </div>


                      {/* LOCATION */}

                      <div className="donation-info">

                        <span className="donation-info-label">
                          LOCATION
                        </span>

                        <strong>
                          {donation.temple
                            ? `${donation.temple.city || ""}${
                                donation.temple.city &&
                                donation.temple.state
                                  ? ", "
                                  : ""
                              }${
                                donation.temple.state ||
                                ""
                              }`
                            : "N/A"}
                        </strong>

                      </div>


                      {/* AMOUNT */}

                      <div className="donation-info">

                        <span className="donation-info-label">
                          DONATION AMOUNT
                        </span>

                        <strong className="donation-amount">
                          ₹
                          {Number(
                            donation.amount ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>


                      {/* TRANSACTION */}

                      <div className="donation-info">

                        <span className="donation-info-label">
                          TRANSACTION ID
                        </span>

                        <strong className="transaction-id">
                          {donation.transactionId ||
                            "N/A"}
                        </strong>

                      </div>


                      {/* DATE */}

                      <div className="donation-info">

                        <span className="donation-info-label">
                          DONATION DATE
                        </span>

                        <strong>
                          📅{" "}
                          {donation.createdAt
                            ? new Date(
                                donation.createdAt
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

                    </div>


                    {/* =========================
                        FOOTER
                    ========================= */}

                    <div className="donation-card-footer">

                      <span>
                        Donation ID:{" "}
                        {donation._id}
                      </span>

                      {isSuccess && (
                        <span className="donation-footer-success">
                          ✓ Payment Successful
                        </span>
                      )}

                      {isPending && (
                        <span className="donation-footer-pending">
                          ⏳ Payment Pending
                        </span>
                      )}

                      {isFailed && (
                        <span className="donation-footer-failed">
                          ✕ Payment Failed
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

export default AdminDonations;