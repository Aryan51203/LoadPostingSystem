const Shipper = require("../models/Shipper");
const Load = require("../models/Load");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Get all shippers
// @route   GET /api/shippers
// @access  Private/Admin
exports.getShippers = asyncHandler(async (req, res, next) => {
  const shippers = await Shipper.find().populate("user", "name email");

  res.status(200).json({
    success: true,
    count: shippers.length,
    data: shippers,
  });
});

// @desc    Get single shipper
// @route   GET /api/shippers/:id
// @access  Private
exports.getShipper = asyncHandler(async (req, res, next) => {
  const shipper = await Shipper.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!shipper) {
    return next(
      new ErrorResponse(`Shipper not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: shipper,
  });
});

// @desc    Create new shipper
// @route   POST /api/shippers
// @access  Public
exports.createShipper = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for existing shipper
  const existingShipper = await Shipper.findOne({ user: req.user.id });

  if (existingShipper) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} has already registered as a shipper`,
        400
      )
    );
  }

  const shipper = await Shipper.create(req.body);

  res.status(201).json({
    success: true,
    data: shipper,
  });
});

// @desc    Update shipper
// @route   PUT /api/shippers/:id
// @access  Private
exports.updateShipper = asyncHandler(async (req, res, next) => {
  let shipper = await Shipper.findById(req.params.id);

  if (!shipper) {
    return next(
      new ErrorResponse(`Shipper not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is shipper owner
  if (shipper.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this shipper`,
        401
      )
    );
  }

  shipper = await Shipper.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: shipper,
  });
});

// @desc    Delete shipper
// @route   DELETE /api/shippers/:id
// @access  Private
exports.deleteShipper = asyncHandler(async (req, res, next) => {
  const shipper = await Shipper.findById(req.params.id);

  if (!shipper) {
    return next(
      new ErrorResponse(`Shipper not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is shipper owner
  if (shipper.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this shipper`,
        401
      )
    );
  }

  await shipper.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get shipper dashboard data
// @route   GET /api/shippers/dashboard
// @access  Private
exports.getDashboard = asyncHandler(async (req, res, next) => {
  // Get shipper's loads with different statuses
  const activeLoads = await Load.find({
    shipper: req.user.id,
    status: { $in: ["Posted", "Bidding", "Assigned", "In Transit"] },
  }).populate("assignedTo", "name company");

  const completedLoads = await Load.find({
    shipper: req.user.id,
    status: { $in: ["Delivered", "Completed"] },
  });

  const cancelledLoads = await Load.find({
    shipper: req.user.id,
    status: "Cancelled",
  });

  // Calculate statistics
  const totalLoads = await Load.countDocuments({ shipper: req.user.id });
  const activeLoadCount = activeLoads.length;
  const completedLoadCount = completedLoads.length;
  const cancelledLoadCount = cancelledLoads.length;

  // Calculate total spent on completed loads
  const totalSpent = completedLoads.reduce((acc, load) => {
    return (
      acc + (load.winningBid ? load.winningBid.amount : load.budget.amount)
    );
  }, 0);

  // Get recent loads
  const recentLoads = await Load.find({ shipper: req.user.id })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("assignedTo", "name company")
    .select(
      "title status createdAt budget.amount pickupLocation.city deliveryLocation.city"
    );

  res.status(200).json({
    success: true,
    data: {
      statistics: {
        totalLoads,
        activeLoadCount,
        completedLoadCount,
        cancelledLoadCount,
        totalSpent,
      },
      activeLoads,
      recentLoads,
    },
  });
});
