const mongoose = require('mongoose');

const TruckerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driverLicense: {
    number: {
      type: String,
      required: [true, 'Please provide a driver license number']
    },
    issueDate: {
      type: Date,
      required: [true, 'Please provide the driver license issue date'],
      // Validate license is older than 5 years
      validate: {
        validator: function(val) {
          const fiveYearsAgo = new Date();
          fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
          return val <= fiveYearsAgo;
        },
        message: 'Driver must have held license for more than 5 years'
      }
    },
    expiryDate: {
      type: Date,
      required: [true, 'Please provide the driver license expiry date']
    },
    state: {
      type: String,
      required: [true, 'Please provide the state of issuance']
    }
  },
  truck: {
    model: {
      type: String,
      required: [true, 'Please provide the truck model']
    },
    year: {
      type: Number,
      required: [true, 'Please provide the truck manufacturing year'],
      // Validate truck age is not more than 5 years
      validate: {
        validator: function(val) {
          const currentYear = new Date().getFullYear();
          return currentYear - val <= 5;
        },
        message: 'Truck must not be more than 5 years old'
      }
    },
    registrationNumber: {
      type: String,
      required: [true, 'Please provide the truck registration number']
    },
    capacity: {
      type: Number,
      required: [true, 'Please provide the truck capacity in tons']
    },
    type: {
      type: String,
      enum: ['Flatbed', 'Refrigerated', 'Container', 'Tanker', 'Other'],
      required: [true, 'Please specify the truck type']
    }
  },
  accidentHistory: {
    hasAccidents: {
      type: Boolean,
      default: false
    },
    details: [{
      date: Date,
      description: String,
      severity: {
        type: String,
        enum: ['Minor', 'Moderate', 'Major']
      }
    }]
  },
  theftComplaints: {
    hasComplaints: {
      type: Boolean,
      default: false
    },
    details: [{
      date: Date,
      description: String,
      status: {
        type: String,
        enum: ['Pending', 'Resolved', 'Dismissed']
      }
    }]
  },
  insuranceDetails: {
    provider: String,
    policyNumber: String,
    expiryDate: Date,
    coverage: Number
  },
  availabilityStatus: {
    type: String,
    enum: ['Available', 'On Trip', 'Maintenance', 'Off Duty'],
    default: 'Available'
  },
  preferredRoutes: [{
    from: {
      state: String,
      city: String
    },
    to: {
      state: String,
      city: String
    }
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  accountStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Suspended', 'Rejected'],
    default: 'Pending'
  },
  documentsVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to check eligibility based on criteria
TruckerSchema.methods.checkEligibility = function() {
  const eligibility = {
    isEligible: true,
    reasons: []
  };

  // Check license age (>5 years)
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
  if (this.driverLicense.issueDate > fiveYearsAgo) {
    eligibility.isEligible = false;
    eligibility.reasons.push('Driver license must be held for more than 5 years');
  }

  // Check truck age (≤5 years)
  const currentYear = new Date().getFullYear();
  if (currentYear - this.truck.year > 5) {
    eligibility.isEligible = false;
    eligibility.reasons.push('Truck must not be more than 5 years old');
  }

  // Check for accident history
  if (this.accidentHistory.hasAccidents) {
    eligibility.isEligible = false;
    eligibility.reasons.push('No accidents allowed');
  }

  // Check for theft complaints
  if (this.theftComplaints.hasComplaints) {
    eligibility.isEligible = false;
    eligibility.reasons.push('No theft complaints allowed');
  }

  return eligibility;
};

module.exports = mongoose.model('Trucker', TruckerSchema); 