import mongoose from 'mongoose';
import slugify from 'slugify';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a blog title'],
      trim: true,
      maxlength: [160, 'Title cannot exceed 160 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Please add blog content'],
    },
    excerpt: {
      type: String,
      required: [true, 'Please add a short excerpt'],
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
      trim: true,
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please select a category'],
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true,
    },
    readTime: {
      type: Number,
      default: 3,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate read time and slug
blogSchema.pre('save', function (next) {
  if (this.isModified('content')) {
    const wordCount = (this.content || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
    this.readTime = Math.max(1, Math.ceil(wordCount / 200));
  }

  if (this.isModified('title') && (!this.slug || this.isNew)) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Text index for search
blogSchema.index({ title: 'text', content: 'text', excerpt: 'text', tags: 'text' });

export default mongoose.model('Blog', blogSchema);
