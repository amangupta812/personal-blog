import React, { useState, useEffect } from 'react';
import { Mail, Check, Trash2, Clock, MailOpen, User } from 'lucide-react';
import { contactAPI } from '../../services/api';
import { useToast } from '../../components/Toast';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await contactAPI.getAll();
      if (res.data?.success) {
        setMessages(res.data.messages || []);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
      addToast('Error loading contact messages.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      const res = await contactAPI.markRead(id);
      if (res.data?.success) {
        addToast('Marked as read', 'info');
        fetchMessages();
      }
    } catch (err) {
      addToast('Failed to mark read.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete message?')) return;
    try {
      const res = await contactAPI.delete(id);
      if (res.data?.success) {
        addToast('Message deleted', 'success');
        fetchMessages();
      }
    } catch (err) {
      addToast('Failed to delete message.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Contact Inquiries</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Direct messages and collaboration proposals sent from your Contact page.
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))
        ) : messages.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800">
            <Mail className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No contact messages received yet.</p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m._id}
              className={`p-6 rounded-2xl border transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                m.isRead
                  ? 'bg-slate-900/40 border-slate-800'
                  : 'bg-slate-900/90 border-indigo-500/40 shadow-lg shadow-indigo-500/5'
              }`}
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-bold text-white text-base">{m.name}</span>
                  <a
                    href={`mailto:${m.email}`}
                    className="text-xs text-indigo-400 hover:underline font-mono"
                  >
                    {m.email}
                  </a>
                  {!m.isRead && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                      New
                    </span>
                  )}
                  <span className="text-xs text-slate-500">
                    {new Date(m.createdAt).toLocaleString()}
                  </span>
                </div>

                <h4 className="font-semibold text-slate-200 text-sm">
                  Subject: <span className="text-white">{m.subject}</span>
                </h4>

                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  {m.message}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-start">
                {!m.isRead && (
                  <button
                    onClick={() => handleMarkRead(m._id)}
                    className="p-2 rounded-lg bg-slate-950 text-slate-400 hover:text-emerald-400 border border-slate-800 transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(m._id)}
                  className="p-2 rounded-lg bg-slate-950 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                  title="Delete message"
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
