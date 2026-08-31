const User = require("../models/User");
const Temple = require("../models/Temple");
const Booking = require("../models/Booking");
const Donation = require("../models/Donation");
const DarshanSlot = require("../models/DarshanSlot");

// Get admin dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalTemples,
      activeTemples,
      totalSlots,
      activeSlots,
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      totalDonations,
      successfulDonations,
    ] = await Promise.all([
      User.countDocuments(),

      Temple.countDocuments(),

      Temple.countDocuments({
        isActive: true,
      }),

      DarshanSlot.countDocuments(),

      DarshanSlot.countDocuments({
        isActive: true,
      }),

      Booking.countDocuments(),

      Booking.countDocuments({
        bookingStatus: "CONFIRMED",
      }),

      Booking.countDocuments({
        bookingStatus: "CANCELLED",
      }),

      Donation.countDocuments(),

      Donation.countDocuments({
        paymentStatus: "SUCCESS",
      }),
    ]);

    // Calculate successful donation amount
    const donationAmountResult = await Donation.aggregate([
      {
        $match: {
          paymentStatus: "SUCCESS",
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalDonationAmount =
      donationAmountResult.length > 0
        ? donationAmountResult[0].totalAmount
        : 0;

    res.status(200).json({
      success: true,
      statistics: {
        users: {
          total: totalUsers,
        },

        temples: {
          total: totalTemples,
          active: activeTemples,
        },

        darshanSlots: {
          total: totalSlots,
          active: activeSlots,
        },

        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          cancelled: cancelledBookings,
        },

        donations: {
          total: totalDonations,
          successful: successfulDonations,
          totalAmount: totalDonationAmount,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard statistics error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard statistics",
    });
  }
};

module.exports = {
  getDashboardStats,
};