require("dotenv").config();
const User = require("../models/User.js");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../models/BlacklistedToken");
//email transporter

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = new User({
      name,
      email,
      password,
      otp,
      otpExpiry,
    });
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP for Email Verification",
      text: `Your OTP for email verification is ${otp}. It is valid for 10 minutes.`,
    });

    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error in verifyOTP:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//resend otp
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Resent OTP for Email Verification",
      text: `Your new OTP for email verification is ${otp}. It is valid for 10 minutes.`,
    });
    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Error in resendOTP:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (!user.isVerified) {
      return res.status(400).json({ message: "User not verified" });
    }
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//logout a user
exports.logoutUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }
    // Decode token to get expiry (without verifying) and store it in blacklist
    let decoded;
    try {
      decoded = jwt.decode(token);
    } catch (err) {
      // If decoding fails, still accept logout but don't store
      console.error("Failed to decode token during logout:", err);
      return res.status(200).json({ message: "Logout successful" });
    }

    // If token has exp, use it for TTL; otherwise set a reasonable expiry (1 hour)
    const expiresAt =
      decoded && decoded.exp
        ? new Date(decoded.exp * 1000)
        : new Date(Date.now() + 60 * 60 * 1000);

    // Save blacklisted token. If already present, ignore duplicate key error.
    try {
      await BlacklistedToken.create({ token, expiresAt });
    } catch (err) {
      if (err.code === 11000) {
        // duplicate key, token already blacklisted
      } else {
        console.error("Error saving blacklisted token:", err);
      }
    }

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error in logoutUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.home = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(200).json({ name: req.user.name });
  } catch (err) {
    console.error("Error in home controller:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
