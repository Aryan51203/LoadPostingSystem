const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// Import controller if it exists
// const shipperController = require('../controllers/shipperController');

// @route   GET api/shippers
// @desc    Get all shippers
// @access  Private/Admin
router.get("/", (req, res) => {
  res.json({ msg: "Get all shippers route" });
});

// @route   GET api/shippers/:id
// @desc    Get shipper by ID
// @access  Private
router.get("/:id", (req, res) => {
  res.json({ msg: `Get shipper with id ${req.params.id}` });
});

// @route   POST api/shippers
// @desc    Register a new shipper
// @access  Public
router.post("/", (req, res) => {
  res.json({ msg: "Register shipper route" });
});

// @route   PUT api/shippers/:id
// @desc    Update shipper
// @access  Private
router.put("/:id", (req, res) => {
  res.json({ msg: `Update shipper with id ${req.params.id}` });
});

// @route   DELETE api/shippers/:id
// @desc    Delete shipper
// @access  Private
router.delete("/:id", (req, res) => {
  res.json({ msg: `Delete shipper with id ${req.params.id}` });
});

module.exports = router;
