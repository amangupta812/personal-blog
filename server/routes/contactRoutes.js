import express from 'express';
import {
  submitContact,
  getContactMessages,
  markContactAsRead,
  deleteContactMessage,
} from '../controllers/contactController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitContact);
router.get('/admin/all', protect, adminOnly, getContactMessages);
router.patch('/admin/:id/read', protect, adminOnly, markContactAsRead);
router.delete('/admin/:id', protect, adminOnly, deleteContactMessage);

export default router;
