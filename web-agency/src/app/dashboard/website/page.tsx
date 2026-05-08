'use client';

import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { GlobeIcon, ChartIcon } from '../../../components/Icons';

const LATEST_PROJECT = {
  id: '1',
  name: 'E-Commerce Platform',
  client: 'ABC Retail Store',
  status: 'In Progress',
  progress: 65,
  startDate: '2026-04-01',
  dueDate: '2026-05-15',
  liveUrl: 'https://abcretail.com',
  deliverables: [
    { name: 'Homepage Design.pdf', size: '5.2 MB', date: '2026-05-05' },
    { name: 'Product Pages.pdf', size: '3.8 MB', date: '2026-05-05' },
    { name: 'Checkout Flow.pdf', size: '2.1 MB', date: '2026-05-06' },
  ],
};

export default function ProjectDetailsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-zinc-700 border-t-green-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Design Phase':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Active Project</h1>
        <p className="text-zinc-400">Track your current project status and download deliverables</p>
      </div>

      {/* Project Header */}
      <div className="rounded-2xl bg-card border border-border p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">{LATEST_PROJECT.name}</h2>
            <p className="text-sm text-zinc-400">{LATEST_PROJECT.client}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(LATEST_PROJECT.status)}`}>
            {LATEST_PROJECT.status}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400">Progress</span>
            <span className="text-xs font-semibold text-white">{LATEST_PROJECT.progress}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${LATEST_PROJECT.progress}%` }}
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-6 text-sm text-zinc-400">
          <div>
            <p className="text-xs text-zinc-500 mb-1">Start Date</p>
            <p className="text-white font-semibold">{new Date(LATEST_PROJECT.startDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Due Date</p>
            <p className="text-white font-semibold">{new Date(LATEST_PROJECT.dueDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Deliverables Section */}
      <div className="rounded-2xl bg-card border border-border p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Project Deliverables</h3>
        <div className="space-y-2">
          {LATEST_PROJECT.deliverables.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-border hover:bg-white/10 transition"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{file.name}</p>
                <p className="text-xs text-zinc-400 mt-1">{file.size} • {file.date}</p>
              </div>
              <button className="ml-4 flex-shrink-0 px-4 py-2 rounded-lg border border-green-500/30 bg-green-500/20 text-green-400 hover:bg-green-500/30 transition text-sm font-semibold">
                Download
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Project Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link
          href="/dashboard/messages"
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border bg-card hover:border-green-500/30 transition text-white font-semibold text-sm"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          Message Team
        </Link>
        <Link
          href="/dashboard/projects"
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-500/20 border border-green-500/30 hover:bg-green-500/30 text-green-400 transition font-semibold text-sm"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          View All Projects
        </Link>
      </div>

      {/* Quick Info Card */}
      <div className="rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30 p-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 flex-shrink-0">
            <GlobeIcon size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-white mb-1">Project Live</h4>
            <p className="text-sm text-zinc-300 mb-3">Your website is live and ready for use</p>
            <a
              href={LATEST_PROJECT.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-400 hover:text-green-300 font-semibold"
            >
              Visit Project ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
