import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  Eye,
  Heart,
  Calendar,
  Share2,
  Copy,
  ArrowLeft,
  MessageSquare,
  Send,
  Sparkles,
  Check,
} from 'lucide-react';
import { Twitter, Linkedin } from '../components/Icons';
import confetti from 'canvas-confetti';
import { blogAPI, commentAPI } from '../services/api';
import MarkdownRenderer from '../components/MarkdownRenderer';
import BlogCard from '../components/BlogCard';
import { useToast } from '../components/Toast';

export default function BlogDetails() {
  const { slug } = useParams();
  const { addToast } = useToast();

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Like state
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  // Comment form state
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const res = await blogAPI.getBySlug(slug);
        if (res.data?.success) {
          const article = res.data.blog;
          setBlog(article);
          setLikes(article.likes || 0);
          setComments(res.data.comments || []);

          // Fetch related articles
          if (article._id) {
            const relRes = await blogAPI.getRelated(article._id);
            if (relRes.data?.success) {
              setRelatedBlogs(relRes.data.blogs || []);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  // Handle Like
  const handleLike = async () => {
    if (hasLiked || !blog?._id) return;

    setLikes((prev) => prev + 1);
    setHasLiked(true);

    // Launch celebratory confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6366f1', '#a855f7', '#ec4899'],
    });

    try {
      await blogAPI.likeBlog(blog._id);
      addToast('Thank you for liking this article!', 'success');
    } catch (err) {
      console.error('Error liking blog:', err);
    }
  };

  // Copy share link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    addToast('Article link copied to clipboard!', 'info');
    setTimeout(() => setLinkCopied(false), 2500);
  };

  // Handle Submit Comment
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentName || !commentEmail || !commentContent) {
      addToast('Please complete all comment fields.', 'error');
      return;
    }

    setSubmittingComment(true);
    try {
      const res = await commentAPI.addComment(blog._id, {
        name: commentName,
        email: commentEmail,
        content: commentContent,
      });

      if (res.data?.success) {
        setComments((prev) => [res.data.comment, ...prev]);
        setCommentContent('');
        addToast('Comment submitted successfully!', 'success');
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
      addToast(err.response?.data?.message || 'Failed to submit comment.', 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-slate-800 rounded-full" />
        <div className="h-12 w-3/4 bg-slate-800 rounded-xl" />
        <div className="h-96 bg-slate-900 rounded-2xl" />
        <div className="space-y-3">
          <div className="h-4 bg-slate-800 rounded w-full" />
          <div className="h-4 bg-slate-800 rounded w-5/6" />
          <div className="h-4 bg-slate-800 rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-extrabold text-white">Article Not Found</h2>
        <p className="text-slate-400 mt-2">
          The requested article may have been unpublished or removed.
        </p>
        <Link
          to="/blogs"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const shareText = encodeURIComponent(`Reading "${blog.title}" by Alex Morgan`);
  const shareUrl = encodeURIComponent(window.location.href);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top back navigation */}
      <div>
        <Link
          to="/blogs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all articles
        </Link>
      </div>

      {/* Article Header */}
      <header className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          {blog.category && (
            <span
              className="text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border shadow-sm"
              style={{
                backgroundColor: `${blog.category.color || '#6366f1'}20`,
                color: blog.category.color || '#818cf8',
                borderColor: `${blog.category.color || '#6366f1'}40`,
              }}
            >
              {blog.category.name}
            </span>
          )}

          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            {formattedDate}
          </span>

          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            {blog.readTime || 3} min read
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.2]">
          {blog.title}
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-light">
          {blog.excerpt}
        </p>

        {/* Author Bio Bar & Share Buttons */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={blog.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
              alt={blog.author?.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
            <div>
              <h4 className="text-sm font-bold text-white">{blog.author?.name || 'Alex Morgan'}</h4>
              <p className="text-xs text-slate-400">Senior Full-Stack Engineer &amp; Author</p>
            </div>
          </div>

          {/* Social share & like buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                hasLiked
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-rose-500/50 hover:text-rose-400'
              }`}
              title="Like article"
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              <span>{likes}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              title="Copy article link"
            >
              {linkCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400 hover:border-slate-700 transition-colors"
              title="Share on Twitter / X"
            >
              <Twitter className="w-4 h-4" />
            </a>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400 hover:border-slate-700 transition-colors"
              title="Share on LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {blog.coverImage && (
        <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full max-h-[500px] object-cover"
          />
        </div>
      )}

      {/* Main Blog Content rendered via MarkdownRenderer */}
      <div className="prose-blog pt-4">
        <MarkdownRenderer content={blog.content} />
      </div>

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-2">Tags:</span>
            {blog.tags.map((tag, idx) => (
              <Link
                key={idx}
                to={`/blogs?tag=${encodeURIComponent(tag)}`}
                className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-indigo-300 hover:bg-indigo-950/60 hover:border-indigo-500/40 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Like CTA Bar */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 border border-indigo-500/20 text-center space-y-4">
        <Sparkles className="w-8 h-8 text-indigo-400 mx-auto" />
        <h3 className="text-xl font-bold text-white">Did you find this article valuable?</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Tap the heart below to let the author know. It takes one click and helps surface this tutorial to other developers.
        </p>
        <button
          onClick={handleLike}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-xl transition-all ${
            hasLiked
              ? 'bg-rose-600 text-white shadow-rose-600/30'
              : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/30 hover:scale-105'
          }`}
        >
          <Heart className={`w-4 h-4 ${hasLiked ? 'fill-white' : ''}`} />
          <span>{hasLiked ? `Liked (${likes})` : `Like this article (${likes})`}</span>
        </button>
      </div>

      {/* Comments Section */}
      <section className="pt-8 border-t border-slate-800 space-y-8">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
          <h3 className="text-2xl font-bold text-white">
            Discussion ({comments.length})
          </h3>
        </div>

        {/* Comment Submission Form */}
        <form onSubmit={handleSubmitComment} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h4 className="text-sm font-semibold text-slate-200">Leave a thought or feedback</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your Name *"
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
              required
            />
            <input
              type="email"
              placeholder="Your Email (kept private) *"
              value={commentEmail}
              onChange={(e) => setCommentEmail(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <textarea
            rows={3}
            placeholder="Share your experience, question, or constructive thoughts..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
            required
          />

          <button
            type="submit"
            disabled={submittingComment}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submittingComment ? 'Posting...' : 'Post Comment'}</span>
          </button>
        </form>

        {/* Comments List */}
        {comments.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">
            Be the first to leave a comment on this article!
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold uppercase">
                      {comment.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm font-semibold text-slate-200">{comment.name}</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed pl-10">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <section className="pt-12 border-t border-slate-800 space-y-6">
          <h3 className="text-2xl font-bold text-white">Recommended Reading</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedBlogs.map((rel) => (
              <BlogCard key={rel._id} blog={rel} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
