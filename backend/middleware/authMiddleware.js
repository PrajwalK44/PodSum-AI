const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../models/BlacklistedToken");
const User = require("../models/User");

module.exports = async function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    // Check blacklist
    const blacklisted = await BlacklistedToken.findOne({ token });
    if (blacklisted) {
      return res
        .status(401)
        .json({ message: "Token invalidated (logged out)" });
    }

    // Verify token
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Attach user to request if possible
    if (payload && payload.userId) {
      const user = await User.findById(payload.userId).select("-password");
      if (!user) return res.status(401).json({ message: "User not found" });
      req.user = user;
    }

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
