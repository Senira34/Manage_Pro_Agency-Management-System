import express from 'express';
import {
  createCollection,
  getCollections,
  getCollectionsByBill
} from '../controller/collectionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createCollection)
  .get(protect, getCollections);

router.route('/bill/:billId')
  .get(protect, getCollectionsByBill);

export default router;
