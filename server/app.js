require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const templeRoutes = require("./routes/templeRoutes");
const darshanSlotRoutes = require("./routes/darshanSlotRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const donationRoutes = require("./routes/donationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// =====================================================
// DATABASE CONNECTION
// =====================================================

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error);

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(morgan("dev"));

// =====================================================
// UPLOADED IMAGES
// =====================================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// =====================================================
// AUTHENTICATION ROUTES
// =====================================================

app.use(
  "/api/auth",
  authRoutes
);

// =====================================================
// TEMPLE ROUTES
// =====================================================

app.use(
  "/api/temples",
  templeRoutes
);

// =====================================================
// DARSHAN SLOT ROUTES
// =====================================================

app.use(
  "/api/darshan-slots",
  darshanSlotRoutes
);

// =====================================================
// BOOKING ROUTES
// =====================================================

app.use(
  "/api/bookings",
  bookingRoutes
);

// =====================================================
// DONATION ROUTES
// =====================================================

app.use(
  "/api/donations",
  donationRoutes
);

// =====================================================
// DASHBOARD ROUTES
// =====================================================

app.use(
  "/api/dashboard",
  dashboardRoutes
);

// =====================================================
// MAIN API
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to DarshanEase API",
  });
});

// =====================================================
// TEST API
// =====================================================

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message:
      "React successfully connected to DarshanEase backend",
  });
});

// =====================================================
// 404
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message:
      `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error("Global error:", err);

  res.status(err.status || 500).json({
    success: false,
    message:
      err.message ||
      "Internal server error",
  });
});

module.exports = app;