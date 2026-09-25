import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto space-y-6">
        <span className="text-7xl font-black text-indigo-500/80 font-mono tracking-widest block">
          404
        </span>
        <h1 className="text-3xl font-extrabold text-white">Page Not Found</h1>
        <p className="text-slate-400 text-sm">
          The link you followed may be broken or the page may have been relocated.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Home className="w-4 h-4" /> Return to Homepage
        </Link>
      </div>
    </div>
  );
}
