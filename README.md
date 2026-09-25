# 🚀 DevLog — Portfolio MERN Personal Blog Platform

A production-grade, portfolio-quality personal blog application built with the **MERN stack** (MongoDB, Express.js, React 19, Node.js) and **Tailwind CSS**. Features a public reader experience and an admin CMS studio for publishing and managing articles, categories, comments, and inquiries.

---

## 🌟 Key Highlights & Features

### 🖥️ Public Experience
- **Dynamic Homepage**: Hero section with live platform metrics, category domains, featured articles, and recent publications stream.
- **Full Article Reader (`/blog/:slug`)**:
  - Reading progress indicator pinned to top of screen.
  - Formatted Markdown rendering with code blocks, one-click copy buttons, blockquotes, and callouts.
  - Interactive **Like** button with optimistic count update and celebratory confetti effect.
  - One-click social share links (Twitter / X, LinkedIn, Copy Link).
  - Reader comments section with live comment submission.
  - Recommended reading / related articles.
- **Search & Filters (`/blogs`)**:
  - Real-time debounced search bar.
  - Filter by category pills and tags.
  - Sort by *Newest*, *Most Read*, *Most Liked*, or *Oldest*.
  - Pagination controls.
- **Categories Explorer (`/categories`)**: Visual domain cards displaying color themes, descriptions, and post counts.
- **Portfolio & Bio (`/about`)**: Personal background, engineering philosophy, skills matrix, and career timeline.
- **Contact (`/contact`)**: Working visitor contact form connected to backend MongoDB storage.
- **Keyboard Command Palette**: Press `Ctrl+K` from anywhere on the site to trigger instant global search.

### 🛡️ Admin Studio (`/admin`)
- **JWT-Protected Studio**: Secure admin authentication with session preservation.
- **Dashboard Overview (`/admin/dashboard`)**: Real-time stats (Total Articles, Published, Drafts, Views, Likes, Categories, Comments).
- **Article Catalog (`/admin/blogs`)**:
  - Filter by *All*, *Published*, or *Drafts*.
  - One-click toggle switch between **Draft** and **Published** states.
  - Edit and delete actions with confirmation dialogs.
- **Blog Editor (`/admin/blogs/new` & `/admin/blogs/edit/:id`)**:
  - Automatic slug generation with manual override.
  - Cover image upload (supports local uploads or direct Cloudinary integration) plus external URL support.
  - Split / Tabbed **Write Markdown** and **Live Reader Preview**.
  - Markdown formatting toolbar (Headings, Bold, Italic, Code block, Quote, List, Links).
  - Save as Draft or Publish live.
- **Category Manager (`/admin/categories`)**: Create, edit, and delete categories with custom hex accent colors and slugification.
- **Comment Moderation (`/admin/comments`)**: Review reader comments; approve, reject, or delete with one click.
- **Inquiry Inbox (`/admin/messages`)**: Read and manage contact form submissions.

---

## 🧱 Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | Fast HMR, modular component architecture |
| **Styling** | Tailwind CSS v4 | Custom typography, glassmorphism, responsive dark theme |
| **Routing** | React Router v7 | Nested public and protected admin layouts |
| **Backend** | Node.js + Express.js | RESTful API architecture with centralized error handling |
| **Database** | MongoDB & Mongoose | Indexed models with slugification and reading time calculation |
| **Auth** | JSON Web Tokens (JWT) + bcryptjs | Protected middleware & role-based access control |
| **Uploads** | Multer & Cloudinary | Zero-config local storage with seamless Cloudinary fallback |

---

## 📁 Project Structure

```
Personal-blog/
├── client/                     # React 19 + Vite Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer, BlogCard, SearchModal, MarkdownRenderer, Toast
│   │   ├── hooks/              # useAuth context hook
│   │   ├── layouts/            # PublicLayout and AdminLayout
│   │   ├── pages/
│   │   │   ├── admin/          # AdminLogin, AdminDashboard, AdminBlogs, AdminBlogEditor, etc.
│   │   │   ├── Home.jsx
│   │   │   ├── AllBlogs.jsx
│   │   │   ├── BlogDetails.jsx
│   │   │   ├── CategoriesPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   └── NotFound.jsx
│   │   ├── services/           # Axios API client with auth interceptor
│   │   ├── App.jsx             # React Router hierarchy
│   │   ├── index.css           # Tailwind CSS imports & custom typography
│   │   └── main.jsx
│   ├── vite.config.js          # Vite configuration with proxy to port 5000
│   └── package.json
│
├── server/                     # Node.js + Express Backend
│   ├── config/
│   │   ├── db.js               # MongoDB connection with in-memory fallback
│   │   └── cloudinary.js       # Cloudinary config with local disk fallback
│   ├── controllers/            # Auth, Blog, Category, Comment, Contact, Upload
│   ├── middleware/             # Auth (JWT), Upload (Multer), Error handling
│   ├── models/                 # User, Blog, Category, Comment, Contact
│   ├── routes/                 # Express API routes
│   ├── utils/
│   │   └── seed.js             # Realistic database seeder script
│   ├── server.js               # Express application entrypoint
│   └── package.json
│
└── README.md
```

---

## ⚡ Quick Start & Running Locally

### 1. Prerequisites
- **Node.js** v18+ (tested on v20)
- **MongoDB** running locally on port 27017, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) connection string.

### 2. Backend Setup
```bash
cd server
npm install

# (Optional) Customize server/.env if needed:
# PORT=5000
# MONGO_URI=mongodb://127.0.0.1:27017/personal_blog
# JWT_SECRET=personal_blog_super_secret_jwt_key_2026_modern_dev

# Seed database with sample articles, categories, comments, and admin user:
npm run seed

# Start server:
npm start
```

### 3. Frontend Setup
```bash
cd ../client
npm install

# Start Vite dev server:
npm run dev
```

Visit:
- **Public Website:** [http://localhost:5173/](http://localhost:5173/)
- **Admin Portal:** [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **Backend API Health:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Default Admin Credentials

When the database is seeded using `npm run seed`:
- **Email:** `admin@personalblog.dev`
- **Password:** `Admin@12345`

> **Tip:** The Admin Login page includes a **"Fill Demo Admin Credentials"** button for quick 1-click testing.

---

## ☁️ Cloudinary Configuration (Optional)

By default, image uploads are saved locally to `server/uploads/` and served at `/uploads/*`. To use Cloudinary for cloud image hosting:
1. Create a free account at [Cloudinary](https://cloudinary.com).
2. Add your credentials to `server/.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
3. Restart the server. Images uploaded via the Admin Editor will automatically stream to Cloudinary!

---

## 📡 REST API Endpoints Overview

### Public Routes
- `GET /api/blogs` — Get published blogs with pagination, search, category, and tag filters
- `GET /api/blogs/featured` — Get featured highlight articles
- `GET /api/blogs/slug/:slug` — Get single article details and approved comments
- `GET /api/blogs/:id/related` — Get related articles by category/tags
- `POST /api/blogs/:id/like` — Increment like counter
- `GET /api/categories` — Get all categories with article counts
- `GET /api/categories/:slug` — Get category details and its posts
- `POST /api/comments/:blogId` — Post a reader comment
- `POST /api/contact` — Submit a visitor message

### Admin Protected Routes (`Authorization: Bearer <token>`)
- `POST /api/auth/login` — Authenticate admin and return JWT
- `GET /api/auth/me` — Current admin session verification
- `GET /api/blogs/admin/stats` — Dashboard analytics & metrics
- `GET /api/blogs/admin/all` — Catalog of all posts (published + drafts)
- `POST /api/blogs` — Create new blog article
- `PUT /api/blogs/:id` — Update existing article
- `PATCH /api/blogs/:id/toggle-status` — Toggle between draft and published
- `DELETE /api/blogs/:id` — Delete article and its comments
- `POST /api/categories` — Create category
- `PUT /api/categories/:id` — Update category
- `DELETE /api/categories/:id` — Delete category
- `GET /api/comments/admin/all` — Moderate reader comments
- `PATCH /api/comments/:id/status` — Approve or reject comment
- `DELETE /api/comments/:id` — Delete comment
- `GET /api/contact/admin/all` — View contact inquiries
- `POST /api/upload` — Upload cover images (Multer / Cloudinary)

---

## 🚢 Production Build
To create a production-ready client bundle:
```bash
cd client
npm run build
```
The output will be generated in `client/dist/`, ready to be hosted on Vercel, Netlify, Render, or served statically by Express.
