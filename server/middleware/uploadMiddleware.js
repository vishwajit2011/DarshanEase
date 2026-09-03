const multer = require("multer");

// =========================
// Multer Memory Storage
// =========================
// Files are kept in memory temporarily.
// They will be uploaded to Vercel Blob
// by the controller.

const storage = multer.memoryStorage();

// =========================
// File Filter
// =========================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed"
      ),
      false
    );
  }
};

// =========================
// Multer
// =========================

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 8,
  },
});

module.exports = upload;