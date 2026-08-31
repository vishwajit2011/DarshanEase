const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==========================================
// PROTECT ROUTES
// ==========================================

const protect = async (req, res, next) => {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    // Check whether Bearer token exists
    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Extract token
    const token = authHeader.substring(7).trim();

    // Make sure token is not empty
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing",
      });
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is not configured in .env"
      );

      return res.status(500).json({
        success: false,
        message: "Server authentication configuration error",
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Make sure decoded token contains user ID
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    // Find user from database
    const user = await User.findById(
      decoded.id
    ).select("-password");

    // User no longer exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found",
      });
    }

    // Attach authenticated user to request
    req.user = user;

    // Continue to requested route
    next();

  } catch (error) {
    console.error(
      "Authentication error:",
      error.message
    );

    // JWT token expired
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Your session has expired. Please login again",
      });
    }

    // JWT token malformed or invalid
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    // Other authentication/database error
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};


// ==========================================
// AUTHORIZE USER ROLES
// ==========================================

const authorize = (...allowedRoles) => {
  return (req, res, next) => {

    // User must be authenticated first
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Make sure roles were provided
    if (allowedRoles.length === 0) {
      return res.status(403).json({
        success: false,
        message: "No access roles configured",
      });
    }

    // Check user's role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to access this resource",
      });
    }

    // User has permission
    next();
  };
};


module.exports = {
  protect,
  authorize,
};