import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('blog_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token expiry handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized and current path is inside admin, we can clear token
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('blog_token');
        localStorage.removeItem('blog_user');
        window.location.href = '/admin/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

// Blog endpoints
export const blogAPI = {
  getBlogs: (params) => API.get('/blogs', { params }),
  getFeatured: () => API.get('/blogs/featured'),
  getBySlug: (slug) => API.get(`/blogs/slug/${slug}`),
  getRelated: (id) => API.get(`/blogs/${id}/related`),
  likeBlog: (id) => API.post(`/blogs/${id}/like`),
  
  // Admin blog operations
  getAdminBlogs: (params) => API.get('/blogs/admin/all', { params }),
  getById: (id) => API.get(`/blogs/admin/${id}`),
  create: (data) => API.post('/blogs', data),
  update: (id, data) => API.put(`/blogs/${id}`, data),
  toggleStatus: (id) => API.patch(`/blogs/${id}/toggle-status`),
  delete: (id) => API.delete(`/blogs/${id}`),
  getStats: () => API.get('/blogs/admin/stats'),
};

// Category endpoints
export const categoryAPI = {
  getAll: () => API.get('/categories'),
  getBySlug: (slug) => API.get(`/categories/${slug}`),
  create: (data) => API.post('/categories', data),
  update: (id, data) => API.put(`/categories/${id}`, data),
  delete: (id) => API.delete(`/categories/${id}`),
};

// Comment endpoints
export const commentAPI = {
  addComment: (blogId, data) => API.post(`/comments/${blogId}`, data),
  getBlogComments: (blogId) => API.get(`/comments/blog/${blogId}`),
  getAdminComments: (params) => API.get('/comments/admin/all', { params }),
  updateStatus: (id, status) => API.patch(`/comments/${id}/status`, { status }),
  delete: (id) => API.delete(`/comments/${id}`),
};

// Contact endpoints
export const contactAPI = {
  send: (data) => API.post('/contact', data),
  getAll: () => API.get('/contact/admin/all'),
  markRead: (id) => API.patch(`/contact/admin/${id}/read`),
  delete: (id) => API.delete(`/contact/admin/${id}`),
};

// Upload endpoint
export const uploadAPI = {
  uploadImage: (formData) =>
    API.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default API;
