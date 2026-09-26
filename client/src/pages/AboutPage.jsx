import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Server,
  Database,
  Cpu,
  Mail,
  CheckCircle2,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { Github, Twitter, Linkedin } from '../components/Icons';

export default function AboutPage() {
  const techSkills = [
    {
      category: 'Frontend & UI',
      icon: Code2,
      skills: ['React 19', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vite', 'Redux / Zustand', 'HTML5/CSS3'],
    },
    {
      category: 'Backend & APIs',
      icon: Server,
      skills: ['Node.js', 'Express.js', 'REST APIs', 'GraphQL', 'JWT Authentication', 'Microservices'],
    },
    {
      category: 'Database & Cloud',
      icon: Database,
      skills: ['MongoDB & Mongoose', 'PostgreSQL', 'Redis Caching', 'Docker', 'AWS (S3, EC2)', 'Cloudinary'],
    },
    {
      category: 'Architecture & DevOps',
      icon: Cpu,
      skills: ['System Design', 'CI/CD Pipelines', 'Clean Architecture', 'Git & GitHub Actions', 'Agile / Scrum'],
    },
  ];

  const milestones = [
    {
      year: '2024 - Present',
      role: 'Staff Full-Stack Architect',
      company: 'CloudScale Labs',
      description: 'Architecting distributed microservices and front-end design systems handling 2M+ daily active sessions.',
    },
    {
      year: '2021 - 2024',
      role: 'Senior Software Engineer',
      company: 'HyperFlow Media',
      description: 'Built high-throughput REST APIs and modernized monolith legacy architectures into modular services.',
    },
    {
      year: '2019 - 2021',
      role: 'Full-Stack Developer',
      company: 'Nexus Creative Tech',
      description: 'Delivered client web applications using React, Express, MongoDB, and AWS cloud infrastructure.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Intro Header */}
      <section className="flex flex-col md:flex-row items-center gap-10">
        <div className="relative shrink-0">
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden ring-4 ring-indigo-500/20 shadow-2xl shadow-indigo-500/20">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
              alt="Aman Kumar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-3 -right-3 px-3 py-1 bg-emerald-950/90 border border-emerald-500/40 rounded-full text-emerald-400 text-xs font-semibold flex items-center gap-1.5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Open for collaboration</span>
          </div>
        </div>

        <div className="space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Terminal className="w-3.5 h-3.5" />
            <span>Senior Software Engineer &amp; Author</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Hi, I'm Aman Kumar.
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
            I craft resilient full-stack web applications, demystify complex systems, and share practical engineering lessons with developers worldwide.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                title="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Philosophy */}
      <section className="p-8 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4">
        <h2 className="text-2xl font-bold text-white">Philosophy &amp; Principles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/60 space-y-2">
            <h3 className="font-bold text-indigo-300 text-base">Clarity Over Cleverness</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Code is read ten times more often than it is written. Writing self-documenting code and clean interfaces always beats obscure one-liners.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/60 space-y-2">
            <h3 className="font-bold text-purple-300 text-base">Resilience by Design</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Networks fail, databases throttle, and third-party APIs experience downtime. Building defense-in-depth ensures graceful degradation.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/60 space-y-2">
            <h3 className="font-bold text-emerald-300 text-base">Empower Through Teaching</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              True mastery means being able to break down intricate concepts into intuitive, approachable mental models anyone can learn.
            </p>
          </div>
        </div>
      </section>

      {/* Skills Matrix */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Tech Stack &amp; Tooling</h2>
          <p className="text-sm text-slate-400 mt-1">
            Technologies and frameworks I build production applications with daily.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {techSkills.map((tech) => {
            const Icon = tech.icon;
            return (
              <div
                key={tech.category}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{tech.category}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {tech.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Career Timeline */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Experience &amp; Milestones</h2>
          <p className="text-sm text-slate-400 mt-1">
            A quick overview of my software engineering career journey.
          </p>
        </div>

        <div className="space-y-6 border-l-2 border-slate-800 pl-6 ml-3">
          {milestones.map((item, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-500 ring-4 ring-slate-950" />
              <div className="space-y-1">
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">{item.year}</span>
                <h4 className="text-lg font-bold text-white">{item.role}</h4>
                <p className="text-sm font-medium text-slate-400">{item.company}</p>
                <p className="text-sm text-slate-400 leading-relaxed mt-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
