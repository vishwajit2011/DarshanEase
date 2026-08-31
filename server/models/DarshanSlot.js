const mongoose = require("mongoose");

const darshanSlotSchema = new mongoose.Schema(
  {
    temple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Temple",
      required: [true, "Temple is required"],
    },

    date: {
      type: Date,
      required: [true, "Darshan date is required"],
    },

    startTime: {
      type: String,
      required: [true, "Start time is required"],
      trim: true,
    },

    endTime: {
      type: String,
      required: [true, "End time is required"],
      trim: true,
    },

    capacity: {
      type: Number,
      required: [true, "Slot capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },

    bookedSeats: {
      type: Number,
      default: 0,
      min: [0, "Booked seats cannot be negative"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const DarshanSlot = mongoose.model("DarshanSlot", darshanSlotSchema);

module.exports = DarshanSlot;