const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Import controller if it exists
// const truckerController = require('../controllers/truckerController');

// @route   GET api/truckers
// @desc    Get all truckers
// @access  Private/Admin
router.get('/', (req, res) => {
  res.json({ msg: 'Get all truckers route' });
});

// @route   GET api/truckers/:id
// @desc    Get trucker by ID
// @access  Private
router.get('/:id', (req, res) => {
  res.json({ msg: `Get trucker with id ${req.params.id}` });
});

// @route   POST api/truckers
// @desc    Register a new trucker
// @access  Public
router.post('/', (req, res) => {
  res.json({ msg: 'Register trucker route' });
});

// @route   PUT api/truckers/:id
// @desc    Update trucker
// @access  Private
router.put('/:id', (req, res) => {
  res.json({ msg: `Update trucker with id ${req.params.id}` });
});

// @route   DELETE api/truckers/:id
// @desc    Delete trucker
// @access  Private
router.delete('/:id', (req, res) => {
  res.json({ msg: `Delete trucker with id ${req.params.id}` });
});

module.exports = router; 