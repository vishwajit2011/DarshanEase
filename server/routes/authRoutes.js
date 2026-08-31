const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// REGISTER
// =====================================================

router.post(
  "/register",
  registerUser
);


// =====================================================
// LOGIN
// =====================================================

router.post(
  "/login",
  loginUser
);


// =====================================================
// FORGOT PASSWORD
// =====================================================

router.post(
  "/forgot-password",
  forgotPassword
);


// =====================================================
// RESET PASSWORD
// =====================================================

router.put(
  "/reset-password/:token",
  resetPassword
);


// =====================================================
// PROFILE
// =====================================================

router.get(
  "/profile",
  protect,
  getProfile
);


module.exports = router;