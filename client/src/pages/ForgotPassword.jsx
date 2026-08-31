import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/forgot-password",
        {
          email: email.trim(),
        }
      );

      setSuccess(
        response.data.message ||
          "If an account exists with this email, a password reset link has been sent."
      );

      setEmail("");
    } catch (error) {
      console.error(
        "Forgot password error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to process your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">

      <div className="page-header">

        <span className="section-label">
          ACCOUNT RECOVERY
        </span>

        <h1>Forgot Password?</h1>

        <p>
          Enter your registered email address
          and we will send you a secure
          password reset link.
        </p>

      </div>


      <div
        style={{
          maxWidth: "520px",
          margin: "40px auto",
          padding: "35px",
          background: "#171729",
          border: "1px solid #302f48",
          borderRadius: "18px",
          boxSizing: "border-box",
        }}
      >

        <form onSubmit={handleSubmit}>

          <div
            style={{
              marginBottom: "22px",
            }}
          >

            <label
              htmlFor="forgot-email"
              style={{
                display: "block",
                marginBottom: "9px",
                color: "#ffffff",
                fontWeight: "600",
              }}
            >
              Email Address
            </label>

            <input
              type="email"
              id="forgot-email"
              name="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your registered email"
              required
              disabled={loading}
              autoComplete="email"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "14px 16px",
                borderRadius: "9px",
                border: "1px solid #3b3a55",
                background: "#202038",
                color: "#ffffff",
                fontSize: "15px",
                outline: "none",
              }}
            />

          </div>


          {error && (
            <div
              style={{
                marginBottom: "20px",
                padding: "13px 15px",
                borderRadius: "8px",
                background: "#3b171c",
                border: "1px solid #7f1d1d",
                color: "#fca5a5",
                lineHeight: "1.5",
              }}
            >
              {error}
            </div>
          )}


          {success && (
            <div
              style={{
                marginBottom: "20px",
                padding: "15px",
                borderRadius: "8px",
                background: "#123522",
                border: "1px solid #166534",
                color: "#86efac",
                lineHeight: "1.6",
              }}
            >
              <strong>
                Request Submitted
              </strong>

              <p
                style={{
                  margin: "7px 0 0",
                }}
              >
                {success}
              </p>

              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: "14px",
                }}
              >
                Please check your inbox and
                spam folder.
              </p>
            </div>
          )}


          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "9px",
              background: "#7c3aed",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? "Sending Reset Link..."
              : "Send Reset Link"}
          </button>

        </form>


        <div
          style={{
            textAlign: "center",
            marginTop: "25px",
          }}
        >

          <Link
            to="/login"
            style={{
              color: "#a78bfa",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            ← Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;