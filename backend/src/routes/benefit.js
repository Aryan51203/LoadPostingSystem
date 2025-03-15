const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// Import controller if it exists
// const benefitController = require('../controllers/benefitController');

// @route   GET api/benefits
// @desc    Get all benefits
// @access  Public
router.get("/", (req, res) => {
  res.json({ msg: "Get all benefits route" });
});

// @route   GET api/benefits/:id
// @desc    Get benefit by ID
// @access  Public
router.get("/:id", (req, res) => {
  res.json({ msg: `Get benefit with id ${req.params.id}` });
});

// @route   POST api/benefits
// @desc    Create a new benefit
// @access  Private/Admin
router.post("/", (req, res) => {
  res.json({ msg: "Create benefit route" });
});

// @route   PUT api/benefits/:id
// @desc    Update benefit
// @access  Private/Admin
router.put("/:id", (req, res) => {
  res.json({ msg: `Update benefit with id ${req.params.id}` });
});

// @route   DELETE api/benefits/:id
// @desc    Delete benefit
// @access  Private/Admin
router.delete("/:id", (req, res) => {
  res.json({ msg: `Delete benefit with id ${req.params.id}` });
});

module.exports = router;
