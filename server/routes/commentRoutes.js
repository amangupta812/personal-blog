import express from 'express';
import {
  addComment,
  getBlogComments,
  getAllCommentsAdmin,
  updateCommentStatus,
  deleteComment,
} from '../controllers/commentController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/:blogId', addComment);
router.get('/blog/:blogId', getBlogComments);

router.get('/admin/all', protect, adminOnly, getAllCommentsAdmin);
router.patch('/:id/status', protect, adminOnly, updateCommentStatus);
router.delete('/:id', protect, adminOnly, deleteComment);

export default router;
