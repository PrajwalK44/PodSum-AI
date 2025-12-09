const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

// Public routes
router.post("/register", authController.registerUser);
router.post("/verify", authController.verifyOTP);
router.post("/resend", authController.resendOTP);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);

// Protected route
router.get("/home", auth, authController.home);

module.exports = router;
