import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("darshanEaseToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Handle FormData uploads
    // Browser/Axios automatically sets the correct
    // multipart/form-data boundary for FormData.
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;