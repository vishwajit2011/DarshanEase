const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
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

    darshanSlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DarshanSlot",
      required: [true, "Darshan slot is required"],
    },

    bookingDate: {
      type: Date,
      required: [true, "Booking date is required"],
    },

    numberOfDevotees: {
      type: Number,
      required: [true, "Number of devotees is required"],
      min: [1, "At least one devotee is required"],
    },

    bookingStatus: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED"],
      default: "CONFIRMED",
    },

    bookingReference: {
      type: String,
      unique: true,
      required: [true, "Booking reference is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;