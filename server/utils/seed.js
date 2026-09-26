import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/personal_blog';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected to database at:', MONGO_URI);

    // Clear existing collections
    await User.deleteMany();
    await Category.deleteMany();
    await Blog.deleteMany();
    await Comment.deleteMany();
    console.log('[Seed] Cleared existing data.');

    // 1. Create Admin User from environment variables (NEVER hardcoded in source control)
    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const adminPassword = (process.env.ADMIN_PASSWORD || '').trim();
    const adminName = (process.env.ADMIN_NAME || 'Blog Admin').trim();

    if (!adminEmail || !adminPassword) {
      console.error('\n❌ [Seed Error] ADMIN_EMAIL or ADMIN_PASSWORD is missing in server/.env');
      console.error('To protect your credentials, please add the following to your private server/.env:');
      console.error('  ADMIN_NAME=Your Name');
      console.error('  ADMIN_EMAIL=your_email@example.com');
      console.error('  ADMIN_PASSWORD=your_secure_password\n');
      process.exit(1);
    }

    const adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Senior Full-Stack Engineer, System Architect, and Technical Writer. Building modern digital experiences and sharing practical learnings from production systems.',
      socialLinks: {
        github: 'https://github.com',
        twitter: 'https://x.com',
        linkedin: 'https://linkedin.com',
        website: 'https://alexmorgan.dev',
      },
    });
    console.log(`[Seed] Created admin: ${adminUser.email}`);

    // 2. Create Categories
    const categories = await Category.create([
      {
        name: 'Web Development',
        description: 'Modern front-end & full-stack development patterns, CSS, and browser engineering.',
        color: '#3b82f6',
        icon: 'Globe',
      },
      {
        name: 'React & Frontend',
        description: 'Deep dives into React 19, hooks, state management, and modern component systems.',
        color: '#06b6d4',
        icon: 'Code2',
      },
      {
        name: 'Backend & Cloud',
        description: 'Node.js, Express, databases, APIs, Docker, and distributed systems.',
        color: '#8b5cf6',
        icon: 'Server',
      },
      {
        name: 'Architecture & Design',
        description: 'Clean code principles, design patterns, microservices, and system scalability.',
        color: '#10b981',
        icon: 'Layers',
      },
      {
        name: 'Developer Career',
        description: 'Productivity workflows, engineering habits, interview advice, and lessons learned.',
        color: '#f59e0b',
        icon: 'Compass',
      },
    ]);
    console.log(`[Seed] Created ${categories.length} categories.`);

    const catMap = {};
    categories.forEach((cat) => {
      catMap[cat.name] = cat._id;
    });

    // 3. Create Articles
    const blogsData = [
      {
        title: 'Building High-Performance Full-Stack Applications with MERN in 2026',
        category: catMap['Web Development'],
        tags: ['MERN', 'FullStack', 'Performance', 'NodeJS'],
        featured: true,
        coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
        excerpt: 'Explore modern architectural patterns, caching strategies, and indexing best practices for building blazing-fast MERN stack applications.',
        status: 'published',
        views: 1420,
        likes: 86,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        content: `
# Building High-Performance Full-Stack Applications with MERN in 2026

The JavaScript ecosystem has matured dramatically over the past few years. While the fundamental pillars of the **MERN stack** (MongoDB, Express, React, Node.js) remain steady, the architectural techniques required to run performant, resilient applications have evolved.

In this deep dive, we explore the principles behind high-throughput backend services and fluid frontend user experiences.

---

## 1. Database Indexing & Aggregation Pipelines

A common bottleneck in Node/Express backends is unoptimized database interactions. MongoDB provides powerful indexing mechanisms that eliminate full-collection scans.

### Compound Indexes for Filter-Heavy Queries
When querying articles filtered by status, category, and date, a compound index transforms execution time from hundreds of milliseconds to sub-millisecond lookups:

\`\`\`javascript
// Optimize sorting & filtering simultaneously
blogSchema.index({ status: 1, category: 1, publishedAt: -1 });
\`\`\`

> **Pro Tip:** Always run \`explain('executionStats')\` in MongoDB Compass or shell to verify that your queries utilize an \`IXSCAN\` stage rather than \`COLLSCAN\`.

---

## 2. Decoupled Architecture and Clean Separation of Concerns

A resilient Express API relies on strict boundary enforcement:
- **Routes:** Pure URL mapping and middleware binding.
- **Controllers:** Request extraction, orchestration, and standardized response formatting.
- **Services / Models:** Core business logic and database persistence.
- **Middlewares:** Authentication, rate limiting, and centralized error handling.

This separation makes testing straightforward and allows each layer to be optimized independently.

---

## 3. Frontend Optimistic Updates & Intelligent Caching

On the client side, perceived performance is just as vital as raw network speed:
- Pre-fetch next pages on hover or viewport intersection.
- Apply optimistic updates when toggling likes or bookmarking posts.
- Use responsive WebP images with explicit width and height to prevent Layout Shift (CLS).

### Summary Checklist
- [x] Create compound indexes for frequent multi-field filters
- [x] Protect API endpoints with JSON Web Tokens and refresh mechanisms
- [x] Compress static payloads and serve images via CDN
- [x] Track application metrics with structured logging

Happy coding!
        `.trim(),
      },
      {
        title: 'Mastering State Management in React 19: The Complete Guide',
        category: catMap['React & Frontend'],
        tags: ['React', 'React19', 'JavaScript', 'Frontend'],
        featured: true,
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
        excerpt: 'From modern hooks and actions to server components, learn the most elegant ways to manage state without bloated external libraries.',
        status: 'published',
        views: 2150,
        likes: 142,
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        content: `
# Mastering State Management in React 19

React has consistently pushed the boundaries of developer ergonomics and declarative UI programming. With React 19, the ecosystem introduces groundbreaking features like native Actions, \`useActionState\`, and refined transition hooks.

---

## The Shift Towards Native Async Actions

For years, developers reached for third-party state managers like Redux or heavy boilerplate to track pending states, errors, and mutations. React 19 bakes these primitives straight into the core runtime.

\`\`\`jsx
import { useActionState } from 'react';

async function updateProfile(prevState, formData) {
  const name = formData.get('name');
  const res = await api.updateName(name);
  return res.data;
}

function ProfileEditor() {
  const [state, formAction, isPending] = useActionState(updateProfile, null);

  return (
    <form action={formAction} className="space-y-4">
      <input name="name" placeholder="Enter your name" className="input" />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Profile'}
      </button>
      {state?.error && <p className="text-red-500">{state.error}</p>}
    </form>
  );
}
\`\`\`

---

## When Do You Still Need Global State?

Local component state with URL query parameters covers 80% of application needs. For global state:
1. **User session & auth:** Lightweight React Context with \`useContext\`.
2. **Server cache:** TanStack Query or native server components.
3. **Complex UI state:** Nano stores or Zustand for minimal bundle footprint.

Keep your state collocated as close as possible to the components that consume it.
        `.trim(),
      },
      {
        title: 'Designing Resilient REST APIs with Node.js and MongoDB',
        category: catMap['Backend & Cloud'],
        tags: ['NodeJS', 'Express', 'MongoDB', 'RESTAPI'],
        featured: false,
        coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
        excerpt: 'A blueprint for crafting robust, secure, and developer-friendly RESTful APIs equipped with validation, rate limiting, and graceful error handling.',
        status: 'published',
        views: 980,
        likes: 64,
        publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        content: `
# Designing Resilient REST APIs with Node.js and MongoDB

Building an API that handles happy paths is easy. Building one that behaves reliably under network partitions, malicious input, and unexpected spikes requires intentional architecture.

---

## 1. Centralized Error Handling

Never scatter \`res.status(500).json(...)\` throughout your controllers. Standardize error dispatching through Express middleware:

\`\`\`javascript
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
\`\`\`

---

## 2. Defensive Request Sanitization

Ensure incoming payloads are rigorously validated before reaching your persistence layer:
- Sanitize strings to prevent NoSQL query injection (\`$gt\`, \`$ne\`).
- Enforce strict schemas using Mongoose or Zod.
- Limit JSON payload sizes to avoid memory exhaustion attacks.

Consistency across response contracts ensures your frontend client remains predictable and maintainable.
        `.trim(),
      },
      {
        title: 'Why Clean Architecture Matters for Junior and Senior Developers Alike',
        category: catMap['Architecture & Design'],
        tags: ['Architecture', 'CleanCode', 'DesignPatterns', 'BestPractices'],
        featured: true,
        coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
        excerpt: 'Understand how decoupled architecture and modular design save teams from technical debt and make scaling enjoyable.',
        status: 'published',
        views: 1840,
        likes: 120,
        publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        content: `
# Why Clean Architecture Matters

Every software project begins with great enthusiasm. Features are shipped in record time, and velocity is through the roof. But without structural discipline, every successive release becomes exponentially harder.

---

## The Core Concept: Independence of Frameworks

Clean architecture is not about dogmatic folder structures. It is about **dependency direction**:
> Core business logic should never depend on external databases, UI frameworks, or specific cloud providers.

### Practical Boundaries in a Modern Blog Application
- Your \`Blog\` domain model shouldn't care whether you render with React, Next.js, or raw HTML.
- Your authentication service shouldn't care whether JWTs are stored in cookies or headers.
- Your image handling shouldn't lock you irreversibly into a single cloud storage vendor.

By creating modular adapters, your application adapts to technological shifts with confidence.
        `.trim(),
      },
      {
        title: 'The Productive Developer: Habits That Actually Move the Needle',
        category: catMap['Developer Career'],
        tags: ['Productivity', 'Career', 'Learning', 'Mindset'],
        featured: false,
        coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
        excerpt: 'Cutting through the noise of hustle culture: focus blocks, terminal shortcuts, and deliberate practice for long-term engineering growth.',
        status: 'published',
        views: 1530,
        likes: 95,
        publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        content: `
# The Productive Developer: Habits That Actually Move the Needle

Developer productivity isn't about typing 120 words per minute or working 14 hours a day. It is about clarity of thought and ruthless prioritization.

---

## 1. Two-Hour Uninterrupted Deep Work Blocks
Coding requires holding complex mental models in active memory. Every notification resets your cognitive context. Protect 2 to 3 uninterrupted hours every morning for hard algorithmic or architectural work.

## 2. Invest in Your Tooling
- Learn your IDE shortcuts until they become muscle memory.
- Master Git commands beyond \`commit\` and \`push\` (e.g. \`rebase -i\`, \`stash\`, \`bisect\`).
- Automate repetitive tasks with shell scripts.

## 3. Build in Public & Teach What You Learn
Writing technical articles is one of the most effective ways to solidify your knowledge. When you explain a concept to others, you uncover subtle gaps in your own understanding.
        `.trim(),
      },
      {
        title: 'Upcoming: Exploring AI Coding Assistants and Agentic Workflows',
        category: catMap['Architecture & Design'],
        tags: ['AI', 'AgenticAI', 'FutureOfDev'],
        featured: false,
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        excerpt: 'A preview draft on how AI coding agents and autonomous pair programming tools are reshaping software engineering pipelines.',
        status: 'draft',
        views: 0,
        likes: 0,
        content: `
# Exploring AI Coding Assistants and Agentic Workflows

This post is currently an active draft exploring the transition from code completion to agentic workflows capable of planning, executing, and validating multi-step programming tasks...
        `.trim(),
      },
    ];

    for (const item of blogsData) {
      const blog = await Blog.create({
        ...item,
        author: adminUser._id,
      });

      // Add a couple of realistic comments for the first published post
      if (item.status === 'published' && blog.views > 1000) {
        await Comment.create([
          {
            blog: blog._id,
            name: 'Sarah Chen',
            email: 'sarah.chen@techcorp.io',
            content: 'Incredible guide! The section on compound indexing saved our team from a massive performance dip during our latest launch.',
            status: 'approved',
          },
          {
            blog: blog._id,
            name: 'David Miller',
            email: 'david.m@devstudio.com',
            content: 'Spot on about optimistic updates. The combination of clean REST endpoints and instantaneous UI feedback makes the app feel like a native desktop app.',
            status: 'approved',
          },
        ]);
      }
    }

    console.log(`[Seed] Seeded ${blogsData.length} articles with sample comments!`);
    console.log('\n=============================================');
    console.log('🎉 Seed complete! Admin account ready:');
    console.log(`Email:    ${adminEmail}`);
    console.log('Password: [As defined in your private server/.env]');
    console.log('=============================================\n');

    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error during seeding:', err);
    process.exit(1);
  }
};

seedData();
