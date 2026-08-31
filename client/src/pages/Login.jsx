import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        formData
      );

      console.log(
        "Login response:",
        response.data
      );

      const { token, user } = response.data;

      login(token, user);

      navigate("/", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Login failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">

      <h1>Login</h1>

      <form onSubmit={handleSubmit}>

        {/* Email */}

        <div>
          <label htmlFor="email">
            Email
          </label>

          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>


        {/* Password */}

        <div>
          <label htmlFor="password">
            Password
          </label>

          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>


        {/* Forgot Password */}

        <div
          style={{
            textAlign: "right",
            marginTop: "8px",
            marginBottom: "15px",
          }}
        >
          <Link
            to="/forgot-password"
            style={{
              color: "#7c3aed",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            Forgot Password?
          </Link>
        </div>


        {/* Error */}

        {error && (
          <p>{error}</p>
        )}


        {/* Login */}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

      </form>

    </div>
  );
}

export default Login;