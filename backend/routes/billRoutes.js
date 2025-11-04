import express from 'express';
import {
  createCreditBill,
  getCreditBills,
  updateBillStatus,
  deleteCreditBill
} from '../controller/billController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createCreditBill)
  .get(protect, getCreditBills);

router.route('/:id')
  .put(protect, updateBillStatus)
  .delete(protect, deleteCreditBill);

export default router;
