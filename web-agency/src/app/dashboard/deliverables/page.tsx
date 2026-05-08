'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const MOCK_DELIVERABLES = [
  {
    id: '1',
    projectName: 'E-Commerce Platform',
    type: 'Design Mockups',
    files: [
      { name: 'Homepage Design.pdf', size: '5.2 MB', date: '2026-05-05' },
      { name: 'Product Pages.pdf', size: '3.8 MB', date: '2026-05-05' },
      { name: 'Checkout Flow.pdf', size: '2.1 MB', date: '2026-05-06' },
    ],
  },
  {
    id: '2',
    projectName: 'E-Commerce Platform',
    type: 'Technical Documentation',
    files: [
      { name: 'API Documentation.pdf', size: '1.2 MB', date: '2026-05-01' },
      { name: 'Database Schema.pdf', size: '0.8 MB', date: '2026-05-02' },
    ],
  },
  {
    id: '3',
    projectName: 'Restaurant Website',
    type: 'Brand Guidelines',
    files: [
      { name: 'Brand Guide.pdf', size: '4.5 MB', date: '2026-04-28' },
      { name: 'Color Palette.pdf', size: '0.3 MB', date: '2026-04-28' },
    ],
  },
];

export default function DeliverablesPage() {
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

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Project Deliverables</h1>
          <p className="text-zinc-400">Download design files, documentation, and all project deliverables.</p>
        </div>

        {MOCK_DELIVERABLES.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <p className="text-zinc-400">No deliverables yet. They will appear here as your projects progress.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {MOCK_DELIVERABLES.map((deliverable) => (
              <div key={deliverable.id} className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase mb-1">{deliverable.projectName}</h3>
                  <h2 className="text-xl font-bold text-white">{deliverable.type}</h2>
                </div>

                <div className="space-y-2">
                  {deliverable.files.map((file, idx) => (
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
