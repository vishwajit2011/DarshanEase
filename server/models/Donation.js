const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },

    temple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Temple",
      required: [true, "Temple is required"],
    },

    amount: {
      type: Number,
      required: [true, "Donation amount is required"],
      min: [1, "Donation amount must be at least 1"],
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },

    transactionId: {
      type: String,
      default: "",
      trim: true,
    },

    donationReference: {
      type: String,
      unique: true,
      required: [true, "Donation reference is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;