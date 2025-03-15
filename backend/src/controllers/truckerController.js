const Trucker = require("../models/Trucker");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Load = require("../models/Load");
const User = require("../models/User");
const Bid = require("../models/Bid");

// @desc    Get all truckers
// @route   GET /api/truckers
// @access  Private/Admin
exports.getTruckers = asyncHandler(async (req, res, next) => {
  const truckers = await Trucker.find().populate("user", "name email");

  res.status(200).json({
    success: true,
    count: truckers.length,
    data: truckers,
  });
});

// @desc    Get single trucker
// @route   GET /api/truckers/:id
// @access  Private
exports.getTrucker = asyncHandler(async (req, res, next) => {
  const trucker = await Trucker.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!trucker) {
    return next(
      new ErrorResponse(`Trucker not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: trucker,
  });
});

// @desc    Create new trucker
// @route   POST /api/truckers
// @access  Public
exports.createTrucker = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for existing trucker
  const existingTrucker = await Trucker.findOne({ user: req.user.id });

  if (existingTrucker) {
    return next(
      new ErrorResponse(`User already has a registered trucker profile`, 400)
    );
  }

  const trucker = await Trucker.create(req.body);

  res.status(201).json({
    success: true,
    data: trucker,
  });
});

// @desc    Update trucker
// @route   PUT /api/truckers/:id
// @access  Private
exports.updateTrucker = asyncHandler(async (req, res, next) => {
  let trucker = await Trucker.findById(req.params.id);

  if (!trucker) {
    return next(
      new ErrorResponse(`Trucker not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is trucker owner
  if (trucker.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this trucker`,
        401
      )
    );
  }

  trucker = await Trucker.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: trucker,
  });
});

// @desc    Delete trucker
// @route   DELETE /api/truckers/:id
// @access  Private
exports.deleteTrucker = asyncHandler(async (req, res, next) => {
  const trucker = await Trucker.findById(req.params.id);

  if (!trucker) {
    return next(
      new ErrorResponse(`Trucker not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is trucker owner
  if (trucker.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this trucker`,
        401
      )
    );
  }

  await trucker.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get trucker dashboard data
// @route   GET /api/truckers/dashboard
// @access  Private
exports.getDashboard = asyncHandler(async (req, res, next) => {
  // Get trucker's current loads (assigned and in transit)
  const currentLoads = await Load.find({
    assignedTo: req.user.id,
    status: { $in: ["Assigned", "In Transit"] },
  }).populate("shipper", "name company");

  // Get available loads for bidding
  const availableLoads = await Load.find({
    status: { $in: ["Posted", "Bidding"] },
    assignedTo: null,
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("shipper", "name company");

  // Get completed loads
  const completedLoads = await Load.find({
    assignedTo: req.user.id,
    status: { $in: ["Delivered", "Completed"] },
  });

  // Calculate total earnings from completed loads
  const totalEarnings = completedLoads.reduce((acc, load) => {
    return (
      acc + (load.winningBid ? load.winningBid.amount : load.budget.amount)
    );
  }, 0);

  // Calculate on-time delivery rate
  const onTimeDeliveryCount = completedLoads.filter(
    (load) =>
      new Date(load.actualDeliveryDate) <= new Date(load.schedule.deliveryDate)
  ).length;
  const onTimeDeliveryRate =
    completedLoads.length > 0 ? onTimeDeliveryCount / completedLoads.length : 0;

  // Get trucker's average rating
  const trucker = await User.findById(req.user.id).select("ratings");
  const averageRating =
    trucker.ratings.length > 0
      ? trucker.ratings.reduce((acc, rating) => acc + rating, 0) /
        trucker.ratings.length
      : 0;

  res.status(200).json({
    success: true,
    data: {
      statistics: {
        totalLoadsDelivered: completedLoads.length,
        activeLoadCount: currentLoads.length,
        totalEarnings,
        averageRating,
        onTimeDeliveryRate,
      },
      currentLoads,
      availableLoads,
    },
  });
});

// @desc    Get trucker's loads
// @route   GET /api/truckers/loads
// @access  Private
exports.getLoads = asyncHandler(async (req, res, next) => {
  const loads = await Load.find({
    assignedTo: req.user.id,
  })
    .sort({ createdAt: -1 })
    .populate("shipper", "name company");

  res.status(200).json({
    success: true,
    data: loads,
  });
});

// @desc    Get trucker's bids
// @route   GET /api/truckers/bids
// @access  Private
exports.getBids = asyncHandler(async (req, res, next) => {
  const bids = await Bid.find({
    trucker: req.user.id,
  })
    .sort({ createdAt: -1 })
    .populate({
      path: "load",
      select: "title status pickupLocation deliveryLocation schedule budget",
      populate: {
        path: "shipper",
        select: "name company",
      },
    });

  res.status(200).json({
    success: true,
    data: bids,
  });
});

// @desc    Get trucker's earnings
// @route   GET /api/truckers/earnings
// @access  Private
exports.getEarnings = asyncHandler(async (req, res, next) => {
  const completedLoads = await Load.find({
    assignedTo: req.user.id,
    status: { $in: ["Delivered", "Completed"] },
  }).sort({ completedAt: -1 });

  // Calculate monthly earnings
  const monthlyEarnings = completedLoads.reduce((acc, load) => {
    const month = new Date(load.completedAt).toISOString().slice(0, 7); // YYYY-MM
    const amount = load.winningBid
      ? load.winningBid.amount
      : load.budget.amount;

    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += amount;
    return acc;
  }, {});

  // Calculate total earnings
  const totalEarnings = Object.values(monthlyEarnings).reduce(
    (acc, amount) => acc + amount,
    0
  );

  // Calculate average earnings per load
  const averageEarningsPerLoad =
    completedLoads.length > 0 ? totalEarnings / completedLoads.length : 0;

  res.status(200).json({
    success: true,
    data: {
      totalEarnings,
      averageEarningsPerLoad,
      monthlyEarnings,
      recentCompletedLoads: completedLoads.slice(0, 5),
    },
  });
});

// @desc    Get trucker's performance metrics
// @route   GET /api/truckers/performance
// @access  Private
exports.getPerformance = asyncHandler(async (req, res, next) => {
  const trucker = await User.findById(req.user.id).select("ratings");
  const completedLoads = await Load.find({
    assignedTo: req.user.id,
    status: { $in: ["Delivered", "Completed"] },
  });

  // Calculate on-time delivery rate
  const onTimeDeliveryCount = completedLoads.filter(
    (load) =>
      new Date(load.actualDeliveryDate) <= new Date(load.schedule.deliveryDate)
  ).length;
  const onTimeDeliveryRate =
    completedLoads.length > 0 ? onTimeDeliveryCount / completedLoads.length : 0;

  // Calculate average rating
  const averageRating =
    trucker.ratings.length > 0
      ? trucker.ratings.reduce((acc, rating) => acc + rating, 0) /
        trucker.ratings.length
      : 0;

  // Calculate load acceptance rate
  const totalLoadOffers = await Load.countDocuments({
    assignedTo: req.user.id,
  });
  const loadAcceptanceRate =
    totalLoadOffers > 0 ? completedLoads.length / totalLoadOffers : 0;

  res.status(200).json({
    success: true,
    data: {
      totalLoadsDelivered: completedLoads.length,
      onTimeDeliveryRate,
      averageRating,
      loadAcceptanceRate,
      ratings: trucker.ratings,
    },
  });
});
