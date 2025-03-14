const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Import routes
const authRoutes = require("./routes/auth");
const shipperRoutes = require("./routes/shipper");
const truckerRoutes = require("./routes/trucker");
const loadRoutes = require("./routes/load");
const bidRoutes = require("./routes/bid");
const adminRoutes = require("./routes/admin");
const benefitRoutes = require("./routes/benefit");
const errorHandler = require("./middleware/error");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/shippers", shipperRoutes);
app.use("/api/truckers", truckerRoutes);
app.use("/api/loads", loadRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/benefits", benefitRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Load Posting System API");
});

app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection:", err);
  app.close(() => process.exit(1));
});
