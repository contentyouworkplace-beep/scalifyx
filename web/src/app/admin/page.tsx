'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

function timeAgo(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function fmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

function pct(a: number, b: number) {
  if (!b) return '0%';
  return `${Math.round((a / b) * 100)}%`;
}

interface Signup {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  business_name?: string;
  business_city?: string;
  created_at: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0, proUsers: 0, totalRevenue: 0,
    monthlyRevenue: 0, monthlyNewUsers: 0,
  });
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [dash, usersData] = await Promise.all([
        apiFetch('/admin/dashboard'),
        apiFetch('/admin/users'),
      ]);
      setStats({
        totalUsers: dash.totals?.totalUsers || 0,
        proUsers: dash.metrics?.uniquePaidUsers || 0,
        totalRevenue: dash.metrics?.totalRevenue || 0,
        monthlyRevenue: dash.metrics?.monthly?.revenue || 0,
        monthlyNewUsers: dash.metrics?.monthly?.newUsers || 0,
      });
      const recent = (usersData.users || []).slice(0, 8).map((u: any) => ({
        id: u.id,
        name: u.name || 'Unknown',
        email: u.email || '',
        phone: u.phone || u.whatsapp_number || '',
        plan: u.plan || u.subscription?.plan || 'free',
        business_name: u.business_name || '',
        business_city: u.business_city || '',
        created_at: u.created_at,
      }));
      setSignups(recent);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const convRate = pct(stats.proUsers, stats.totalUsers);

  return (
    <div className="max-w-4xl">

      {/* Top greeting */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-1">Scalify Admin</p>
          <h1 className="text-2xl font-extrabold">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0] || 'Admin'}</h1>
        </div>
        <button onClick={() => load()} className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center text-zinc-500 hover:text-white transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        </button>
      </div>

      {/* ── Hero Revenue Card ───────────────────────────────── */}
      <div className="rounded-3xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/30 p-6 mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-1">Total Revenue</p>
        <div className="flex items-end gap-4">
          <span className="text-5xl font-black text-white">{fmt(stats.totalRevenue)}</span>
          <div className="mb-1 text-sm text-zinc-400">
            <span className="text-green-400 font-bold">{fmt(stats.monthlyRevenue)}</span> this month
          </div>
        </div>
      </div>

      {/* ── 4 Metric Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total Users', value: stats.totalUsers.toLocaleString(), color: 'text-white', sub: `${stats.monthlyNewUsers} this month` },
          { label: 'Pro Users', value: stats.proUsers.toLocaleString(), color: 'text-primary', sub: 'paying customers' },
          { label: 'Conversion', value: convRate, color: 'text-yellow-400', sub: 'free → paid' },
          { label: 'MRR', value: fmt(stats.monthlyRevenue), color: 'text-green-400', sub: 'monthly revenue' },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl bg-surface border border-border p-4">
            <div className={`text-2xl font-extrabold ${card.color}`}>{card.value}</div>
            <div className="text-xs font-semibold text-white mt-1">{card.label}</div>
            <div className="text-[11px] text-zinc-600 mt-0.5">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Quick Nav ─────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-2 mb-8">
        {[
          { href: '/admin/users', label: 'Users', emoji: '👥' },
          { href: '/admin/payments', label: 'Payments', emoji: '💳' },
          { href: '/admin/subscriptions', label: 'Subs', emoji: '📋' },
          { href: '/admin/notifications', label: 'Notify', emoji: '🔔' },
        ].map((nav) => (
          <Link key={nav.href} href={nav.href}
            className="flex flex-col items-center gap-2 py-3 px-2 rounded-2xl bg-surface border border-border hover:border-primary/40 hover:bg-primary/5 transition text-center group">
            <span className="text-2xl">{nav.emoji}</span>
            <span className="text-xs font-semibold text-zinc-400 group-hover:text-white transition">{nav.label}</span>
          </Link>
        ))}
      </div>

      {/* ── Recent Signups ────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-extrabold uppercase tracking-widest text-zinc-500">Recent Signups</h2>
        <Link href="/admin/users" className="text-xs text-primary font-semibold hover:underline">See all →</Link>
      </div>
      <div className="rounded-2xl border border-border overflow-hidden">
        {signups.length === 0 ? (
          <div className="p-8 text-center text-sm text-zinc-600">No signups yet</div>
        ) : (
          signups.map((s, i) => (
            <div key={s.id} className={`flex items-center gap-3 px-4 py-3 ${i < signups.length - 1 ? 'border-b border-border' : ''} hover:bg-surface/60 transition`}>
              {/* Avatar */}
              <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-sm bg-primary/10 text-primary">
                {(s.name || '?')[0].toUpperCase()}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold truncate">{s.name}</span>
                  {s.business_name && (
                    <span className="text-xs text-zinc-500 truncate hidden sm:inline">· {s.business_name}</span>
                  )}
                </div>
                <div className="text-xs text-zinc-600 truncate mt-0.5">
                  {s.phone || s.email}{s.business_city ? ` · ${s.business_city}` : ''}
                </div>
              </div>
              {/* Plan badge + time */}
              <div className="flex-shrink-0 flex flex-col items-end gap-1">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                  s.plan === 'pro' ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {s.plan === 'pro' ? 'PRO' : 'FREE'}
                </span>
                <span className="text-[10px] text-zinc-600">{timeAgo(s.created_at)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
