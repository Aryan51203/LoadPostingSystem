const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema({
  load: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Load',
    required: true
  },
  trucker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trucker',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide a bid amount']
  },
  currency: {
    type: String,
    default: 'USD'
  },
  message: {
    type: String,
    maxlength: [300, 'Message cannot be more than 300 characters']
  },
  proposedPickupDate: {
    type: Date
  },
  proposedDeliveryDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Withdrawn', 'Expired'],
    default: 'Pending'
  },
  isWinningBid: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  },
  acceptedAt: {
    type: Date
  }
});

// Add index for querying efficiently
BidSchema.index({ load: 1, trucker: 1 }, { unique: true });
BidSchema.index({ load: 1, amount: 1 }); // For finding lowest bid easily

// Method to check if this is the lowest bid for a load
BidSchema.methods.isLowestBid = async function() {
  const Bid = this.constructor;
  const lowestBid = await Bid.findOne({ 
    load: this.load,
    status: { $in: ['Pending', 'Accepted'] } 
  })
  .sort({ amount: 1 })
  .limit(1);
  
  return lowestBid && lowestBid._id.equals(this._id);
};

module.exports = mongoose.model('Bid', BidSchema); 