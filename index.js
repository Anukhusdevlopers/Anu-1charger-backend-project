require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json()); // Middleware for JSON parsing
app.use(cors()); // Enable CORS

const PORT = process.env.PORT || 9000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Import Routes
app.use("/api", require("./src/router/userRouter"));

// Sample Route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
