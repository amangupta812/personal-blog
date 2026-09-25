import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ToastProvider } from './components/Toast';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import AllBlogs from './pages/AllBlogs';
import BlogDetails from './pages/BlogDetails';
import CategoriesPage from './pages/CategoriesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminBlogEditor from './pages/admin/AdminBlogEditor';
import AdminCategories from './pages/admin/AdminCategories';
import AdminComments from './pages/admin/AdminComments';
import AdminMessages from './pages/admin/AdminMessages';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes with Navbar & Footer */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="blogs" element={<AllBlogs />} />
              <Route path="blog/:slug" element={<BlogDetails />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin Standalone Login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Studio Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="blogs/new" element={<AdminBlogEditor />} />
              <Route path="blogs/edit/:id" element={<AdminBlogEditor />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="comments" element={<AdminComments />} />
              <Route path="messages" element={<AdminMessages />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
