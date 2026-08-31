const Donation = require("../models/Donation");
const Temple = require("../models/Temple");

// Generate unique donation reference
const generateDonationReference = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(1000 + Math.random() * 9000);

  return `DON-${timestamp}-${random}`;
};

// Create donation
const createDonation = async (req, res) => {
  try {
    const {
      temple,
      amount,
    } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Donation amount must be greater than 0",
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

    // Create donation as PENDING
    const donation = await Donation.create({
      user: req.user._id,
      temple,
      amount,
      paymentStatus: "PENDING",
      transactionId: "",
      donationReference: generateDonationReference(),
    });

    // Populate related information
    const populatedDonation =
      await Donation.findById(donation._id)
        .populate("user", "name email")
        .populate("temple", "name city state");

    res.status(201).json({
      success: true,
      message: "Donation created successfully",
      donation: populatedDonation,
    });
  } catch (error) {
    console.error(
      "Create donation error:",
      error
    );

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message:
          `Donation validation failed: ${error.message}`,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid temple ID",
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "Donation reference already exists. Please try again.",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Server error while creating donation",
    });
  }
};

// Process test payment
const processTestPayment = async (req, res) => {
  try {
    const donation =
      await Donation.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    if (
      donation.paymentStatus === "SUCCESS"
    ) {
      return res.status(400).json({
        success: false,
        message: "Donation is already successful",
      });
    }

    if (
      donation.paymentStatus === "FAILED"
    ) {
      return res.status(400).json({
        success: false,
        message: "Donation payment has failed",
      });
    }

    // Generate test transaction ID
    const transactionId =
      `TEST-TXN-${Date.now()}`;

    donation.paymentStatus = "SUCCESS";
    donation.transactionId = transactionId;

    await donation.save();

    const updatedDonation =
      await Donation.findById(donation._id)
        .populate("user", "name email")
        .populate("temple", "name city state");

    res.status(200).json({
      success: true,
      message: "Payment successful",
      donation: updatedDonation,
    });
  } catch (error) {
    console.error(
      "Test payment error:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid donation ID",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Server error while processing payment",
    });
  }
};

// Get logged-in user's donations
const getMyDonations = async (req, res) => {
  try {
    const donations =
      await Donation.find({
        user: req.user._id,
      })
        .populate(
          "temple",
          "name city state"
        )
        .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    console.error(
      "Get my donations error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while fetching donations",
    });
  }
};

// Get all donations - Admin only
const getAllDonations = async (req, res) => {
  try {
    const donations =
      await Donation.find()
        .populate(
          "user",
          "name email"
        )
        .populate(
          "temple",
          "name city state"
        )
        .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    console.error(
      "Get all donations error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while fetching donations",
    });
  }
};

// Update donation payment status - Admin only
const updateDonationStatus = async (
  req,
  res
) => {
  try {
    const {
      paymentStatus,
      transactionId,
    } = req.body;

    const allowedStatuses = [
      "PENDING",
      "SUCCESS",
      "FAILED",
    ];

    if (
      !allowedStatuses.includes(
        paymentStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    const donation =
      await Donation.findById(
        req.params.id
      );

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    donation.paymentStatus =
      paymentStatus;

    if (
      transactionId !== undefined
    ) {
      donation.transactionId =
        transactionId;
    }

    await donation.save();

    const updatedDonation =
      await Donation.findById(
        donation._id
      )
        .populate(
          "user",
          "name email"
        )
        .populate(
          "temple",
          "name city state"
        );

    res.status(200).json({
      success: true,
      message:
        "Donation payment status updated successfully",
      donation: updatedDonation,
    });
  } catch (error) {
    console.error(
      "Update donation status error:",
      error
    );

    if (
      error.name === "CastError"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid donation ID",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Server error while updating donation status",
    });
  }
};

module.exports = {
  createDonation,
  processTestPayment,
  getMyDonations,
  getAllDonations,
  updateDonationStatus,
};