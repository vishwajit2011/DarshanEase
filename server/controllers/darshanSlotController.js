const DarshanSlot = require("../models/DarshanSlot");
const Temple = require("../models/Temple");

// Get all active slots for a temple
const getDarshanSlots = async (req, res) => {
  try {
    const { templeId } = req.query;

    const filter = {
      isActive: true,
    };

    if (templeId) {
      filter.temple = templeId;
    }

    const slots = await DarshanSlot.find(filter)
      .populate("temple", "name city state")
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: slots.length,
      slots,
    });
  } catch (error) {
    console.error("Get darshan slots error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching darshan slots",
    });
  }
};

// Get a single slot
const getDarshanSlotById = async (req, res) => {
  try {
    const slot = await DarshanSlot.findOne({
      _id: req.params.id,
      isActive: true,
    }).populate("temple", "name city state");

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Darshan slot not found",
      });
    }

    res.status(200).json({
      success: true,
      slot,
    });
  } catch (error) {
    console.error("Get darshan slot error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching darshan slot",
    });
  }
};

// Create a darshan slot
const createDarshanSlot = async (req, res) => {
  try {
    const {
      temple,
      date,
      startTime,
      endTime,
      capacity,
    } = req.body;

    // Check temple exists
    const templeExists = await Temple.findOne({
      _id: temple,
      isActive: true,
    });

    if (!templeExists) {
      return res.status(404).json({
        success: false,
        message: "Active temple not found",
      });
    }

    const slot = await DarshanSlot.create({
      temple,
      date,
      startTime,
      endTime,
      capacity,
    });

    const populatedSlot = await DarshanSlot.findById(slot._id)
      .populate("temple", "name city state");

    res.status(201).json({
      success: true,
      message: "Darshan slot created successfully",
      slot: populatedSlot,
    });
  } catch (error) {
    console.error("Create darshan slot error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid temple ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating darshan slot",
    });
  }
};

// Update a darshan slot
const updateDarshanSlot = async (req, res) => {
  try {
    const slot = await DarshanSlot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Darshan slot not found",
      });
    }

    const {
      date,
      startTime,
      endTime,
      capacity,
      isActive,
    } = req.body;

    slot.date = date ?? slot.date;
    slot.startTime = startTime ?? slot.startTime;
    slot.endTime = endTime ?? slot.endTime;
    slot.capacity = capacity ?? slot.capacity;
    slot.isActive = isActive ?? slot.isActive;

    if (slot.capacity < slot.bookedSeats) {
      return res.status(400).json({
        success: false,
        message: "Capacity cannot be less than booked seats",
      });
    }

    await slot.save();

    const updatedSlot = await DarshanSlot.findById(slot._id)
      .populate("temple", "name city state");

    res.status(200).json({
      success: true,
      message: "Darshan slot updated successfully",
      slot: updatedSlot,
    });
  } catch (error) {
    console.error("Update darshan slot error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid darshan slot ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating darshan slot",
    });
  }
};

// Deactivate a darshan slot
const deleteDarshanSlot = async (req, res) => {
  try {
    const slot = await DarshanSlot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Darshan slot not found",
      });
    }

    slot.isActive = false;

    await slot.save();

    res.status(200).json({
      success: true,
      message: "Darshan slot deactivated successfully",
    });
  } catch (error) {
    console.error("Delete darshan slot error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while deactivating darshan slot",
    });
  }
};

module.exports = {
  getDarshanSlots,
  getDarshanSlotById,
  createDarshanSlot,
  updateDarshanSlot,
  deleteDarshanSlot,
};