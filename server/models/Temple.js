const mongoose = require("mongoose");

const templeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Temple name is required"],
      trim: true,
      minlength: [
        2,
        "Temple name must be at least 2 characters long",
      ],
      maxlength: [
        100,
        "Temple name cannot exceed 100 characters",
      ],
    },

    description: {
      type: String,
      required: [true, "Temple description is required"],
      trim: true,
      maxlength: [
        50000,
        "Description cannot exceed 50000 characters",
      ],
    },

    location: {
      type: String,
      required: [true, "Temple location is required"],
      trim: true,
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },

    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },

    // Existing image field is kept for compatibility
    // with temples created before the multiple-image update.
    image: {
      type: String,
      default: "",
    },

    // New multiple-image field
    images: {
      type: [String],
      default: [],
    },

    timings: {
      type: String,
      default: "",
      trim: true,
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

const Temple = mongoose.model(
  "Temple",
  templeSchema
);

module.exports = Temple;