const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

const {
  getShippers,
  getShipper,
  createShipper,
  updateShipper,
  deleteShipper,
  getDashboard,
} = require("../controllers/shipperController");

// @route   GET api/shippers
// @desc    Get all shippers
// @access  Private/Admin
router.get("/", protect, authorize("admin"), getShippers);

// @route   GET api/shippers/dashboard
// @desc    Get shipper dashboard data
// @access  Private
router.get("/dashboard", protect, getDashboard);

// @route   GET api/shippers/:id
// @desc    Get shipper by ID
// @access  Private
router.get("/:id", protect, getShipper);

// @route   POST api/shippers
// @desc    Register a new shipper
// @access  Private
router.post("/", createShipper);

// @route   PUT api/shippers/:id
// @desc    Update shipper
// @access  Private
router.put("/:id", protect, updateShipper);

// @route   DELETE api/shippers/:id
// @desc    Delete shipper
// @access  Private
router.delete("/:id", protect, deleteShipper);

module.exports = router;
