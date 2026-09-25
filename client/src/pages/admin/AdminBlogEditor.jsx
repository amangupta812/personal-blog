import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Send,
  Upload,
  Image as ImageIcon,
  Eye,
  Edit3,
  Sparkles,
  Check,
  Code,
  Heading1,
  Heading2,
  Bold,
  Italic,
  Quote,
  List,
  Link as LinkIcon,
} from 'lucide-react';
import { blogAPI, categoryAPI, uploadAPI } from '../../services/api';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import { useToast } from '../../components/Toast';

export default function AdminBlogEditor() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [customSlug, setCustomSlug] = useState(false);
  const [category, setCategory] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [featured, setFeatured] = useState(false);

  // Auto-slugify title if customSlug isn't checked
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!customSlug && !isEditing) {
      const generated = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  };

  // Load categories and initial post if editing
  useEffect(() => {
    const init = async () => {
      try {
        const catRes = await categoryAPI.getAll();
        if (catRes.data?.success) {
          setCategories(catRes.data.categories || []);
          if (catRes.data.categories?.length > 0 && !category) {
            setCategory(catRes.data.categories[0]._id);
          }
        }

        if (isEditing) {
          setLoading(true);
          const blogRes = await blogAPI.getById(id);
          if (blogRes.data?.success) {
            const b = blogRes.data.blog;
            setTitle(b.title);
            setSlug(b.slug);
            setCustomSlug(true);
            setCategory(b.category?._id || b.category);
            setCoverImage(b.coverImage || '');
            setExcerpt(b.excerpt || '');
            setContent(b.content || '');
            setTags(Array.isArray(b.tags) ? b.tags.join(', ') : '');
            setFeatured(Boolean(b.featured));
          }
        }
      } catch (err) {
        console.error('Initialization error:', err);
        addToast('Failed to load editor data.', 'error');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, isEditing]);

  // Handle Cover Image File Upload
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    try {
      const res = await uploadAPI.uploadImage(formData);
      if (res.data?.success) {
        setCoverImage(res.data.imageUrl);
        addToast('Cover image uploaded successfully!', 'success');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      addToast(err.response?.data?.message || 'Image upload failed.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Markdown Toolbar helper
  const insertMarkdown = (prefix, suffix = '') => {
    const textarea = document.getElementById('blog-content-area');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = `${prefix}${selectedText || 'text'}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selectedText.length || 4));
    }, 0);
  };

  // Save handler (draft or published)
  const handleSave = async (status) => {
    if (!title.trim() || !content.trim() || !category) {
      addToast('Please fill in Title, Category, and Article Content.', 'error');
      return;
    }

    setLoading(true);
    const postData = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      category,
      coverImage: coverImage.trim() || undefined,
      excerpt: excerpt.trim() || undefined,
      content,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      status,
      featured,
    };

    try {
      if (isEditing) {
        const res = await blogAPI.update(id, postData);
        if (res.data?.success) {
          addToast('Article updated successfully!', 'success');
          navigate('/admin/blogs');
        }
      } else {
        const res = await blogAPI.create(postData);
        if (res.data?.success) {
          addToast(status === 'published' ? 'Article published live!' : 'Draft saved!', 'success');
          navigate('/admin/blogs');
        }
      }
    } catch (err) {
      console.error('Save error:', err);
      addToast(err.response?.data?.message || 'Failed to save article.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/blogs"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isEditing ? 'Edit Article' : 'Compose New Article'}
            </h1>
            <p className="text-xs text-slate-400">
              Draft your article in Markdown with real-time typography preview.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-amber-400" />
            <span>Save as Draft</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={loading}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish Article</span>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Title, Content, Excerpt */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Article Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Architecting Distributed Systems with Node & MongoDB"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-lg placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  URL Slug
                </label>
                <button
                  type="button"
                  onClick={() => setCustomSlug(!customSlug)}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-mono"
                >
                  {customSlug ? 'Lock Auto Slug' : 'Custom Slug Override'}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500">/blog/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  disabled={!customSlug}
                  placeholder="article-slug"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 disabled:opacity-60 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Summary / Excerpt *
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A compelling 1-2 sentence preview shown on article cards and search snippets..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Markdown Editor / Preview Box */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              {/* Write vs Preview Tabs */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'write' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Write Markdown</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Reader Preview</span>
                </button>
              </div>

              {/* Formatting Quick Tools */}
              {activeTab === 'write' && (
                <div className="flex flex-wrap items-center gap-1">
                  <button
                    type="button"
                    onClick={() => insertMarkdown('## ')}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                    title="Heading 2"
                  >
                    <Heading1 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('### ')}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                    title="Heading 3"
                  >
                    <Heading2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('**', '**')}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                    title="Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('*', '*')}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                    title="Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('```javascript\n', '\n```')}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                    title="Code Block"
                  >
                    <Code className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('> ')}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                    title="Quote"
                  >
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('- ')}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                    title="List"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('[', '](https://)')}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                    title="Link"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Editor Area */}
            {activeTab === 'write' ? (
              <textarea
                id="blog-content-area"
                rows={18}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article in GitHub-flavored Markdown here...&#10;&#10;## Subheading&#10;Paragraph text...&#10;&#10;```javascript&#10;const res = await api.get('/data');&#10;```"
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed resize-y"
                required
              />
            ) : (
              <div className="min-h-[400px] p-6 rounded-2xl bg-slate-950 border border-slate-800 prose-blog">
                {content.trim() ? (
                  <MarkdownRenderer content={content} />
                ) : (
                  <p className="text-slate-500 italic">No content written yet.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Meta details, Category, Cover, Tags */}
        <div className="space-y-6">
          {/* Category & Status Settings */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
                required
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Featured Post Checkbox */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="featured-check"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-slate-950 border-slate-700"
              />
              <label htmlFor="featured-check" className="text-xs font-medium text-slate-300 cursor-pointer">
                Feature on Homepage hero
              </label>
            </div>
          </div>

          {/* Cover Image Upload / URL */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Cover Image
            </label>

            {coverImage ? (
              <div className="space-y-3">
                <img
                  src={coverImage}
                  alt="Cover Preview"
                  className="w-full h-36 object-cover rounded-xl border border-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setCoverImage('')}
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium"
                >
                  Remove Cover Image
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* File input */}
                <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-800 hover:border-indigo-500/50 cursor-pointer bg-slate-950/60 transition-colors">
                  <Upload className="w-6 h-6 text-indigo-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-300">
                    {uploadingImage ? 'Uploading image...' : 'Upload Image File'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">PNG, JPG, WEBP up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>

                {/* Direct URL input fallback */}
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">Or paste direct image URL:</span>
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="React, NodeJS, Architecture, Docker"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[10px] text-slate-500">Separate multiple tags with commas.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
