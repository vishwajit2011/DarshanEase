const express = require("express");

const {
  createDonation,
  processTestPayment,
  getMyDonations,
  getAllDonations,
  updateDonationStatus,
} = require("../controllers/donationController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Create donation
router.post(
  "/",
  protect,
  createDonation
);

// Get logged-in user's donations
router.get(
  "/my",
  protect,
  getMyDonations
);

// Process test payment
router.put(
  "/:id/pay",
  protect,
  processTestPayment
);

// Update donation payment status - Admin only
router.put(
  "/:id/status",
  protect,
  authorize("ADMIN"),
  updateDonationStatus
);

// Get all donations - Admin only
router.get(
  "/",
  protect,
  authorize("ADMIN"),
  getAllDonations
);

module.exports = router;