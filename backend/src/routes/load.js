const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Import controller
const loadController = require('../controllers/loadController');

// @route   GET api/loads
// @desc    Get all loads with filtering
// @access  Public
router.get('/', loadController.getLoads);

// @route   GET api/loads/shipper
// @desc    Get shipper's loads
// @access  Private/Shipper
router.get('/shipper', auth, loadController.getShipperLoads);

// @route   GET api/loads/:id
// @desc    Get load by ID
// @access  Public
router.get('/:id', loadController.getLoad);

// @route   POST api/loads
// @desc    Create a new load
// @access  Private/Shipper
router.post('/', auth, loadController.createLoad);

// @route   PUT api/loads/:id
// @desc    Update load
// @access  Private/Shipper
router.put('/:id', auth, loadController.updateLoad);

// @route   DELETE api/loads/:id
// @desc    Delete load
// @access  Private/Shipper
router.delete('/:id', auth, loadController.deleteLoad);

module.exports = router; 