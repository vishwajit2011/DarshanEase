import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../services/api";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const {
      password,
      confirmPassword,
    } = formData;

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters long."
      );

      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    setLoading(true);

    try {
      const response = await api.put(
        `/auth/reset-password/${token}`,
        {
          password,
        }
      );

      setSuccess(
        response.data.message ||
          "Password reset successfully."
      );

      setFormData({
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 3000);

    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Could not reset your password. The reset link may be invalid or expired."
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

        <h1>Reset Password</h1>

        <p>
          Create a new password for your
          DarshanEase account.
        </p>
      </div>

      <div
        style={{
          maxWidth: "520px",
          margin: "40px auto",
          padding: "32px",
          background: "#ffffff",
          borderRadius: "16px",
          boxShadow:
            "0 10px 30px rgba(0, 0, 0, 0.08)",
        }}
      >

        <form onSubmit={handleSubmit}>

          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              New Password
            </label>

            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              minLength="6"
              required
              disabled={loading}
              autoComplete="new-password"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "13px 15px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "15px",
              }}
            />
          </div>

          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label
              htmlFor="confirmPassword"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Confirm New Password
            </label>

            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={
                formData.confirmPassword
              }
              onChange={handleChange}
              placeholder="Confirm new password"
              minLength="6"
              required
              disabled={loading}
              autoComplete="new-password"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "13px 15px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "15px",
              }}
            />
          </div>

          {error && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px 15px",
                borderRadius: "8px",
                background: "#fee2e2",
                color: "#991b1b",
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
                background: "#dcfce7",
                color: "#166534",
                lineHeight: "1.6",
              }}
            >
              <strong>
                Password Updated
              </strong>

              <p
                style={{
                  margin: "6px 0 0",
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
                Redirecting you to the login
                page...
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !!success}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "8px",
              background: "#7c3aed",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "600",
              cursor:
                loading || success
                  ? "not-allowed"
                  : "pointer",
              opacity:
                loading || success
                  ? 0.7
                  : 1,
            }}
          >
            {loading
              ? "Resetting Password..."
              : "Reset Password"}
          </button>

        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "24px",
          }}
        >
          <Link
            to="/login"
            style={{
              color: "#7c3aed",
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

export default ResetPassword;