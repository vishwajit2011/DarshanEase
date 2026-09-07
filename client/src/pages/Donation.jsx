import { useEffect, useState } from "react";
import api from "../services/api";

function Donation() {
  const [temples, setTemples] = useState([]);
  const [selectedTemple, setSelectedTemple] = useState("");
  const [amount, setAmount] = useState("");

  const [loadingTemples, setLoadingTemples] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [completedDonation, setCompletedDonation] =
    useState(null);

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        setError("");

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
        setLoadingTemples(false);
      }
    };

    fetchTemples();
  }, []);

  const handleDonation = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setCompletedDonation(null);

    const donationAmount = Number(amount);

    if (!selectedTemple) {
      setError("Please select a temple.");
      return;
    }

    if (
      !donationAmount ||
      donationAmount <= 0
    ) {
      setError(
        "Please enter a donation amount greater than 0."
      );
      return;
    }

    try {
      setSubmitting(true);

      // =========================
      // CREATE DONATION
      // =========================

      const createResponse =
        await api.post("/donations", {
          temple: selectedTemple,
          amount: donationAmount,
        });

      const donation =
        createResponse.data.donation;

      if (!donation?._id) {
        throw new Error(
          "Donation was created but no donation ID was returned."
        );
      }

      // =========================
      // PROCESS TEST PAYMENT
      // =========================

      const paymentResponse =
        await api.put(
          `/donations/${donation._id}/pay`
        );

      const paidDonation =
        paymentResponse.data.donation;

      setCompletedDonation(
        paidDonation || donation
      );

      setSuccess(
        paymentResponse.data.message ||
          "Donation successful!"
      );

      setAmount("");
      setSelectedTemple("");
    } catch (error) {
      console.error(
        "Donation error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Could not process donation."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loadingTemples) {
    return (
      <div className="page">
        <div className="page-header">
          <span className="section-label">
            SUPPORT SACRED PLACES
          </span>

          <h1>
            Make a Donation
          </h1>

          <p>
            Loading temples...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-header">
        <span className="section-label">
          SUPPORT SACRED PLACES
        </span>

        <h1>
          Make a Donation
        </h1>

        <p>
          Your contribution helps support
          temples and their spiritual
          activities.
        </p>
      </div>

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="status-card error-card">
          <div className="status-icon">
            ⚠️
          </div>

          <h2>
            Donation Failed
          </h2>

          <p>
            {error}
          </p>
        </div>
      )}

      {/* =========================
          SUCCESS
      ========================= */}

      {success &&
        completedDonation && (
          <div className="status-card">
            <div className="status-icon">
              🙏
            </div>

            <h2>
              Donation Successful
            </h2>

            <p>
              {success}
            </p>

            <hr />

            <p>
              <strong>
                Donation Reference:
              </strong>{" "}
              {completedDonation.donationReference ||
                "N/A"}
            </p>

            <p>
              <strong>
                Temple:
              </strong>{" "}
              {completedDonation.temple?.name ||
                "N/A"}
            </p>

            <p>
              <strong>
                Amount:
              </strong>{" "}
              ₹
              {Number(
                completedDonation.amount || 0
              ).toLocaleString("en-IN")}
            </p>

            <p>
              <strong>
                Payment Status:
              </strong>{" "}
              {completedDonation.paymentStatus ||
                "N/A"}
            </p>

            <p>
              <strong>
                Transaction ID:
              </strong>{" "}
              {completedDonation.transactionId ||
                "N/A"}
            </p>
          </div>
        )}

      {/* =========================
          DONATION FORM
      ========================= */}

      <div className="status-card">
        <form onSubmit={handleDonation}>
          {/* TEMPLE */}

          <div className="form-group">
            <label htmlFor="temple">
              Select Temple
            </label>

            <select
              id="temple"
              value={selectedTemple}
              onChange={(event) =>
                setSelectedTemple(
                  event.target.value
                )
              }
              disabled={submitting}
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
                  {temple.city
                    ? ` - ${temple.city}`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          {/* AMOUNT */}

          <div className="form-group">
            <label htmlFor="amount">
              Donation Amount
            </label>

            <input
              id="amount"
              type="number"
              min="1"
              step="1"
              placeholder="Enter amount"
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
              disabled={submitting}
              required
            />
          </div>

          {/* QUICK AMOUNTS */}

          <div className="form-group">
            <label>
              Quick Amount
            </label>

            <div>
              {[101, 501, 1001, 5001].map(
                (quickAmount) => (
                  <button
                    key={quickAmount}
                    type="button"
                    onClick={() =>
                      setAmount(
                        String(quickAmount)
                      )
                    }
                    disabled={submitting}
                  >
                    ₹{quickAmount}
                  </button>
                )
              )}
            </div>
          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Processing Donation..."
              : "Donate Now"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Donation;