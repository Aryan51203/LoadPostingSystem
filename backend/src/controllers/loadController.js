const Load = require('../models/Load');
const Shipper = require('../models/Shipper');
const mongoose = require('mongoose');

// @desc    Create a new load
// @route   POST /api/loads
// @access  Private/Shipper
exports.createLoad = async (req, res) => {
  try {
    // Add user as shipper
    req.body.shipper = req.user.id;
    
    // Validate user is a shipper
    const shipper = await Shipper.findOne({ user: req.user.id });
    
    if (!shipper) {
      return res.status(401).json({ 
        success: false, 
        error: 'Not authorized to post loads. Only shippers can post loads.' 
      });
    }
    
    // Create load
    const load = await Load.create(req.body);
    
    res.status(201).json({
      success: true,
      data: load
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      console.error(err);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Get all loads with filtering options
// @route   GET /api/loads
// @access  Public
exports.getLoads = async (req, res) => {
  try {
    let query = { status: { $in: ['Posted', 'Bidding'] } };
    
    // Filtering
    if (req.query.cargoType) {
      query.cargoType = req.query.cargoType;
    }
    
    if (req.query.truckType) {
      query.requiredTruckType = req.query.truckType;
    }
    
    if (req.query.pickupState) {
      query['pickupLocation.state'] = req.query.pickupState;
    }
    
    if (req.query.pickupCity) {
      query['pickupLocation.city'] = req.query.pickupCity;
    }
    
    if (req.query.deliveryState) {
      query['deliveryLocation.state'] = req.query.deliveryState;
    }
    
    if (req.query.deliveryCity) {
      query['deliveryLocation.city'] = req.query.deliveryCity;
    }
    
    // Date range filtering
    if (req.query.fromDate) {
      query['schedule.pickupDate'] = { $gte: new Date(req.query.fromDate) };
    }
    
    if (req.query.toDate) {
      query['schedule.deliveryDate'] = { 
        ...query['schedule.deliveryDate'],
        $lte: new Date(req.query.toDate) 
      };
    }
    
    // Weight filtering
    if (req.query.minWeight) {
      query['weight.value'] = { $gte: parseFloat(req.query.minWeight) };
    }
    
    if (req.query.maxWeight) {
      query['weight.value'] = { 
        ...query['weight.value'],
        $lte: parseFloat(req.query.maxWeight) 
      };
    }
    
    // Budget filtering
    if (req.query.minBudget) {
      query['budget.amount'] = { $gte: parseFloat(req.query.minBudget) };
    }
    
    if (req.query.maxBudget) {
      query['budget.amount'] = { 
        ...query['budget.amount'],
        $lte: parseFloat(req.query.maxBudget) 
      };
    }
    
    // Search by keyword
    if (req.query.keyword) {
      query.$text = { $search: req.query.keyword };
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    const loads = await Load.find(query)
      .populate('shipper', 'companyName contactName contactPhone')
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await Load.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: loads.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: loads
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single load
// @route   GET /api/loads/:id
// @access  Public
exports.getLoad = async (req, res) => {
  try {
    const load = await Load.findById(req.params.id)
      .populate('shipper', 'companyName contactName contactPhone rating')
      .populate('assignedTo', 'companyName contactName contactPhone rating')
      .populate('winningBid');
    
    if (!load) {
      return res.status(404).json({
        success: false,
        error: 'Load not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: load
    });
  } catch (err) {
    console.error(err);
    
    // Handle invalid ObjectID format
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Load not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update load
// @route   PUT /api/loads/:id
// @access  Private/Shipper
exports.updateLoad = async (req, res) => {
  try {
    let load = await Load.findById(req.params.id);
    
    if (!load) {
      return res.status(404).json({
        success: false,
        error: 'Load not found'
      });
    }
    
    // Make sure user is the shipper who owns the load
    if (load.shipper.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this load'
      });
    }
    
    // Can't update if already assigned or further along in process
    if (!['Posted', 'Bidding'].includes(load.status)) {
      return res.status(400).json({
        success: false,
        error: `Load cannot be updated when in '${load.status}' status`
      });
    }
    
    load = await Load.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: load
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      console.error(err);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Delete load
// @route   DELETE /api/loads/:id
// @access  Private/Shipper
exports.deleteLoad = async (req, res) => {
  try {
    const load = await Load.findById(req.params.id);
    
    if (!load) {
      return res.status(404).json({
        success: false,
        error: 'Load not found'
      });
    }
    
    // Make sure user is the shipper who owns the load
    if (load.shipper.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this load'
      });
    }
    
    // Can't delete if already assigned or further along in process
    if (!['Posted', 'Bidding'].includes(load.status)) {
      return res.status(400).json({
        success: false,
        error: `Load cannot be deleted when in '${load.status}' status`
      });
    }
    
    await load.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    
    // Handle invalid ObjectID format
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Load not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get shipper's loads
// @route   GET /api/loads/shipper
// @access  Private/Shipper
exports.getShipperLoads = async (req, res) => {
  try {
    const loads = await Load.find({ shipper: req.user.id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: loads.length,
      data: loads
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 