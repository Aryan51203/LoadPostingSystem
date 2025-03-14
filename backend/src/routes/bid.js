const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Import controller
const bidController = require('../controllers/bidController');

// @route   GET api/bids
// @desc    Get bids placed by a trucker
// @access  Private/Trucker
router.get('/', auth, bidController.getTruckerBids);

// @route   GET api/bids/load/:loadId
// @desc    Get bids for a specific load
// @access  Private/Shipper
router.get('/load/:loadId', auth, bidController.getBidsByLoad);

// @route   GET api/bids/:id
// @desc    Get bid by ID
// @access  Private
router.get('/:id', auth, bidController.getBid);

// @route   POST api/bids
// @desc    Create a new bid
// @access  Private/Trucker
router.post('/', auth, bidController.createBid);

// @route   PUT api/bids/:id
// @desc    Update bid
// @access  Private/Trucker
router.put('/:id', auth, bidController.updateBid);

// @route   PUT api/bids/:id/accept
// @desc    Accept a bid
// @access  Private/Shipper
router.put('/:id/accept', auth, bidController.acceptBid);

module.exports = router; 