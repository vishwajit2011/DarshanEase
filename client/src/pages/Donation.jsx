import { useEffect, useState } from "react";
import api from "../services/api";

function MyDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await api.get(
          "/donations/my"
        );

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
            "Could not load donations"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <h1>My Donations</h1>
        <p>Loading donations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1>My Donations</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>My Donations</h1>

      {donations.length === 0 ? (
        <p>
          You haven't made any donations yet.
        </p>
      ) : (
        <div>
          {donations.map((donation) => (
            <div key={donation._id}>

              <h2>
                {donation.donationReference}
              </h2>

              <p>
                <strong>Temple:</strong>{" "}
                {donation.temple?.name ||
                  "N/A"}
              </p>

              <p>
                <strong>Amount:</strong>{" "}
                ₹{donation.amount}
              </p>

              <p>
                <strong>Payment Status:</strong>{" "}
                {donation.paymentStatus}
              </p>

              <p>
                <strong>
                  Transaction ID:
                </strong>{" "}
                {donation.transactionId ||
                  "Not available"}
              </p>

              <p>
                <strong>
                  Donation Date:
                </strong>{" "}
                {donation.createdAt
                  ? new Date(
                      donation.createdAt
                    ).toLocaleDateString()
                  : "N/A"}
              </p>

              <hr />

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyDonations;