import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically attach JWT token
// and handle JSON/FormData requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(
      "darshanEaseToken"
    );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    // =========================
    // Handle FormData uploads
    // =========================
    //
    // When sending FormData, DO NOT manually
    // set Content-Type.
    //
    // The browser/Axios will automatically
    // create:
    //
    // multipart/form-data; boundary=...
    //
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] =
        "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;