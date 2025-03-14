const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

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
router.get("/", auth, getShippers);

// @route   GET api/shippers/:id
// @desc    Get shipper by ID
// @access  Private
router.get("/:id", auth, getShipper);

// @route   POST api/shippers
// @desc    Register a new shipper
// @access  Private
router.post("/", auth, createShipper);

// @route   PUT api/shippers/:id
// @desc    Update shipper
// @access  Private
router.put("/:id", auth, updateShipper);

// @route   DELETE api/shippers/:id
// @desc    Delete shipper
// @access  Private
router.delete("/:id", auth, deleteShipper);

// @route   GET api/shippers/dashboard
// @desc    Get shipper dashboard data
// @access  Private
router.get("/dashboard", auth, getDashboard);

module.exports = router;
