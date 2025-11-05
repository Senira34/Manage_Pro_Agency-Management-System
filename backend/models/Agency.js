import mongoose from 'mongoose';

const agencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  routes: [{
    type: String,
    required: true
  }],
  contactPerson: {
    type: String
  },
  contactNumber: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Agency = mongoose.model('Agency', agencySchema);

export default Agency;
