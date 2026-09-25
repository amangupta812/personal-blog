import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, ArrowRight, Loader2 } from 'lucide-react';
import { blogAPI } from '../services/api';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Handle Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(true); // Open modal
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await blogAPI.getBlogs({ search: query.trim(), limit: 5 });
        if (res.data?.success) {
          setResults(res.data.blogs || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (slug) => {
    onClose();
    navigate(`/blog/${slug}`);
  };

  const handleViewAll = () => {
    onClose();
    navigate(`/blogs?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && results.length > 0) {
                handleSelect(results[0].slug);
              }
            }}
            placeholder="Search articles by title, topic, or keyword..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-base focus:outline-none"
          />
          {loading && <Loader2 className="w-5 h-5 text-indigo-400 animate-spin shrink-0" />}
          {query && !loading && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-200">
              <X className="w-5 h-5" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-slate-400 bg-slate-800 rounded border border-slate-700 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results container */}
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-slate-400">
              <BookOpen className="w-10 h-10 mx-auto mb-3 text-slate-600" />
              <p className="text-sm font-medium">Type to search across all published articles</p>
              <p className="text-xs text-slate-500 mt-1">Try keywords like "React", "MongoDB", "Architecture", or "Performance"</p>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-base font-semibold text-slate-300">No articles found</p>
              <p className="text-sm text-slate-500 mt-1">
                We couldn't find anything matching "<span className="text-indigo-400">{query}</span>"
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((blog) => (
                <div
                  key={blog._id}
                  onClick={() => handleSelect(blog.slug)}
                  className="group flex items-start gap-4 p-3 rounded-xl hover:bg-slate-800/80 cursor-pointer transition-colors border border-transparent hover:border-slate-700/50"
                >
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-16 h-14 object-cover rounded-lg shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${blog.category?.color || '#6366f1'}20`,
                          color: blog.category?.color || '#6366f1',
                        }}
                      >
                        {blog.category?.name || 'Article'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {blog.readTime || 3} min read
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 truncate transition-colors">
                      {blog.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {blog.excerpt}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all shrink-0 mt-3" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Showing top {results.length} matches</span>
            <button
              onClick={handleViewAll}
              className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
            >
              See all results <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
      <div className="fixed inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
