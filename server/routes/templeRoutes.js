const express = require("express");

const {
  getTemples,
  getTempleById,
  createTemple,
  updateTemple,
  deleteTemple,
} = require("../controllers/templeController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const upload = require(
  "../middleware/uploadMiddleware"
);

const router = express.Router();

// =========================
// Public Routes
// =========================

router.get(
  "/",
  getTemples
);

router.get(
  "/:id",
  getTempleById
);

// =========================
// Create Temple
// =========================

router.post(
  "/",
  protect,
  authorize("ADMIN", "ORGANIZER"),
  upload.array("images", 8),
  createTemple
);

// =========================
// Update Temple
// =========================

router.put(
  "/:id",
  protect,
  authorize("ADMIN", "ORGANIZER"),
  upload.array("images", 8),
  updateTemple
);

// =========================
// Delete Temple
// =========================

router.delete(
  "/:id",
  protect,
  authorize("ADMIN"),
  deleteTemple
);

module.exports = router;