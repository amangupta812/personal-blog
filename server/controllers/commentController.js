import Comment from '../models/Comment.js';
import Blog from '../models/Blog.js';

// @desc    Add comment to a blog
// @route   POST /api/comments/:blogId
// @access  Public
export const addComment = async (req, res, next) => {
  try {
    const { name, email, content } = req.body;
    const { blogId } = req.params;

    if (!name || !email || !content) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and comment content are all required.',
      });
    }

    const blog = await Blog.findById(blogId);
    if (!blog || blog.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found or not published.',
      });
    }

    const comment = await Comment.create({
      blog: blogId,
      name,
      email,
      content,
      status: 'approved', // Auto-approved for friendly engagement, moderation available in admin
    });

    res.status(201).json({
      success: true,
      message: 'Comment posted successfully!',
      comment,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get comments for a blog (Public)
// @route   GET /api/comments/blog/:blogId
// @access  Public
export const getBlogComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      blog: req.params.blogId,
      status: 'approved',
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all comments (Admin moderation)
// @route   GET /api/comments/admin/all
// @access  Private/Admin
export const getAllCommentsAdmin = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }

    const totalCount = await Comment.countDocuments(query);
    const comments = await Comment.find(query)
      .populate('blog', 'title slug')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: comments.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit) || 1,
        totalCount,
      },
      comments,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update comment status (approve/reject/pending)
// @route   PATCH /api/comments/:id/status
// @access  Private/Admin
export const updateCommentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['approved', 'pending', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid comment status. Must be approved, pending, or rejected.',
      });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    comment.status = status;
    await comment.save();

    res.status(200).json({
      success: true,
      message: `Comment status updated to ${status}`,
      comment,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private/Admin
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
