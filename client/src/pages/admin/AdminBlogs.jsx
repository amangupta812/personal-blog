import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Filter,
  ExternalLink,
  Edit,
  Trash2,
  Calendar,
  Eye,
  Heart,
  FileText,
} from 'lucide-react';
import { blogAPI } from '../../services/api';
import { useToast } from '../../components/Toast';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const res = await blogAPI.getAdminBlogs(params);
      if (res.data?.success) {
        setBlogs(res.data.blogs || []);
      }
    } catch (err) {
      console.error('Failed to load admin blogs:', err);
      addToast('Error loading blog list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [statusFilter, search]);

  const handleToggleStatus = async (id) => {
    try {
      const res = await blogAPI.toggleStatus(id);
      if (res.data?.success) {
        addToast(res.data.message || 'Status toggled', 'success');
        fetchBlogs();
      }
    } catch (err) {
      addToast('Failed to change status.', 'error');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Permanently delete "${title}"? This cannot be undone.`)) return;

    try {
      const res = await blogAPI.delete(id);
      if (res.data?.success) {
        addToast('Blog post deleted.', 'success');
        fetchBlogs();
      }
    } catch (err) {
      addToast('Failed to delete post.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Articles Catalog</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create, update, toggle publication state, or remove articles.
          </p>
        </div>

        <Link
          to="/admin/blogs/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Article</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
        {/* Status tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
          {['all', 'published', 'draft'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Article</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Read Time</th>
                <th className="py-3.5 px-4">Engagement</th>
                <th className="py-3.5 px-4">Created</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Loading articles...
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    No articles found matching criteria.
                  </td>
                </tr>
              ) : (
                blogs.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={b.coverImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=100&q=80'}
                          alt={b.title}
                          className="w-12 h-10 object-cover rounded-lg shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-semibold text-white truncate">{b.title}</p>
                          <p className="text-[11px] text-slate-500 font-mono truncate">/{b.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
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
                    <td className="py-3.5 px-4 text-xs text-slate-400">
                      {b.readTime || 3} min
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          {b.views || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-rose-500/70" />
                          {b.likes || 0}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {b.status === 'published' && (
                          <Link
                            to={`/blog/${b.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-indigo-400 transition-colors"
                            title="Preview on live site"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          to={`/admin/blogs/edit/${b._id}`}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 transition-colors"
                          title="Edit post"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(b._id, b.title)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete post"
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
