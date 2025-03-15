const Bid = require("../models/Bid");
const Load = require("../models/Load");
const Trucker = require("../models/Trucker");
const mongoose = require("mongoose");

// @desc    Create a new bid
// @route   POST /api/bids
// @access  Private/Trucker
exports.createBid = async (req, res) => {
  try {
    const {
      loadId,
      amount,
      message,
      proposedPickupDate,
      proposedDeliveryDate,
    } = req.body;

    // Check if load exists
    const load = await Load.findById(loadId);

    if (!load) {
      return res.status(404).json({
        success: false,
        error: "Load not found",
      });
    }

    // Check if load status allows bidding
    if (!["Posted", "Bidding"].includes(load.status)) {
      return res.status(400).json({
        success: false,
        error: `Cannot bid on a load with status '${load.status}'`,
      });
    }

    // Validate user is a trucker
    const trucker = await Trucker.findOne({ user: req.user.id });

    if (!trucker) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to create bids. Only truckers can bid on loads.",
      });
    }

    // Check trucker eligibility based on load criteria
    const eligibilityResults = await checkTruckerEligibility(trucker, load);

    if (!eligibilityResults.isEligible) {
      return res.status(400).json({
        success: false,
        error: "You do not meet the eligibility criteria for this load",
        reasons: eligibilityResults.reasons,
      });
    }

    // Check if trucker already has a bid on this load
    const existingBid = await Bid.findOne({
      load: loadId,
      trucker: trucker._id,
      status: { $in: ["Pending", "Accepted"] },
    });

    if (existingBid) {
      return res.status(400).json({
        success: false,
        error: "You already have an active bid for this load",
      });
    }

    // Create new bid
    const bid = await Bid.create({
      load: loadId,
      trucker: trucker._id,
      amount,
      currency: load.budget.currency, // Match the currency from the load
      message,
      proposedPickupDate,
      proposedDeliveryDate,
      expiresAt: load.expiresAt, // Optional, expires when load expires
    });

    // Update load status to Bidding if it was just Posted
    if (load.status === "Posted") {
      await Load.findByIdAndUpdate(loadId, { status: "Bidding" });
    }

    res.status(201).json({
      success: true,
      data: bid,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);

      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      console.error(err);
      res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  }
};

// Helper function to check trucker eligibility
async function checkTruckerEligibility(trucker, load) {
  const result = {
    isEligible: true,
    reasons: [],
  };

  const criteria = load.eligibilityCriteria || {};

  // Check accident history
  if (criteria.maxAccidentHistory !== undefined) {
    if (trucker.accidentHistory.hasAccidents) {
      const accidentCount = trucker.accidentHistory.details
        ? trucker.accidentHistory.details.length
        : 0;
      if (accidentCount > criteria.maxAccidentHistory) {
        result.isEligible = false;
        result.reasons.push(
          `You have ${accidentCount} accidents in your history, but the maximum allowed is ${criteria.maxAccidentHistory}`
        );
      }
    }
  }

  // Check theft complaints
  if (criteria.maxTheftComplaints !== undefined) {
    if (trucker.theftComplaints.hasComplaints) {
      const complaintCount = trucker.theftComplaints.details
        ? trucker.theftComplaints.details.length
        : 0;
      if (complaintCount > criteria.maxTheftComplaints) {
        result.isEligible = false;
        result.reasons.push(
          `You have ${complaintCount} theft complaints in your history, but the maximum allowed is ${criteria.maxTheftComplaints}`
        );
      }
    }
  }

  // Check truck age
  if (criteria.maxTruckAge !== undefined) {
    const currentYear = new Date().getFullYear();
    const truckAge = currentYear - trucker.truck.year;
    if (truckAge > criteria.maxTruckAge) {
      result.isEligible = false;
      result.reasons.push(
        `Your truck is ${truckAge} years old, but the maximum age allowed is ${criteria.maxTruckAge} years`
      );
    }
  }

  // Check driver license experience
  if (criteria.minExperienceYears !== undefined) {
    const issueDate = new Date(trucker.driverLicense.issueDate);
    const today = new Date();
    const experienceYears = Math.floor(
      (today - issueDate) / (365.25 * 24 * 60 * 60 * 1000)
    );

    if (experienceYears < criteria.minExperienceYears) {
      result.isEligible = false;
      result.reasons.push(
        `You have ${experienceYears} years of driving experience, but the minimum required is ${criteria.minExperienceYears} years`
      );
    }
  }

  return result;
}

// @desc    Get all bids for a specific load
// @route   GET /api/bids/load/:loadId
// @access  Private
exports.getBidsByLoad = async (req, res) => {
  try {
    const { loadId } = req.params;

    // Check if load exists
    const load = await Load.findById(loadId);

    if (!load) {
      return res.status(404).json({
        success: false,
        error: "Load not found",
      });
    }

    // Only shipper who posted the load or trucker who placed a bid can see bids
    const trucker = await Trucker.findOne({ user: req.user.id });
    const isShipper = load.shipper.toString() === req.user.id;
    const isTrucker = trucker ? true : false;

    if (!isShipper && !isTrucker) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to view these bids",
      });
    }

    let bids;

    // If user is the shipper, they can see all bids for their load
    if (isShipper) {
      bids = await Bid.find({ load: loadId })
        .populate("trucker", "companyName contactName contactPhone rating")
        .sort({ amount: 1 }); // Sort by lowest bid first
    } else {
      // If user is a trucker, they can only see their own bids
      bids = await Bid.find({
        load: loadId,
        trucker: trucker._id,
      });
    }

    res.status(200).json({
      success: true,
      count: bids.length,
      data: bids,
    });
  } catch (err) {
    console.error(err);

    // Handle invalid ObjectID format
    if (err.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        error: "Load not found",
      });
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Get bids placed by a trucker
// @route   GET /api/bids/trucker
// @access  Private/Trucker
exports.getTruckerBids = async (req, res) => {
  try {
    // Validate user is a trucker
    const trucker = await Trucker.findOne({ user: req.user.id });

    if (!trucker) {
      return res.status(401).json({
        success: false,
        error: "Not authorized. Only truckers can access their bids.",
      });
    }

    const bids = await Bid.find({ trucker: trucker._id })
      .populate({
        path: "load",
        select: "title pickupLocation deliveryLocation schedule status",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      data: bids,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Update a bid (withdraw, modify, etc.)
// @route   PUT /api/bids/:id
// @access  Private/Trucker
exports.updateBid = async (req, res) => {
  try {
    let bid = await Bid.findById(req.params.id);

    if (!bid) {
      return res.status(404).json({
        success: false,
        error: "Bid not found",
      });
    }

    // Get trucker
    const trucker = await Trucker.findOne({ user: req.user.id });

    // Check if user is the trucker who placed the bid
    if (!trucker || bid.trucker.toString() !== trucker._id.toString()) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to update this bid",
      });
    }

    // Check if bid status allows updates
    if (bid.status !== "Pending") {
      return res.status(400).json({
        success: false,
        error: `Cannot update a bid with status '${bid.status}'`,
      });
    }

    // Update bid
    bid = await Bid.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: bid,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);

      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      console.error(err);
      res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  }
};

// @desc    Accept a bid
// @route   PUT /api/bids/:id/accept
// @access  Private/Shipper
exports.acceptBid = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bid = await Bid.findById(req.params.id).session(session);

    if (!bid) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        error: "Bid not found",
      });
    }

    // Get load associated with the bid
    const load = await Load.findById(bid.load).session(session);

    if (!load) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        error: "Load not found",
      });
    }

    // Check if user is the shipper who posted the load
    if (load.shipper.toString() !== req.user.id) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({
        success: false,
        error: "Not authorized to accept bids for this load",
      });
    }

    // Check if load status allows accepting bids
    if (!["Posted", "Bidding"].includes(load.status)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        error: `Cannot accept bids for a load with status '${load.status}'`,
      });
    }

    // Check if bid status allows acceptance
    if (bid.status !== "Pending") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        error: `Cannot accept a bid with status '${bid.status}'`,
      });
    }

    // Update bid status to Accepted
    await Bid.findByIdAndUpdate(
      bid._id,
      {
        status: "Accepted",
        isWinningBid: true,
        acceptedAt: Date.now(),
      },
      { session }
    );

    // Update all other bids to Rejected
    await Bid.updateMany(
      {
        load: load._id,
        _id: { $ne: bid._id },
        status: "Pending",
      },
      { status: "Rejected" },
      { session }
    );

    // Update load status and assign trucker
    await Load.findByIdAndUpdate(
      load._id,
      {
        status: "Assigned",
        assignedTo: bid.trucker,
        winningBid: bid._id,
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Bid accepted successfully",
      data: {
        bid: await Bid.findById(bid._id).populate("trucker"),
        load: await Load.findById(load._id),
      },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Get single bid
// @route   GET /api/bids/:id
// @access  Private
exports.getBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id)
      .populate("trucker", "companyName contactName contactPhone rating")
      .populate({
        path: "load",
        select: "title pickupLocation deliveryLocation schedule status",
      });

    if (!bid) {
      return res.status(404).json({
        success: false,
        error: "Bid not found",
      });
    }

    // Get trucker
    const trucker = await Trucker.findOne({ user: req.user.id });

    // Check if user is the trucker who placed the bid or the shipper of the load
    const load = await Load.findById(bid.load);
    const isShipper = load && load.shipper.toString() === req.user.id;
    const isBidder =
      trucker && bid.trucker.toString() === trucker._id.toString();

    if (!isShipper && !isBidder) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to view this bid",
      });
    }

    res.status(200).json({
      success: true,
      data: bid,
    });
  } catch (err) {
    console.error(err);

    // Handle invalid ObjectID format
    if (err.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        error: "Bid not found",
      });
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

exports.getShipperBids = async (req, res) => {
  try {
    // want all the bids that are placed on the loads that the shipper has posted
    const shipper = req.shipper;
    const loads = await Load.find({ shipper: shipper._id });
    const bids = await Bid.find({ load: { $in: loads } }).populate({
      path: "load",
      select: "title",
    });

    // Create a new array with modified bid data
    const modifiedBids = await Promise.all(
      bids.map(async (bid) => {
        const trucker = await Trucker.findById(bid.trucker).populate({
          path: "user",
          select: "name",
        });

        // Create a new object with the bid data and modified trucker info
        return {
          ...bid.toObject(),
          trucker: {
            name: trucker.user.name,
          },
        };
      })
    );

    res.status(200).json({
      success: true,
      data: modifiedBids,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};
