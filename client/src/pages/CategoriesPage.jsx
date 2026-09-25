import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderTree, ArrowRight, Sparkles, Layers, BookOpen } from 'lucide-react';
import { categoryAPI } from '../services/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      setLoading(true);
      try {
        const res = await categoryAPI.getAll();
        if (res.data?.success) {
          setCategories(res.data.categories || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>Architectural Disciplines</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Explore by Category
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Articles organized into focused knowledge streams so you can master topics deeply.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800">
          <p className="text-slate-400">No categories found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="group relative p-8 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: `${cat.color || '#6366f1'}20`,
                    color: cat.color || '#6366f1',
                    boxShadow: `0 8px 24px -4px ${cat.color || '#6366f1'}30`,
                  }}
                >
                  <FolderTree className="w-7 h-7" />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                    {cat.postCount || 0} {cat.postCount === 1 ? 'post' : 'posts'}
                  </span>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed mt-2">
                  {cat.description || 'Specialized articles covering architectural best practices and production lessons.'}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
                  Slug: {cat.slug}
                </span>

                <Link
                  to={`/blogs?category=${cat.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors"
                >
                  <span>Browse Articles</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
