const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const User = require("../models/User");

// =====================================================
// GENERATE JWT TOKEN
// =====================================================

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};


// =====================================================
// EMAIL TRANSPORTER
// =====================================================

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});


// =====================================================
// REGISTER USER
// =====================================================

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required",
      });
    }

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "User with this email already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message:
        "User registered successfully",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Registration error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error during registration",
    });
  }
};


// =====================================================
// LOGIN USER
// =====================================================

const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error during login",
    });
  }
};


// =====================================================
// GET PROFILE
// =====================================================

const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,

      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error(
      "Profile error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while fetching profile",
    });
  }
};


// =====================================================
// FORGOT PASSWORD
// =====================================================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message:
          "Email address is required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const user =
      await User.findOne({
        email: normalizedEmail,
      });

    /*
     * We intentionally return the same response
     * whether the email exists or not.
     *
     * This prevents attackers from discovering
     * which email addresses have accounts.
     */

    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    // Generate secure random token
    const resetToken =
      crypto.randomBytes(32).toString("hex");

    // Store only the HASH of the token
    const hashedResetToken =
      crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // Token expires after 15 minutes
    const resetTokenExpiry =
      Date.now() + 15 * 60 * 1000;

    user.resetPasswordToken =
      hashedResetToken;

    user.resetPasswordExpires =
      resetTokenExpiry;

    await user.save();

    // Frontend reset URL
    const resetUrl =
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"DarshanEase" <${process.env.EMAIL_USER}>`,

      to: user.email,

      subject:
        "DarshanEase - Password Reset",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 30px;
          background: #f8f7ff;
          color: #222;
        ">

          <div style="
            background: #7c3aed;
            color: white;
            padding: 20px;
            border-radius: 12px 12px 0 0;
            text-align: center;
          ">
            <h1 style="margin: 0;">
              DarshanEase
            </h1>
          </div>

          <div style="
            background: white;
            padding: 30px;
            border-radius: 0 0 12px 12px;
          ">

            <h2>
              Password Reset Request
            </h2>

            <p>
              Hello ${user.name},
            </p>

            <p>
              We received a request to reset
              the password for your DarshanEase
              account.
            </p>

            <p>
              Click the button below to create
              a new password.
            </p>

            <div style="
              text-align: center;
              margin: 30px 0;
            ">

              <a
                href="${resetUrl}"
                style="
                  display: inline-block;
                  padding: 14px 25px;
                  background: #7c3aed;
                  color: white;
                  text-decoration: none;
                  border-radius: 8px;
                  font-weight: bold;
                "
              >
                Reset Password
              </a>

            </div>

            <p>
              This password reset link will
              expire in <strong>15 minutes</strong>.
            </p>

            <p>
              If you did not request a password
              reset, you can safely ignore this
              email.
            </p>

            <hr />

            <p style="
              font-size: 12px;
              color: #666;
            ">
              For security reasons, this link
              can only be used once.
            </p>

          </div>

        </div>
      `,
    };

    await transporter.sendMail(
      mailOptions
    );

    console.log(
      "Password reset email sent to:",
      user.email
    );

    res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });

  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to send password reset email. Please try again later.",
    });
  }
};


// =====================================================
// RESET PASSWORD
// =====================================================

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message:
          "Password reset token is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message:
          "New password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters long",
      });
    }

    // Hash token received from URL
    const hashedToken =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    // Find user with valid token
    const user =
      await User.findOne({
        resetPasswordToken:
          hashedToken,

        resetPasswordExpires: {
          $gt: Date.now(),
        },
      });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Password reset link is invalid or expired",
      });
    }

    // Hash new password
    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    user.password =
      hashedPassword;

    // Invalidate reset token
    user.resetPasswordToken = null;

    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now login with your new password.",
    });

  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while resetting password",
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  forgotPassword,
  resetPassword,
};