const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  load: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Load'
  },
  transactionType: {
    type: String,
    enum: [
      'Bid Acceptance', 'Deposit', 'Payment', 'Refund', 
      'Commission', 'Penalty', 'Withdrawal', 'Other'
    ],
    required: [true, 'Please specify transaction type']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Please specify an amount']
  },
  currency: {
    type: String,
    default: 'USD'
  },
  fromAccount: {
    accountType: {
      type: String,
      enum: ['Shipper', 'Trucker', 'Platform', 'External'],
      required: [true, 'Please specify from account type']
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'fromAccount.accountType'
    }
  },
  toAccount: {
    accountType: {
      type: String,
      enum: ['Shipper', 'Trucker', 'Platform', 'External'],
      required: [true, 'Please specify to account type']
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'toAccount.accountType'
    }
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Cancelled'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'Bank Transfer', 'PayPal', 'Platform Balance', 'Other'],
    required: [true, 'Please specify payment method']
  },
  reference: {
    type: String,
    trim: true
  },
  metadata: {
    paymentId: String,
    gatewayResponse: Object,
    notes: String
  },
  receiverDetails: {
    name: String,
    accountNumber: String,
    routingNumber: String,
    bankName: String,
    paypalEmail: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
});

// Set up indexes for efficient querying
TransactionSchema.index({ load: 1 });
TransactionSchema.index({ 'fromAccount.accountId': 1, 'fromAccount.accountType': 1 });
TransactionSchema.index({ 'toAccount.accountId': 1, 'toAccount.accountType': 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Transaction', TransactionSchema); 