import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true
  },
  billId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CreditBill',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  billAmount: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'cheque', 'bank_transfer'],
    default: 'cash'
  },
  route: {
    type: String,
    required: true
  },
  collectionDate: {
    type: Date,
    required: true
  },
  notes: {
    type: String
  },
  agencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agency',
    required: true
  },
  agencyName: {
    type: String,
    required: true
  },
  collectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collectedByUsername: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection;
