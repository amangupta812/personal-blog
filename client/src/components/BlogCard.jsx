import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Heart, Calendar } from 'lucide-react';

export default function BlogCard({ blog }) {
  if (!blog) return null;

  const formattedDate = new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="group flex flex-col bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1">
      {/* Cover Image */}
      <Link to={`/blog/${blog.slug}`} className="relative aspect-[16/9] overflow-hidden bg-slate-950 block">
        <img
          src={blog.coverImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Category Pill */}
        {blog.category && (
          <div className="absolute top-3 left-3">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md border shadow-sm uppercase tracking-wider"
              style={{
                backgroundColor: `${blog.category.color || '#6366f1'}25`,
                color: blog.category.color || '#818cf8',
                borderColor: `${blog.category.color || '#6366f1'}40`,
              }}
            >
              {blog.category.name}
            </span>
          </div>
        )}

        {/* Read time */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs text-slate-300 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>{blog.readTime || 3} min read</span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {blog.tags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className="text-[11px] font-mono text-slate-400 bg-slate-800/70 px-2 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <Link to={`/blog/${blog.slug}`}>
            <h3 className="text-xl font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
              {blog.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="mt-2 text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {blog.excerpt}
          </p>
        </div>

        {/* Card Footer: Author & Metrics */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2.5">
            <img
              src={blog.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={blog.author?.name || 'Author'}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-indigo-500/30"
            />
            <div>
              <span className="font-medium text-slate-300 block">{blog.author?.name || 'Aman Kumar'}</span>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3 inline" /> {formattedDate}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1 hover:text-slate-300 transition-colors" title="Views">
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              {blog.views || 0}
            </span>
            <span className="flex items-center gap-1 hover:text-rose-400 transition-colors" title="Likes">
              <Heart className="w-3.5 h-3.5 text-rose-500/70" />
              {blog.likes || 0}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
