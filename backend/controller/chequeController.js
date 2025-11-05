import Cheque from '../models/Cheque.js';

// @desc    Create cheque
// @route   POST /api/cheques
// @access  Private (User only)
export const createCheque = async (req, res) => {
  try {
    const { chequeNumber, amount, bankName, customerName, route, chequeDate } = req.body;

    const cheque = await Cheque.create({
      chequeNumber,
      amount,
      bankName,
      customerName,
      route,
      chequeDate,
      agencyId: req.user.agencyId,
      agencyName: req.user.agencyName,
      createdBy: req.user._id,
      createdByUsername: req.user.username
    });

    res.status(201).json(cheque);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get cheques
// @route   GET /api/cheques
// @access  Private
export const getCheques = async (req, res) => {
  try {
    let query = {};

    // If user is not admin, filter by agency
    if (req.user.role !== 'admin') {
      query.agencyId = req.user.agencyId;
    }

    // Optional filters
    if (req.query.route && req.query.route !== 'all') {
      query.route = req.query.route;
    }

    const cheques = await Cheque.find(query).sort({ createdAt: -1 });
    res.json(cheques);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update cheque status
// @route   PUT /api/cheques/:id
// @access  Private
export const updateChequeStatus = async (req, res) => {
  try {
    const cheque = await Cheque.findById(req.params.id);

    if (!cheque) {
      return res.status(404).json({ message: 'Cheque not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && cheque.agencyId.toString() !== req.user.agencyId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    cheque.status = req.body.status || cheque.status;
    const updatedCheque = await cheque.save();

    res.json(updatedCheque);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
