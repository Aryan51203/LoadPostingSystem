const Trucker = require("../models/Trucker");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

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
