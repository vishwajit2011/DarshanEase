const express = require("express");

const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
} = require("../controllers/bookingController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a booking
router.post("/", protect, createBooking);

// Get logged-in user's bookings
router.get("/my", protect, getMyBookings);

// Get all bookings - Admin only
router.get(
  "/",
  protect,
  authorize("ADMIN"),
  getAllBookings
);

// Get a single booking
router.get("/:id", protect, getBookingById);

// Cancel a booking
router.put("/:id/cancel", protect, cancelBooking);

module.exports = router;