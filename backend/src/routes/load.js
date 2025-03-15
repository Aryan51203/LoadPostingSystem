const express = require("express");
const router = express.Router();
const {
  getLoads,
  getLoad,
  createLoad,
  updateLoad,
  deleteLoad,
  getShipperLoads,
  getAvailableLoads,
} = require("../controllers/loadController");

const { protect } = require("../middleware/auth");

// @route   GET api/loads
// @desc    Get all loads with filtering
// @access  Public
router.get("/", getLoads);

// @route   GET api/loads/shipper
// @desc    Get shipper's loads
// @access  Private/Shipper
router.get("/shipper", protect, getShipperLoads);

// @route   GET api/loads/:id
// @desc    Get load by ID
// @access  Public
router.get("/:id", getLoad);

// @route   POST api/loads
// @desc    Create a new load
// @access  Private/Shipper
router.post("/", protect, createLoad);

// @route   PUT api/loads/:id
// @desc    Update load
// @access  Private/Shipper
router.put("/:id", protect, updateLoad);

// @route   DELETE api/loads/:id
// @desc    Delete load
// @access  Private/Shipper
router.delete("/:id", protect, deleteLoad);

// Get available loads with filters
router.get("/available", protect, getAvailableLoads);

module.exports = router;
