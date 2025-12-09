const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const startServer = async () => {
  try {
    // Wait until DB is connected
    await connectDB();
    console.log("Database connected. Starting server...");

    const app = express();

    // Enable CORS for mobile app requests
    app.use(
      cors({
        origin: "*", // Allow all origins for mobile app
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    app.use(express.json());

    // Mount auth routes
    const authRoutes = require("./routes/authRoutes");
    app.use("/api/auth", authRoutes);

    const PORT = process.env.PORT || 5000;
    const HOST = "0.0.0.0"; // Bind to all interfaces for mobile access

    app.listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
      console.log(
        `For mobile app, use your computer's IP address (e.g., http://192.168.x.x:${PORT})`
      );
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
