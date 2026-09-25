import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Eye,
  Heart,
  FolderTree,
  MessageSquare,
  PlusCircle,
  TrendingUp,
  CheckCircle2,
  Clock,
  ExternalLink,
  Edit,
  Trash2,
} from 'lucide-react';
import { blogAPI } from '../../services/api';
import { useToast } from '../../components/Toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [recentComments, setRecentComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await blogAPI.getStats();
      if (res.data?.success) {
        setStats(res.data.stats);
        setRecentBlogs(res.data.recentBlogs || []);
        setRecentComments(res.data.recentComments || []);
      }
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      addToast('Failed to load dashboard metrics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      const res = await blogAPI.toggleStatus(id);
      if (res.data?.success) {
        addToast(res.data.message || 'Status updated', 'success');
        fetchStats();
      }
    } catch (err) {
      addToast('Failed to toggle status.', 'error');
    }
  };

  const handleDeleteBlog = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await blogAPI.delete(id);
      if (res.data?.success) {
        addToast('Blog post deleted successfully.', 'success');
        fetchStats();
      }
    } catch (err) {
      addToast('Failed to delete post.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-900 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Articles',
      value: stats?.totalBlogs || 0,
      sub: `${stats?.publishedBlogs || 0} published • ${stats?.draftBlogs || 0} drafts`,
      icon: FileText,
      color: 'text-indigo-400',
      bg: 'bg-indigo-950/40',
    },
    {
      title: 'Total Article Views',
      value: (stats?.totalViews || 0).toLocaleString(),
      sub: 'Lifetime reader impressions',
      icon: Eye,
      color: 'text-sky-400',
      bg: 'bg-sky-950/40',
    },
    {
      title: 'Total Reader Likes',
      value: (stats?.totalLikes || 0).toLocaleString(),
      sub: 'Reader engagement score',
      icon: Heart,
      color: 'text-rose-400',
      bg: 'bg-rose-950/40',
    },
    {
      title: 'Active Categories',
      value: stats?.totalCategories || 0,
      sub: `${stats?.totalComments || 0} total comments`,
      icon: FolderTree,
      color: 'text-purple-400',
      bg: 'bg-purple-950/40',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Dashboard Overview</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Monitor real-time readership, manage publications, and review comments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/blogs/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Article</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-slate-400 block">{card.title}</span>
                <span className="text-2xl font-black text-white mt-1 block">{card.value}</span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">{card.sub}</span>
              </div>
              <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Articles & Status Moderation */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Recent Publications</h2>
          <Link
            to="/admin/blogs"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Manage All Articles →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-950/60 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Article</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Views</th>
                <th className="py-3 px-4">Likes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentBlogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No articles published yet. Click "Create Article" to get started!
                  </td>
                </tr>
              ) : (
                recentBlogs.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white max-w-xs truncate">
                      {b.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${b.category?.color || '#6366f1'}20`,
                          color: b.category?.color || '#818cf8',
                        }}
                      >
                        {b.category?.name || 'General'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(b._id)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                          b.status === 'published'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900/60'
                            : 'bg-amber-950/80 text-amber-400 border border-amber-500/30 hover:bg-amber-900/60'
                        }`}
                        title="Click to toggle Draft / Published"
                      >
                        {b.status === 'published' ? '● Published' : '○ Draft'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{b.views || 0}</td>
                    <td className="py-3.5 px-4 text-slate-400">{b.likes || 0}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {b.status === 'published' && (
                          <Link
                            to={`/blog/${b.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-indigo-400 transition-colors"
                            title="View on site"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          to={`/admin/blogs/edit/${b._id}`}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 transition-colors"
                          title="Edit article"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteBlog(b._id, b.title)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
