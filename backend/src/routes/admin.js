const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Import controller if it exists
// const adminController = require('../controllers/adminController');

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', (req, res) => {
  res.json({ msg: 'Get all users route' });
});

// @route   GET api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private/Admin
router.get('/dashboard', (req, res) => {
  res.json({ msg: 'Get admin dashboard stats' });
});

// @route   PUT api/admin/users/:id
// @desc    Update user by admin
// @access  Private/Admin
router.put('/users/:id', (req, res) => {
  res.json({ msg: `Update user with id ${req.params.id}` });
});

// @route   DELETE api/admin/users/:id
// @desc    Delete user by admin
// @access  Private/Admin
router.delete('/users/:id', (req, res) => {
  res.json({ msg: `Delete user with id ${req.params.id}` });
});

module.exports = router; 