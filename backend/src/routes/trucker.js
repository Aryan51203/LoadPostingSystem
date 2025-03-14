const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getTruckers,
  getTrucker,
  createTrucker,
  updateTrucker,
  deleteTrucker,
} = require("../controllers/truckerController");

// @route   GET api/truckers
// @desc    Get all truckers
// @access  Private/Admin
router.get("/", auth, getTruckers);

// @route   GET api/truckers/:id
// @desc    Get trucker by ID
// @access  Private
router.get("/:id", auth, getTrucker);

// @route   POST api/truckers
// @desc    Register a new trucker
// @access  Public
router.post("/", auth, createTrucker);

// @route   PUT api/truckers/:id
// @desc    Update trucker
// @access  Private
router.put("/:id", auth, updateTrucker);

// @route   DELETE api/truckers/:id
// @desc    Delete trucker
// @access  Private
router.delete("/:id", auth, deleteTrucker);

module.exports = router;
