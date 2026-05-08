'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const MOCK_PROJECTS = [
  {
    id: '1',
    name: 'E-Commerce Platform',
    client: 'ABC Retail Store',
    status: 'In Progress',
    progress: 65,
    startDate: '2026-04-01',
    dueDate: '2026-05-15',
  },
  {
    id: '2',
    name: 'Restaurant Website',
    client: 'Urban Cafe',
    status: 'Design Phase',
    progress: 30,
    startDate: '2026-05-01',
    dueDate: '2026-05-25',
  },
  {
    id: '3',
    name: 'Portfolio Website',
    client: 'Your Company',
    status: 'Completed',
    progress: 100,
    startDate: '2026-03-15',
    dueDate: '2026-04-10',
  },
];

export default function ProjectsPage() {
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
    <div className="min-h-screen bg-bg">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Your Projects</h1>
            <p className="text-zinc-400">Track the progress of all your projects in one place.</p>
          </div>
          <Link
            href="/dashboard/inquiries"
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-400 transition"
          >
            New Project
          </Link>
        </div>

        {MOCK_PROJECTS.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <p className="text-zinc-400 mb-4">You don't have any projects yet.</p>
            <Link
              href="/dashboard/inquiries"
              className="inline-block px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-400 transition"
            >
              Submit Your First Project Inquiry
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {MOCK_PROJECTS.map((project) => (
              <div key={project.id} className="rounded-2xl border border-border bg-card p-6 hover:border-green-500/30 transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">{project.name}</h3>
                    <p className="text-sm text-zinc-400">{project.client}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-zinc-400">Progress</span>
                    <span className="text-xs font-semibold text-white">{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex items-center gap-6 text-sm text-zinc-400 mb-4">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Start Date</p>
                    <p className="text-white">{new Date(project.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Due Date</p>
                    <p className="text-white">{new Date(project.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2 rounded-lg border border-border text-white hover:bg-white/5 transition text-sm font-semibold">
                    View Details
                  </button>
                  <button className="flex-1 px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition text-sm font-semibold">
                    Message Team
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
