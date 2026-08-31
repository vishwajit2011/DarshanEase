import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Register() {
    const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
    const response = await api.post(
  "/auth/register",
  formData
);

console.log("Registration response:", response.data);

login(
  response.data.token,
  response.data.user
);

setMessage(response.data.message);

setFormData({
  name: "",
  email: "",
  password: "",
});
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>

        <div>
          <label htmlFor="name">
            Name
          </label>

          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>

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
            placeholder="Create a password"
            minLength="6"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

      </form>

      {message && (
        <p>{message}</p>
      )}

      {error && (
        <p>{error}</p>
      )}
    </div>
  );
}

export default Register;