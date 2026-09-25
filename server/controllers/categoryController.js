import Category from '../models/Category.js';
import Blog from '../models/Blog.js';
import slugify from 'slugify';

// @desc    Get all categories with blog counts
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    // Compute blog count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const postCount = await Blog.countDocuments({
          category: cat._id,
          status: 'published',
        });
        return {
          ...cat.toObject(),
          postCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: categoriesWithCount.length,
      categories: categoriesWithCount,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
// @access  Public
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug.toLowerCase() });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const blogs = await Blog.find({ category: category._id, status: 'published' })
      .populate('author', 'name avatar')
      .populate('category', 'name slug color')
      .sort({ publishedAt: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      category: {
        ...category.toObject(),
        postCount: blogs.length,
      },
      blogs,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, color, icon } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    const slug = slugify(name, { lower: true, strict: true });
    const existing = await Category.findOne({ slug });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name already exists',
      });
    }

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      color: color || '#6366f1',
      icon: icon || 'folder',
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
  try {
    const { name, description, color, icon } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    if (name && name !== category.name) {
      category.name = name;
      category.slug = slugify(name, { lower: true, strict: true });
    }

    if (description !== undefined) category.description = description;
    if (color) category.color = color;
    if (icon) category.icon = icon;

    const updated = await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category: updated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const blogCount = await Blog.countDocuments({ category: category._id });
    if (blogCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category because it contains ${blogCount} blog post(s). Please reassign or delete those posts first.`,
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
