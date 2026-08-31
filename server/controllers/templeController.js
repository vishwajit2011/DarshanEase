const Temple = require("../models/Temple");

// =========================
// Get all active temples
// =========================

const getTemples = async (
  req,
  res
) => {
  try {
    const temples =
      await Temple.find({
        isActive: true,
      }).sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: temples.length,
      temples,
    });
  } catch (error) {
    console.error(
      "Get temples error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while fetching temples",
    });
  }
};

// =========================
// Get Single Temple
// =========================

const getTempleById = async (
  req,
  res
) => {
  try {
    const temple =
      await Temple.findOne({
        _id: req.params.id,
        isActive: true,
      });

    if (!temple) {
      return res.status(404).json({
        success: false,
        message: "Temple not found",
      });
    }

    res.status(200).json({
      success: true,
      temple,
    });
  } catch (error) {
    console.error(
      "Get temple error:",
      error
    );

    if (
      error.name === "CastError"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid temple ID",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Server error while fetching temple",
    });
  }
};

// =========================
// Create Temple
// =========================

const createTemple = async (
  req,
  res
) => {
  try {
    console.log(
      "========== TEMPLE CREATE =========="
    );

    console.log(
      "Body:",
      req.body
    );

    console.log(
      "Files:",
      req.files
    );

    const {
      name,
      description,
      location,
      city,
      state,
      timings,
    } = req.body;

    // =========================
    // Image Paths
    // =========================

    const imagePaths = [];

    if (
      req.files &&
      req.files.length > 0
    ) {
      req.files.forEach((file) => {
        imagePaths.push(
          `/uploads/temples/${file.filename}`
        );
      });
    }

    // Keep first image in old
    // image field for compatibility.
    const firstImage =
      imagePaths.length > 0
        ? imagePaths[0]
        : "";

    // =========================
    // Create Temple
    // =========================

    const temple =
      await Temple.create({
        name,
        description,
        location,
        city,
        state,
        timings,
        image: firstImage,
        images: imagePaths,
      });

    console.log(
      "Saved temple images:",
      imagePaths
    );

    res.status(201).json({
      success: true,
      message:
        "Temple created successfully",
      temple,
    });
  } catch (error) {
    console.error(
      "Create temple error:",
      error
    );

    if (
      error.name ===
      "ValidationError"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.name ===
      "MulterError"
    ) {
      return res.status(400).json({
        success: false,
        message:
          `Image upload error: ${error.message}`,
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Server error while creating temple",
    });
  }
};

// =========================
// Update Temple
// =========================

const updateTemple = async (
  req,
  res
) => {
  try {
    console.log(
      "========== TEMPLE UPDATE =========="
    );

    console.log(
      "Body:",
      req.body
    );

    console.log(
      "Files:",
      req.files
    );

    const temple =
      await Temple.findById(
        req.params.id
      );

    if (!temple) {
      return res.status(404).json({
        success: false,
        message:
          "Temple not found",
      });
    }

    const {
      name,
      description,
      location,
      city,
      state,
      timings,
      isActive,
    } = req.body;

    temple.name =
      name ?? temple.name;

    temple.description =
      description ??
      temple.description;

    temple.location =
      location ??
      temple.location;

    temple.city =
      city ?? temple.city;

    temple.state =
      state ?? temple.state;

    temple.timings =
      timings ?? temple.timings;

    temple.isActive =
      isActive ??
      temple.isActive;

    // =========================
    // New Images Uploaded
    // =========================

    if (
      req.files &&
      req.files.length > 0
    ) {
      const imagePaths =
        req.files.map(
          (file) =>
            `/uploads/temples/${file.filename}`
        );

      temple.images =
        imagePaths;

      // Keep old image field compatible
      temple.image =
        imagePaths[0];

      console.log(
        "Updated temple images:",
        imagePaths
      );
    }

    // =========================
    // Existing old temple
    // =========================

    // If old temple has image but
    // no images array, convert it.
    if (
      (!temple.images ||
        temple.images.length === 0) &&
      temple.image
    ) {
      temple.images = [
        temple.image,
      ];
    }

    await temple.save();

    res.status(200).json({
      success: true,
      message:
        "Temple updated successfully",
      temple,
    });
  } catch (error) {
    console.error(
      "Update temple error:",
      error
    );

    if (
      error.name ===
      "ValidationError"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.name ===
      "CastError"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid temple ID",
      });
    }

    if (
      error.name ===
      "MulterError"
    ) {
      return res.status(400).json({
        success: false,
        message:
          `Image upload error: ${error.message}`,
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Server error while updating temple",
    });
  }
};

// =========================
// Delete / Deactivate Temple
// =========================

const deleteTemple = async (
  req,
  res
) => {
  try {
    const temple =
      await Temple.findById(
        req.params.id
      );

    if (!temple) {
      return res.status(404).json({
        success: false,
        message:
          "Temple not found",
      });
    }

    temple.isActive = false;

    await temple.save();

    res.status(200).json({
      success: true,
      message:
        "Temple deactivated successfully",
    });
  } catch (error) {
    console.error(
      "Delete temple error:",
      error
    );

    if (
      error.name === "CastError"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid temple ID",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Server error while deactivating temple",
    });
  }
};

module.exports = {
  getTemples,
  getTempleById,
  createTemple,
  updateTemple,
  deleteTemple,
};