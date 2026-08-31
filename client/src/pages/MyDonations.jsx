import { useEffect, useState } from "react";
import api from "../services/api";

function MyDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDonations = async () => {
    try {
      setError("");

      const response =
        await api.get("/donations/my");

      console.log(
        "My donations:",
        response.data
      );

      setDonations(
        response.data.donations || []
      );
    } catch (error) {
      console.error(
        "My donations error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Could not load your donations"
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
      <div className="page my-donations-page">

        <div className="user-page-header">

          <span className="section-label">
            YOUR CONTRIBUTION
          </span>

          <h1>
            My Donations
          </h1>

          <p>
            Loading your donation history...
          </p>

        </div>

        <div className="user-loading-card">

          <div className="user-loading-icon">
            🙏
          </div>

          <h2>
            Loading donations...
          </h2>

          <p>
            Please wait while we retrieve
            your donation information.
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
      <div className="page my-donations-page">

        <div className="user-page-header">

          <span className="section-label">
            YOUR CONTRIBUTION
          </span>

          <h1>
            My Donations
          </h1>

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
    <div className="page my-donations-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="user-page-header">

        <span className="section-label">
          YOUR CONTRIBUTION
        </span>

        <h1>
          My Donations
        </h1>

        <p>
          View your temple donations and
          payment history.
        </p>

      </div>


      {/* =========================
          SUMMARY
      ========================= */}

      <div className="my-donation-summary-grid">

        {/* TOTAL DONATIONS */}

        <div className="my-donation-summary-card">

          <div className="my-donation-summary-icon">
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

        <div className="my-donation-summary-card">

          <div className="my-donation-summary-icon">
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

        <div className="my-donation-summary-card">

          <div className="my-donation-summary-icon">
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

        <div className="my-donation-summary-card">

          <div className="my-donation-summary-icon">
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

        <div className="my-donation-summary-card">

          <div className="my-donation-summary-icon">
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

        <div className="my-donation-summary-card">

          <div className="my-donation-summary-icon">
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

      <section className="my-donations-section">

        <div className="my-donations-section-header">

          <div>

            <span className="section-label">
              DONATION RECORDS
            </span>

            <h2>
              Your Donations
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
              No donations yet
            </h2>

            <p>
              You haven't made any donations
              yet.
            </p>

          </div>

        ) : (

          <div className="my-donations-list">

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
                    className="my-donation-card"
                    key={donation._id}
                  >

                    {/* =========================
                        HEADER
                    ========================= */}

                    <div className="my-donation-header">

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
                        TEMPLE
                    ========================= */}

                    <div className="my-donation-temple">

                      <div className="my-donation-temple-icon">
                        🛕
                      </div>

                      <div>

                        <span>
                          TEMPLE
                        </span>

                        <h2>
                          {donation.temple?.name ||
                            "Temple information unavailable"}
                        </h2>

                        <p>
                          📍{" "}
                          {donation.temple?.city ||
                            "N/A"}

                          {donation.temple?.state
                            ? `, ${donation.temple.state}`
                            : ""}
                        </p>

                      </div>

                    </div>


                    {/* =========================
                        DETAILS
                    ========================= */}

                    <div className="my-donation-details">

                      {/* AMOUNT */}

                      <div className="my-donation-detail">

                        <span>
                          💰 DONATION AMOUNT
                        </span>

                        <strong className="my-donation-amount">
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

                      <div className="my-donation-detail">

                        <span>
                          🔖 TRANSACTION ID
                        </span>

                        <strong className="my-transaction-id">
                          {donation.transactionId ||
                            "N/A"}
                        </strong>

                      </div>


                      {/* DATE */}

                      <div className="my-donation-detail">

                        <span>
                          📅 DONATION DATE
                        </span>

                        <strong>
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


                      {/* STATUS */}

                      <div className="my-donation-detail">

                        <span>
                          💳 PAYMENT STATUS
                        </span>

                        <strong
                          className={
                            isSuccess
                              ? "detail-status-success"
                              : isPending
                              ? "detail-status-pending"
                              : isFailed
                              ? "detail-status-failed"
                              : ""
                          }
                        >
                          {donation.paymentStatus ||
                            "UNKNOWN"}
                        </strong>

                      </div>

                    </div>


                    {/* =========================
                        FOOTER
                    ========================= */}

                    <div className="my-donation-footer">

                      <span className="donation-id">
                        Donation ID:{" "}
                        {donation._id}
                      </span>


                      {isSuccess && (
                        <span className="my-donation-success">
                          ✓ Payment Successful
                        </span>
                      )}

                      {isPending && (
                        <span className="my-donation-pending">
                          ⏳ Payment Pending
                        </span>
                      )}

                      {isFailed && (
                        <span className="my-donation-failed">
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

export default MyDonations;