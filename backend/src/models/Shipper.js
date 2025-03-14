const mongoose = require("mongoose");

const ShipperSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  companyDetails: {
    name: {
      type: String,
      required: [true, "Please provide a company name"],
    },
    registrationNumber: {
      type: String,
    },
    yearEstablished: Number,
    website: String,
    industry: String,
  },
  address: {
    type: String,
    required: [true, "Please provide a company address"],
  },
  contactPerson: {
    name: {
      type: String,
      required: [true, "Please provide a contact person name"],
    },
    position: String,
    phone: {
      type: String,
      required: [true, "Please provide a contact phone number"],
    },
  },
  paymentInfo: {
    preferredMethod: {
      type: String,
      enum: ["Bank Transfer", "Credit Card", "PayPal", "Other"],
      default: "Bank Transfer",
    },
    bankDetails: {
      accountName: String,
      accountNumber: String,
      routingNumber: String,
      bankName: String,
    },
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  verificationStatus: {
    type: String,
    enum: ["Pending", "Verified", "Rejected"],
    default: "Pending",
  },
  frequentRoutes: [
    {
      from: {
        state: String,
        city: String,
      },
      to: {
        state: String,
        city: String,
      },
      frequency: {
        type: String,
        enum: ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"],
      },
    },
  ],
  accountStatus: {
    type: String,
    enum: ["Active", "Inactive", "Suspended"],
    default: "Active",
  },
  documentsVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Shipper", ShipperSchema);
