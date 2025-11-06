import CreditBill from '../models/CreditBill.js';
import User from '../models/User.js';

// @desc    Create credit bill
// @route   POST /api/bills
// @access  Private (User only)
export const createCreditBill = async (req, res) => {
  try {
    const { invoiceNumber, customerName, amount, route, billDate } = req.body;

    // Check if invoice number already exists in the same route for this agency
    const existingBill = await CreditBill.findOne({
      invoiceNumber,
      route,
      agencyId: req.user.agencyId
    });

    if (existingBill) {
      return res.status(400).json({ 
        message: `Invoice number "${invoiceNumber}" already exists in route "${route}". Please use a different invoice number for this route.` 
      });
    }

    // Calculate due date (30 days from bill date)
    const dueDate = new Date(billDate);
    dueDate.setDate(dueDate.getDate() + 30);

    const bill = await CreditBill.create({
      invoiceNumber,
      customerName,
      amount,
      route,
      billDate,
      dueDate,
      agencyId: req.user.agencyId,
      agencyName: req.user.agencyName,
      createdBy: req.user._id,
      createdByUsername: req.user.username
    });

    res.status(201).json(bill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get credit bills
// @route   GET /api/bills
// @access  Private
export const getCreditBills = async (req, res) => {
  try {
    let query = {};

    // If user is not admin, filter by agency
    if (req.user.role !== 'admin') {
      query.agencyId = req.user.agencyId;
    }

    // Optional filters from query params
    if (req.query.route && req.query.route !== 'all') {
      query.route = req.query.route;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    const bills = await CreditBill.find(query).sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update bill status
// @route   PUT /api/bills/:id
// @access  Private
export const updateBillStatus = async (req, res) => {
  try {
    const bill = await CreditBill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && bill.agencyId.toString() !== req.user.agencyId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    bill.status = req.body.status || bill.status;
    const updatedBill = await bill.save();

    res.json(updatedBill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete credit bill
// @route   DELETE /api/bills/:id
// @access  Private (Admin only)
export const deleteCreditBill = async (req, res) => {
  try {
    const bill = await CreditBill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    await bill.deleteOne();
    res.json({ message: 'Bill removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
