import express from 'express';
import {
  createCheque,
  getCheques,
  updateChequeStatus
} from '../controller/chequeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createCheque)
  .get(protect, getCheques);

router.route('/:id')
  .put(protect, updateChequeStatus);

export default router;
