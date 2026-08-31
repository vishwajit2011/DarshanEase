const express = require("express");

const {
  getDashboardStats,
} = require("../controllers/dashboardController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Admin dashboard statistics
router.get(
  "/stats",
  protect,
  authorize("ADMIN"),
  getDashboardStats
);

module.exports = router;