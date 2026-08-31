const express = require("express");

const {
  getDarshanSlots,
  getDarshanSlotById,
  createDarshanSlot,
  updateDarshanSlot,
  deleteDarshanSlot,
} = require("../controllers/darshanSlotController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all active darshan slots
router.get("/", getDarshanSlots);

// Get a single darshan slot
router.get("/:id", getDarshanSlotById);

// Create darshan slot
router.post(
  "/",
  protect,
  authorize("ADMIN", "ORGANIZER"),
  createDarshanSlot
);

// Update darshan slot
router.put(
  "/:id",
  protect,
  authorize("ADMIN", "ORGANIZER"),
  updateDarshanSlot
);

// Deactivate darshan slot
router.delete(
  "/:id",
  protect,
  authorize("ADMIN", "ORGANIZER"),
  deleteDarshanSlot
);

module.exports = router;