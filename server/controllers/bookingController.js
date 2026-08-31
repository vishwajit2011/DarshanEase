const Booking = require("../models/Booking");
const DarshanSlot = require("../models/DarshanSlot");
const Temple = require("../models/Temple");

// Generate unique booking reference
const generateBookingReference = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(1000 + Math.random() * 9000);

  return `DE-${timestamp}-${random}`;
};

// Create a booking
const createBooking = async (req, res) => {
  try {
    const {
      temple,
      darshanSlot,
      bookingDate,
      numberOfDevotees,
    } = req.body;

    // Validate number of devotees
    if (!numberOfDevotees || numberOfDevotees < 1) {
      return res.status(400).json({
        success: false,
        message: "Number of devotees must be at least 1",
      });
    }

    // Check if temple exists and is active
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

    // Check if darshan slot exists and is active
    const slot = await DarshanSlot.findOne({
      _id: darshanSlot,
      isActive: true,
    });

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Active darshan slot not found",
      });
    }

    // Make sure slot belongs to selected temple
    if (slot.temple.toString() !== temple.toString()) {
      return res.status(400).json({
        success: false,
        message:
          "Darshan slot does not belong to the selected temple",
      });
    }

    // Check available seats
    const availableSeats =
      slot.capacity - slot.bookedSeats;

    if (numberOfDevotees > availableSeats) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableSeats} seats are available`,
      });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      temple,
      darshanSlot,
      bookingDate,
      numberOfDevotees,
      bookingStatus: "CONFIRMED",
      bookingReference: generateBookingReference(),
    });

    // Update booked seats
    slot.bookedSeats += numberOfDevotees;

    await slot.save();

    // Get complete booking information
    const populatedBooking =
      await Booking.findById(booking._id)
        .populate("user", "name email")
        .populate("temple", "name city state")
        .populate("darshanSlot");

    res.status(201).json({
      success: true,
      message: "Darshan booking created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: `Booking validation failed: ${error.message}`,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message:
          "Invalid temple, darshan slot, or booking date",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating booking",
    });
  }
};

// Get logged-in user's bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
    })
      .populate("temple", "name city state")
      .populate("darshanSlot")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get my bookings error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching bookings",
    });
  }
};

// Get a single booking
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate("temple", "name city state")
      .populate("darshanSlot");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Get booking error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while fetching booking",
    });
  }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
  try {
    let booking;

    // Admin can cancel any booking
    if (req.user.role === "ADMIN") {
      booking = await Booking.findById(req.params.id);
    } else {
      // Normal user can cancel only their own booking
      booking = await Booking.findOne({
        _id: req.params.id,
        user: req.user._id,
      });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.bookingStatus === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    // Restore booked seats
    const slot = await DarshanSlot.findById(
      booking.darshanSlot
    );

    if (slot) {
      slot.bookedSeats = Math.max(
        0,
        slot.bookedSeats - booking.numberOfDevotees
      );

      await slot.save();
    }

    booking.bookingStatus = "CANCELLED";

    await booking.save();

    // Return complete booking information
    const populatedBooking =
      await Booking.findById(booking._id)
        .populate("user", "name email")
        .populate("temple", "name city state")
        .populate("darshanSlot");

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while cancelling booking",
    });
  }
};

// Get all bookings - Admin only
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("temple", "name city state")
      .populate("darshanSlot")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(
      "Get all bookings error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while fetching all bookings",
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
};