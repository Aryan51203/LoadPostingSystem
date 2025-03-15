const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Trucker = require("../models/Trucker");
const Shipper = require("../models/Shipper");

// Protect routes
const protect = async (req, res, next) => {
  let token;

  // First try to get token from cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Fallback to Bearer token in header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user to request object
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (req.user.role === "trucker") {
      const trucker = await Trucker.findOne({ user: req.user.id });
      req.trucker = trucker;
      if (!trucker) {
        return res.status(401).json({
          success: false,
          message: "Trucker not found",
        });
      }
    }

    if (req.user.role === "shipper") {
      const shipper = await Shipper.findOne({ user: req.user.id });
      req.shipper = shipper;
      if (!shipper) {
        return res.status(401).json({
          success: false,
          message: "Shipper not found",
        });
      }
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }

    next();
  };
};

// Export protect as the default middleware
module.exports = { protect, authorize };
