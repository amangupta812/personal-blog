import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, BookOpen, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { blogAPI, categoryAPI } from '../services/api';
import BlogCard from '../components/BlogCard';

export default function AllBlogs() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State initialized from URL query params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page'), 10) || 1);

  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ totalPages: 1, totalCount: 0 });
  const [loading, setLoading] = useState(true);

  // Load categories once
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryAPI.getAll();
        if (res.data?.success) setCategories(res.data.categories || []);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Sync state with URL params when user modifies filters
  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedTag) params.tag = selectedTag;
    if (sortBy !== 'newest') params.sort = sortBy;
    if (page > 1) params.page = page;

    setSearchParams(params, { replace: true });
  }, [searchTerm, selectedCategory, selectedTag, sortBy, page, setSearchParams]);

  // Fetch blogs based on active filters
  useEffect(() => {
    const fetchFilteredBlogs = async () => {
      setLoading(true);
      try {
        const queryParams = {
          page,
          limit: 6,
          sort: sortBy,
        };
        if (searchTerm) queryParams.search = searchTerm;
        if (selectedCategory) queryParams.category = selectedCategory;
        if (selectedTag) queryParams.tag = selectedTag;

        const res = await blogAPI.getBlogs(queryParams);
        if (res.data?.success) {
          setBlogs(res.data.blogs || []);
          setPagination(res.data.pagination || { totalPages: 1, totalCount: 0 });
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredBlogs();
  }, [searchTerm, selectedCategory, selectedTag, sortBy, page]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedTag('');
    setSortBy('newest');
    setPage(1);
  };

  const hasActiveFilters = Boolean(searchTerm || selectedCategory || selectedTag || sortBy !== 'newest');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Archive &amp; Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          All Articles &amp; Insights
        </h1>
        <p className="mt-2 text-base text-slate-400 max-w-2xl">
          Browse through the complete catalog of tutorials, system architectural designs, and software engineering deep-dives.
        </p>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search by keywords, titles, or concepts..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Read</option>
              <option value="likes">Most Liked</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Domain:
          </span>
          <button
            onClick={() => {
              setSelectedCategory('');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !selectedCategory
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            All Topics
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => {
                setSelectedCategory(cat.slug);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.name} ({cat.postCount || 0})
            </button>
          ))}

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="ml-auto text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          Showing {blogs.length} of {pagination.totalCount} {pagination.totalCount === 1 ? 'article' : 'articles'}
        </span>
        {selectedCategory && (
          <span className="text-indigo-400 font-medium">Filtered by category: {selectedCategory}</span>
        )}
      </div>

      {/* Grid of Articles */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-200">No matching articles</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Try adjusting your search keywords or switching category filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="mt-6 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="pt-8 border-t border-slate-800 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-40 disabled:pointer-events-none text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          <span className="text-sm text-slate-400 font-medium px-4">
            Page <span className="text-white font-bold">{page}</span> of {pagination.totalPages}
          </span>

          <button
            onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
            disabled={page === pagination.totalPages}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-40 disabled:pointer-events-none text-sm font-medium transition-colors"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
