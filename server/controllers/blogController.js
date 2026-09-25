import Blog from '../models/Blog.js';
import Category from '../models/Category.js';
import Comment from '../models/Comment.js';
import slugify from 'slugify';

// @desc    Get all published blogs (Public)
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 6;
    const startIndex = (page - 1) * limit;

    const query = { status: 'published' };

    // Filter by search keyword
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { title: searchRegex },
        { excerpt: searchRegex },
        { content: searchRegex },
        { tags: searchRegex },
      ];
    }

    // Filter by category slug or ID
    if (req.query.category) {
      if (req.query.category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = req.query.category;
      } else {
        const foundCategory = await Category.findOne({ slug: req.query.category.toLowerCase() });
        if (foundCategory) {
          query.category = foundCategory._id;
        } else {
          return res.status(200).json({
            success: true,
            count: 0,
            pagination: { page, limit, totalPages: 0, totalCount: 0 },
            blogs: [],
          });
        }
      }
    }

    // Filter by tag
    if (req.query.tag) {
      query.tags = { $in: [new RegExp(`^${req.query.tag}$`, 'i')] };
    }

    // Sorting
    let sort = { publishedAt: -1, createdAt: -1 };
    if (req.query.sort === 'popular' || req.query.sort === 'views') {
      sort = { views: -1, publishedAt: -1 };
    } else if (req.query.sort === 'likes') {
      sort = { likes: -1, publishedAt: -1 };
    } else if (req.query.sort === 'oldest') {
      sort = { publishedAt: 1, createdAt: 1 };
    }

    const totalCount = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate('category', 'name slug color icon')
      .populate('author', 'name avatar')
      .select('-content') // exclude heavy full content for listings
      .sort(sort)
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: blogs.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit) || 1,
        totalCount,
      },
      blogs,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get featured blogs for Hero & highlights
// @route   GET /api/blogs/featured
// @access  Public
export const getFeaturedBlogs = async (req, res, next) => {
  try {
    let featured = await Blog.find({ status: 'published', featured: true })
      .populate('category', 'name slug color icon')
      .populate('author', 'name avatar')
      .select('-content')
      .sort({ publishedAt: -1 })
      .limit(3);

    // Fallback to latest posts if none are explicitly marked as featured
    if (featured.length === 0) {
      featured = await Blog.find({ status: 'published' })
        .populate('category', 'name slug color icon')
        .populate('author', 'name avatar')
        .select('-content')
        .sort({ views: -1, publishedAt: -1 })
        .limit(3);
    }

    res.status(200).json({
      success: true,
      blogs: featured,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single blog by slug (Public detail view)
// @route   GET /api/blogs/slug/:slug
// @access  Public
export const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug.toLowerCase(),
      status: 'published',
    })
      .populate('category', 'name slug color icon description')
      .populate('author', 'name avatar bio socialLinks');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found or not yet published.',
      });
    }

    // Increment view count asynchronously
    blog.views += 1;
    await blog.save({ validateBeforeSave: false });

    // Fetch approved comments
    const comments = await Comment.find({
      blog: blog._id,
      status: 'approved',
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      blog,
      comments,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get related blogs by category or tags
// @route   GET /api/blogs/:id/related
// @access  Public
export const getRelatedBlogs = async (req, res, next) => {
  try {
    const current = await Blog.findById(req.params.id);
    if (!current) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const related = await Blog.find({
      _id: { $ne: current._id },
      status: 'published',
      $or: [
        { category: current.category },
        { tags: { $in: current.tags } },
      ],
    })
      .populate('category', 'name slug color icon')
      .populate('author', 'name avatar')
      .select('-content')
      .limit(3)
      .sort({ publishedAt: -1 });

    res.status(200).json({
      success: true,
      blogs: related,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Like a blog
// @route   POST /api/blogs/:id/like
// @access  Public
export const likeBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    blog.likes += 1;
    await blog.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      likes: blog.likes,
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

// @desc    Get all blogs for Admin (including drafts)
// @route   GET /api/blogs/admin/all
// @access  Private/Admin
export const getAdminBlogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const query = {};

    if (req.query.status && ['published', 'draft'].includes(req.query.status)) {
      query.status = req.query.status;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [{ title: searchRegex }, { excerpt: searchRegex }];
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    const totalCount = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate('category', 'name slug color')
      .populate('author', 'name')
      .select('-content')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: blogs.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit) || 1,
        totalCount,
      },
      blogs,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single blog by ID for Admin editing
// @route   GET /api/blogs/admin/:id
// @access  Private/Admin
export const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('author', 'name email');

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a blog post
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = async (req, res, next) => {
  try {
    const { title, content, excerpt, coverImage, category, tags, status, featured } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, and category are required.',
      });
    }

    // Generate unique slug
    let baseSlug = slugify(title, { lower: true, strict: true }) || `post-${Date.now()}`;
    let slug = baseSlug;
    let counter = 1;
    while (await Blog.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Process tags array
    const processedTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const autoExcerpt = excerpt && excerpt.trim()
      ? excerpt.trim()
      : content.replace(/<[^>]*>/g, '').slice(0, 160) + '...';

    const blog = await Blog.create({
      title,
      slug,
      content,
      excerpt: autoExcerpt,
      coverImage: coverImage || undefined,
      category,
      tags: processedTags,
      author: req.user._id,
      status: status || 'draft',
      featured: Boolean(featured),
      publishedAt: status === 'published' ? new Date() : null,
    });

    res.status(201).json({
      success: true,
      message: status === 'published' ? 'Blog published successfully!' : 'Draft saved successfully!',
      blog,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a blog post
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    const { title, content, excerpt, coverImage, category, tags, status, featured } = req.body;

    if (title && title !== blog.title) {
      blog.title = title;
      let baseSlug = slugify(title, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;
      while (await Blog.findOne({ slug, _id: { $ne: blog._id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      blog.slug = slug;
    }

    if (content !== undefined) blog.content = content;
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (coverImage !== undefined) blog.coverImage = coverImage;
    if (category) blog.category = category;
    if (featured !== undefined) blog.featured = Boolean(featured);

    if (tags !== undefined) {
      blog.tags = Array.isArray(tags)
        ? tags
        : typeof tags === 'string'
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];
    }

    if (status) {
      if (status === 'published' && blog.status !== 'published') {
        blog.publishedAt = new Date();
      }
      blog.status = status;
    }

    const updatedBlog = await blog.save();

    res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      blog: updatedBlog,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle blog status (draft <-> published)
// @route   PATCH /api/blogs/:id/toggle-status
// @access  Private/Admin
export const toggleStatus = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    blog.status = blog.status === 'published' ? 'draft' : 'published';
    if (blog.status === 'published' && !blog.publishedAt) {
      blog.publishedAt = new Date();
    }

    await blog.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: `Blog status updated to ${blog.status}`,
      status: blog.status,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // Delete associated comments
    await Comment.deleteMany({ blog: blog._id });
    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Blog post and related comments deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get dashboard statistics for Admin
// @route   GET /api/blogs/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      totalCategories,
      totalComments,
      pendingComments,
      viewsAggregation,
      recentBlogs,
      recentComments,
    ] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ status: 'published' }),
      Blog.countDocuments({ status: 'draft' }),
      Category.countDocuments(),
      Comment.countDocuments(),
      Comment.countDocuments({ status: 'pending' }),
      Blog.aggregate([{ $group: { _id: null, totalViews: { $sum: '$views' }, totalLikes: { $sum: '$likes' } } }]),
      Blog.find()
        .populate('category', 'name color')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title slug status views likes createdAt'),
      Comment.find()
        .populate('blog', 'title slug')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    const totalViews = viewsAggregation[0]?.totalViews || 0;
    const totalLikes = viewsAggregation[0]?.totalLikes || 0;

    res.status(200).json({
      success: true,
      stats: {
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        totalCategories,
        totalComments,
        pendingComments,
        totalViews,
        totalLikes,
      },
      recentBlogs,
      recentComments,
    });
  } catch (err) {
    next(err);
  }
};
