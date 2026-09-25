import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  FolderTree,
  Eye,
  Heart,
  TrendingUp,
  Terminal,
  Code2,
  Server,
  Layers,
  Search,
} from 'lucide-react';
import { blogAPI, categoryAPI } from '../services/api';
import BlogCard from '../components/BlogCard';

export default function Home() {
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recent'); // 'recent' | 'popular'

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [featRes, blogsRes, catRes] = await Promise.all([
          blogAPI.getFeatured(),
          blogAPI.getBlogs({ limit: 6, sort: activeTab === 'popular' ? 'popular' : 'newest' }),
          categoryAPI.getAll(),
        ]);

        if (featRes.data?.success) setFeaturedBlogs(featRes.data.blogs || []);
        if (blogsRes.data?.success) setRecentBlogs(blogsRes.data.blogs || []);
        if (catRes.data?.success) setCategories(catRes.data.categories || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 overflow-hidden">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-pink-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-medium mb-6 shadow-lg shadow-indigo-950/50">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>Modern Web Architecture • System Design • Full-Stack Craft</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Engineering lessons from <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              production-scale systems.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Welcome to my personal corner of the web. I write deep-dives on React 19, Node.js performance, microservices, and actionable software habits.
          </p>

          {/* Quick Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/blogs"
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm sm:text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center gap-2"
            >
              <span>Explore All Articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/about"
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm sm:text-base transition-all flex items-center gap-2"
            >
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>About Alex Morgan</span>
            </Link>
          </div>

          {/* Social Proof / Stats Strip */}
          <div className="mt-14 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="text-center p-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white block">
                {recentBlogs.length > 0 ? '10+' : '0'}
              </span>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Published Articles</span>
            </div>
            <div className="text-center p-2 border-l border-slate-800">
              <span className="text-2xl sm:text-3xl font-extrabold text-indigo-400 block">
                {categories.length || 5}
              </span>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Core Domains</span>
            </div>
            <div className="text-center p-2 sm:border-l border-slate-800">
              <span className="text-2xl sm:text-3xl font-extrabold text-purple-400 block">12k+</span>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Monthly Readers</span>
            </div>
            <div className="text-center p-2 border-l border-slate-800">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 block">100%</span>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Open Source</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured / Spotlight Posts */}
      {featuredBlogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Curated Highlights</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Featured Articles</h2>
            </div>
            <Link
              to="/blogs"
              className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors group"
            >
              <span>View all</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </section>
      )}

      {/* Categories Explorer */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">Explore by Domain</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Dive into specialized articles grouped by architectural discipline.
                </p>
              </div>
              <Link
                to="/categories"
                className="text-xs font-semibold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                All Categories <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/blogs?category=${cat.slug}`}
                  className="group p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10 block"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${cat.color || '#6366f1'}20`, color: cat.color || '#6366f1' }}
                  >
                    <FolderTree className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors truncate">
                    {cat.name}
                  </h4>
                  <span className="text-xs text-slate-500 mt-1 block">
                    {cat.postCount || 0} {cat.postCount === 1 ? 'article' : 'articles'}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Articles Stream with Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Latest Writings</h2>
            <p className="text-sm text-slate-400 mt-1">
              Fresh insights, tutorials, and system design patterns published weekly.
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'recent'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Most Recent
            </button>
            <button
              onClick={() => setActiveTab('popular')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'popular'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Most Popular
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : recentBlogs.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-lg font-semibold text-slate-300">No articles found</p>
            <p className="text-sm text-slate-500 mt-1">Check back soon for new publications.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition-all hover:border-indigo-500/50"
          >
            <span>Browse All Articles with Search &amp; Filters</span>
            <ArrowRight className="w-4 h-4 text-indigo-400" />
          </Link>
        </div>
      </section>
    </div>
  );
}
