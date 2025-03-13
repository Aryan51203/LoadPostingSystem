const mongoose = require('mongoose');

const LoadSchema = new mongoose.Schema({
  shipper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shipper',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title for the load'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  cargoType: {
    type: String,
    required: [true, 'Please specify cargo type'],
    enum: [
      'General', 'Hazardous', 'Perishable', 'Fragile', 
      'Heavy Machinery', 'Livestock', 'Vehicles', 'Other'
    ]
  },
  weight: {
    value: {
      type: Number,
      required: [true, 'Please specify the weight']
    },
    unit: {
      type: String,
      enum: ['kg', 'tons', 'lb'],
      default: 'tons'
    }
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'm', 'in', 'ft'],
      default: 'm'
    }
  },
  pickupLocation: {
    address: {
      type: String,
      required: [true, 'Please provide a pickup address']
    },
    city: {
      type: String,
      required: [true, 'Please provide a pickup city']
    },
    state: {
      type: String,
      required: [true, 'Please provide a pickup state']
    },
    zipCode: {
      type: String,
      required: [true, 'Please provide a pickup zip code']
    },
    country: {
      type: String,
      required: [true, 'Please provide a pickup country'],
      default: 'USA'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  deliveryLocation: {
    address: {
      type: String,
      required: [true, 'Please provide a delivery address']
    },
    city: {
      type: String,
      required: [true, 'Please provide a delivery city']
    },
    state: {
      type: String,
      required: [true, 'Please provide a delivery state']
    },
    zipCode: {
      type: String,
      required: [true, 'Please provide a delivery zip code']
    },
    country: {
      type: String,
      required: [true, 'Please provide a delivery country'],
      default: 'USA'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  schedule: {
    pickupDate: {
      type: Date,
      required: [true, 'Please provide a pickup date']
    },
    pickupTimeWindow: {
      from: String,
      to: String
    },
    deliveryDate: {
      type: Date,
      required: [true, 'Please provide a delivery date']
    },
    deliveryTimeWindow: {
      from: String,
      to: String
    },
    flexibleDates: {
      type: Boolean,
      default: false
    }
  },
  budget: {
    amount: {
      type: Number,
      required: [true, 'Please provide a budget amount']
    },
    currency: {
      type: String,
      default: 'USD'
    },
    negotiable: {
      type: Boolean,
      default: true
    }
  },
  requiredTruckType: {
    type: String,
    enum: ['Flatbed', 'Refrigerated', 'Container', 'Tanker', 'Any', 'Other'],
    default: 'Any'
  },
  specialRequirements: [String],
  status: {
    type: String,
    enum: [
      'Posted', 'Bidding', 'Assigned', 'In Transit', 
      'Delivered', 'Completed', 'Cancelled'
    ],
    default: 'Posted'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trucker'
  },
  winningBid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid'
  },
  tracking: {
    currentLocation: {
      latitude: Number,
      longitude: Number,
      updatedAt: Date
    },
    milestones: [{
      name: String,
      status: {
        type: String,
        enum: ['Pending', 'Completed']
      },
      location: {
        latitude: Number,
        longitude: Number
      },
      timestamp: Date,
      notes: String
    }]
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Partial', 'Completed', 'Refunded'],
    default: 'Pending'
  },
  documents: [{
    name: String,
    type: {
      type: String,
      enum: ['Bill of Lading', 'Invoice', 'Insurance', 'Proof of Delivery', 'Other']
    },
    url: String,
    uploadedAt: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  }
});

// Create an index for search and filtering
LoadSchema.index({ 
  'pickupLocation.city': 'text', 
  'pickupLocation.state': 'text',
  'deliveryLocation.city': 'text', 
  'deliveryLocation.state': 'text',
  'title': 'text',
  'description': 'text' 
});

module.exports = mongoose.model('Load', LoadSchema); 