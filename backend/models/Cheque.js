import mongoose from 'mongoose';

const chequeSchema = new mongoose.Schema({
  chequeNumber: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  bankName: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  route: {
    type: String,
    required: true
  },
  chequeDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'cleared', 'bounced'],
    default: 'pending'
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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdByUsername: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Cheque = mongoose.model('Cheque', chequeSchema);

export default Cheque;
