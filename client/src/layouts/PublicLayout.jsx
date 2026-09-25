import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchModal from '../components/SearchModal';
import ReadingProgressBar from '../components/ReadingProgressBar';

export default function PublicLayout() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <ReadingProgressBar />
      <Navbar onOpenSearch={() => setSearchOpen(true)} />
      
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
