import Collection from '../models/Collection.js';
import CreditBill from '../models/CreditBill.js';

// @desc    Create collection
// @route   POST /api/collections
// @access  Private (User only)
export const createCollection = async (req, res) => {
  try {
    const { invoiceNumber, billId, customerName, billAmount, amount, paymentMethod, route, collectionDate, notes } = req.body;

    // Verify bill exists
    const bill = await CreditBill.findById(billId);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && bill.agencyId.toString() !== req.user.agencyId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const collection = await Collection.create({
      invoiceNumber,
      billId,
      customerName,
      billAmount,
      amount,
      paymentMethod,
      route,
      collectionDate,
      notes,
      agencyId: req.user.agencyId,
      agencyName: req.user.agencyName,
      collectedBy: req.user._id,
      collectedByUsername: req.user.username
    });

    // Update bill status if fully paid
    const totalCollected = await Collection.aggregate([
      { $match: { billId: bill._id } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const collectedAmount = totalCollected.length > 0 ? totalCollected[0].total : 0;

    if (collectedAmount >= bill.amount) {
      bill.status = 'paid';
      await bill.save();
    }

    res.status(201).json(collection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get collections
// @route   GET /api/collections
// @access  Private
export const getCollections = async (req, res) => {
  try {
    let query = {};

    // If user is not admin, filter by agency
    if (req.user.role !== 'admin') {
      query.agencyId = req.user.agencyId;
    }

    const collections = await Collection.find(query).sort({ createdAt: -1 });
    res.json(collections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get collections by bill
// @route   GET /api/collections/bill/:billId
// @access  Private
export const getCollectionsByBill = async (req, res) => {
  try {
    const collections = await Collection.find({ billId: req.params.billId });
    res.json(collections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
