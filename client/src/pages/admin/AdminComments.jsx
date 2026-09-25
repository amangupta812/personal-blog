import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Check, X, Trash2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { commentAPI } from '../../services/api';
import { useToast } from '../../components/Toast';

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchComments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await commentAPI.getAdminComments(params);
      if (res.data?.success) {
        setComments(res.data.comments || []);
      }
    } catch (err) {
      console.error('Error loading comments:', err);
      addToast('Failed to load comments.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [statusFilter]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await commentAPI.updateStatus(id, newStatus);
      if (res.data?.success) {
        addToast(`Comment marked as ${newStatus}`, 'success');
        fetchComments();
      }
    } catch (err) {
      addToast('Failed to update comment status.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this comment permanently?')) return;

    try {
      const res = await commentAPI.delete(id);
      if (res.data?.success) {
        addToast('Comment deleted.', 'success');
        fetchComments();
      }
    } catch (err) {
      addToast('Failed to delete comment.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Reader Comments</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review, approve, or remove reader discussions across articles.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 w-fit">
        {[
          { label: 'All Comments', value: '' },
          { label: 'Approved', value: 'approved' },
          { label: 'Pending', value: 'pending' },
          { label: 'Rejected', value: 'rejected' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === tab.value
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))
        ) : comments.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800">
            <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No comments found in this view.</p>
          </div>
        ) : (
          comments.map((c) => (
            <div
              key={c._id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-bold text-white text-sm">{c.name}</span>
                  <span className="text-xs text-slate-500 font-mono">{c.email}</span>
                  <span
                    className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                      c.status === 'approved'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : c.status === 'rejected'
                        ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {c.status}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">{c.content}</p>

                {c.blog && (
                  <p className="text-xs text-slate-400">
                    On post:{' '}
                    <Link
                      to={`/blog/${c.blog.slug}`}
                      target="_blank"
                      className="text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      {c.blog.title}
                    </Link>
                  </p>
                )}
              </div>

              {/* Moderation Actions */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                {c.status !== 'approved' && (
                  <button
                    onClick={() => handleUpdateStatus(c._id, 'approved')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900 text-xs font-semibold"
                    title="Approve"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                )}
                {c.status !== 'rejected' && (
                  <button
                    onClick={() => handleUpdateStatus(c._id, 'rejected')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-950/80 border border-amber-500/30 text-amber-400 hover:bg-amber-900 text-xs font-semibold"
                    title="Reject"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(c._id)}
                  className="p-2 rounded-lg bg-slate-950 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
