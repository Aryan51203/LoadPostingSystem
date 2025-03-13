const mongoose = require('mongoose');

const BenefitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a benefit name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: [
      'Insurance', 'Tires', 'Spare Parts', 'Service', 
      'Lodging', 'Food', 'Fuel', 'Other'
    ]
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  provider: {
    name: {
      type: String,
      required: [true, 'Please provide the provider name']
    },
    contact: {
      email: String,
      phone: String,
      website: String
    },
    logo: String
  },
  discountType: {
    type: String,
    enum: ['Percentage', 'Fixed Amount', 'Special Offer'],
    required: [true, 'Please specify the discount type']
  },
  discountValue: {
    type: Number,
    required: [true, 'Please specify the discount value']
  },
  discountUnit: {
    type: String,
    enum: ['%', '$', '€', '£'],
    default: '%'
  },
  eligibility: {
    minimumRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    minimumCompletedLoads: {
      type: Number,
      default: 0
    },
    membershipDuration: {
      type: Number, // in months
      default: 0
    }
  },
  locations: [{
    name: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  }],
  termsAndConditions: String,
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: Date,
  redemptionProcess: {
    type: String,
    enum: ['Code', 'Coupon', 'App Verification', 'Card', 'Manual'],
    default: 'Code'
  },
  redemptionCode: String,
  maxRedemptions: {
    perTrucker: Number,
    total: Number
  },
  currentRedemptions: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Expired', 'Depleted', 'Suspended'],
    default: 'Active'
  },
  claims: [{
    trucker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trucker'
    },
    claimedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Used'],
      default: 'Pending'
    },
    usedAt: Date,
    location: String,
    receiptUrl: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Set up indexing for better performance
BenefitSchema.index({ category: 1 });
BenefitSchema.index({ status: 1 });
BenefitSchema.index({ validFrom: 1, validUntil: 1 });

module.exports = mongoose.model('Benefit', BenefitSchema); 