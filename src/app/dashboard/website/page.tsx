'use client';

import { useAuth } from '../../../context/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../../lib/api';
import Link from 'next/link';
import { GlobeIcon, ChatBotIcon, ChartIcon } from '../../../components/Icons';

export default function MyWebsitePage() {
  const { user } = useAuth();
  const websiteUrl = user?.websiteUrl || null;
  const [stats, setStats] = useState({ visitors: 0, leads: 0, pageViews: 0, uptime: 99.9 });

  const fetchStats = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await apiFetch(`/user/${user.id}/analytics`);
      setStats({ visitors: data.visitors || 0, leads: data.leads || 0, pageViews: data.pageViews || 0, uptime: data.uptime || 99.9 });
    } catch {}
  }, [user?.id]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  if (!websiteUrl) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
          <GlobeIcon size={32} />
        </div>
        <h2 className="text-xl font-bold mb-2">No Website Yet</h2>
        <p className="text-sm text-zinc-500 mb-6">Chat with our AI to create your website in 60 seconds!</p>
        <Link href="/dashboard/chat" className="px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold transition">
          Create Website Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto md:max-w-2xl">
      <h1 className="text-2xl font-extrabold mb-4">My Website</h1>

      {/* Status Card */}
      <div className="rounded-2xl bg-surface border border-border p-4 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
          <span className="text-sm text-green-400 font-semibold">Active & Live</span>
        </div>
        <a href={`https://${websiteUrl}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline">
          <LinkSvg /> {websiteUrl}
        </a>
      </div>

      {/* Analytics */}
      <h2 className="text-base font-bold mb-3">This Month</h2>
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: 'Visitors', value: stats.visitors.toLocaleString(), color: 'text-primary', bgColor: 'bg-primary/10', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> },
          { label: 'Leads', value: stats.leads.toLocaleString(), color: 'text-indigo-400', bgColor: 'bg-indigo-500/10', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
          { label: 'Page Views', value: stats.pageViews.toLocaleString(), color: 'text-purple-400', bgColor: 'bg-purple-500/10', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> },
          { label: 'Uptime', value: `${stats.uptime}%`, color: 'text-orange-400', bgColor: 'bg-orange-500/10', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-2xl bg-surface border border-border">
            <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center ${stat.color} mb-2`}>
              {stat.icon}
            </div>
            <div className="text-xl font-extrabold">{stat.value}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Website Actions */}
      <h2 className="text-base font-bold mb-3">Website Actions</h2>
      <div className="space-y-2 mb-6">
        {[
          { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>, label: 'Edit Website', desc: 'Chat with AI to make changes', color: 'text-primary', bg: 'bg-primary/10', href: '/dashboard/chat' },
          { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><path d="M17 2H7a5 5 0 00-5 5v10a5 5 0 005 5h10a5 5 0 005-5V7a5 5 0 00-5-5z"/><path d="M2 15l3.293-3.293a1 1 0 011.414 0L12 17l4.293-4.293a1 1 0 011.414 0L22 17"/></svg>, label: 'Update Photos', desc: 'Add or replace images', color: 'text-indigo-400', bg: 'bg-indigo-500/10', href: '/dashboard/chat' },
          { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>, label: 'Share Website', desc: 'Share link via WhatsApp', color: 'text-green-400', bg: 'bg-green-500/10', href: '#', share: true },
          { icon: <ChartIcon size={22} />, label: 'View Analytics', desc: 'Detailed visitor report', color: 'text-purple-400', bg: 'bg-purple-500/10', href: '#' },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            onClick={action.share ? (e: React.MouseEvent) => {
              e.preventDefault();
              if (navigator.share) {
                navigator.share({ title: 'My Website', url: `https://${websiteUrl}` });
              } else {
                navigator.clipboard.writeText(`https://${websiteUrl}`);
              }
            } : undefined}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface border border-border hover:border-primary/20 transition"
          >
            <div className={`w-11 h-11 rounded-xl ${action.bg} flex items-center justify-center ${action.color} flex-shrink-0`}>
              {action.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">{action.label}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{action.desc}</div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 flex-shrink-0"><path d="M9 18l6-6-6-6" /></svg>
          </Link>
        ))}
      </div>
    </div>
  );
}

function LinkSvg() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1 -mt-0.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
  );
}
