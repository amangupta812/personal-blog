import express from 'express';
import {
  getBlogs,
  getFeaturedBlogs,
  getBlogBySlug,
  getRelatedBlogs,
  likeBlog,
  getAdminBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  toggleStatus,
  deleteBlog,
  getDashboardStats,
} from '../controllers/blogController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/slug/:slug', getBlogBySlug);
router.get('/:id/related', getRelatedBlogs);
router.post('/:id/like', likeBlog);

// Admin routes
router.get('/admin/stats', protect, adminOnly, getDashboardStats);
router.get('/admin/all', protect, adminOnly, getAdminBlogs);
router.get('/admin/:id', protect, adminOnly, getBlogById);
router.post('/', protect, adminOnly, createBlog);
router.put('/:id', protect, adminOnly, updateBlog);
router.patch('/:id/toggle-status', protect, adminOnly, toggleStatus);
router.delete('/:id', protect, adminOnly, deleteBlog);

export default router;
