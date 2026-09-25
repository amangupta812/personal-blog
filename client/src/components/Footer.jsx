import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Check, ArrowRight } from 'lucide-react';
import { Github, Twitter, Linkedin } from './Icons';
import { useToast } from './Toast';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    setSubscribed(true);
    addToast('Subscribed! You will get notified on new articles.', 'success');
    setEmail('');
  };

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 mt-24">
      {/* Newsletter Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -translate-y-12">
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-purple-900/60 p-8 sm:p-12 border border-indigo-500/20 shadow-2xl backdrop-blur-xl overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-2xl">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-500/30">
              Weekly Newsletter
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-4 tracking-tight">
              Get modern engineering insights delivered to your inbox.
            </h3>
            <p className="text-sm sm:text-base text-slate-300 mt-2">
              No spam, ever. Just practical architecture lessons, deep-dives into React 19, and full-stack engineering guides.
            </p>

            <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 text-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 shrink-0"
              >
                {subscribed ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Bio column */}
          <div className="md:col-span-2">
            <h4 className="text-xl font-bold text-white tracking-tight">Alex Morgan</h4>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed max-w-sm">
              Full Stack Engineer & System Architect. Writing about real production lessons, modern frontend tools, scalable cloud backends, and deliberate software engineering.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800"
                title="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <Link
                to="/contact"
                className="p-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800"
                title="Contact via Email"
              >
                <Mail className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Navigation</h5>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-indigo-400 transition-colors">All Articles</Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-indigo-400 transition-colors">Categories</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-indigo-400 transition-colors">About Me</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-400 transition-colors">Get in Touch</Link>
              </li>
            </ul>
          </div>

          {/* Topics */}
          <div>
            <h5 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Popular Topics</h5>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/blogs?category=web-development" className="hover:text-indigo-400 transition-colors">Web Development</Link>
              </li>
              <li>
                <Link to="/blogs?category=react-frontend" className="hover:text-indigo-400 transition-colors">React & Frontend</Link>
              </li>
              <li>
                <Link to="/blogs?category=backend-cloud" className="hover:text-indigo-400 transition-colors">Backend & Cloud</Link>
              </li>
              <li>
                <Link to="/blogs?category=software-architecture" className="hover:text-indigo-400 transition-colors">Architecture</Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-indigo-400 transition-colors text-slate-500">Admin Portal</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Alex Morgan. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Engineered with the</span>
            <span className="font-semibold text-indigo-400">MERN Stack</span>
            <span>&amp; Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
