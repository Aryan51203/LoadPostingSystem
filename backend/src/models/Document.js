const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  trucker: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: [true, "Please add a document type"],
    enum: ["cdl", "insurance", "registration", "dot", "medical", "other"],
  },
  title: {
    type: String,
    required: [true, "Please add a title"],
  },
  fileUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["valid", "expired", "expiring_soon"],
    default: "valid",
  },
  verificationStatus: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
  rejectionReason: {
    type: String,
  },
  expirationDate: {
    type: Date,
    required: [true, "Please add an expiration date"],
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update status based on expiration date
DocumentSchema.pre("save", function (next) {
  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  if (this.expirationDate < now) {
    this.status = "expired";
  } else if (this.expirationDate < thirtyDaysFromNow) {
    this.status = "expiring_soon";
  } else {
    this.status = "valid";
  }

  next();
});

module.exports = mongoose.model("Document", DocumentSchema);
