'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import React from 'react';

function formatRevenue(val: number) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
  return `₹${val}`;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function PeopleIcon({ className }: { className?: string }) {
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
function GlobeIcon({ className }: { className?: string }) {
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
}
function CardIcon({ className }: { className?: string }) {
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
}
function AlertIcon({ className }: { className?: string }) {
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
}
function PersonAddIcon({ className }: { className?: string }) {
  return <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>;
}
function ChatBubbleIcon({ className }: { className?: string }) {
  return <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
}
function CashIcon({ className }: { className?: string }) {
  return <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
}
function BellIcon({ className }: { className?: string }) {
  return <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
}

interface ActivityItem {
  icon: 'person-add' | 'card' | 'globe';
  text: string;
  time: string;
  color: string;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [dashStats, setDashStats] = useState({ totalUsers: 0, activeSites: 0, totalRevenue: 0, pendingPayments: 0 });
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      const [statsData, activityData] = await Promise.all([
        apiFetch('/admin/dashboard'),
        apiFetch('/admin/activity'),
      ]);
      setDashStats(statsData);

      const items: ActivityItem[] = [];
      (activityData.recentUsers || []).forEach((u: any) =>
        items.push({ icon: 'person-add', text: `New user: ${u.name || u.phone || 'Unknown'}`, time: u.created_at, color: '#22C55E' })
      );
      (activityData.recentPayments || []).forEach((p: any) =>
        items.push({ icon: 'card', text: `Payment: ₹${p.amount} — ${p.profiles?.name || 'User'}`, time: p.created_at, color: '#F59E0B' })
      );
      (activityData.recentSites || []).forEach((s: any) =>
        items.push({ icon: 'globe', text: `Website: ${s.business_name}`, time: s.created_at, color: '#6366F1' })
      );
      items.sort((a: ActivityItem, b: ActivityItem) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setActivity(items.slice(0, 8));
    } catch (e) {
      console.error('Dashboard fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { icon: PeopleIcon, label: 'Total Users', value: dashStats.totalUsers.toLocaleString(), color: 'text-green-400', bg: 'bg-green-400/10' },
    { icon: GlobeIcon, label: 'Active Sites', value: dashStats.activeSites.toLocaleString(), color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { icon: CardIcon, label: 'Revenue', value: formatRevenue(dashStats.totalRevenue), color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { icon: AlertIcon, label: 'Pending', value: dashStats.pendingPayments.toString(), color: 'text-red-400', bg: 'bg-red-400/10' },
  ];

  const quickActions = [
    { icon: PersonAddIcon, label: 'Users', href: '/admin/users' },
    { icon: ChatBubbleIcon, label: 'Chats', href: '/admin/chats' },
    { icon: CardIcon, label: 'Subscriptions', href: '/admin/subscriptions' },
    { icon: CashIcon, label: 'Payments', href: '/admin/payments' },
    { icon: BellIcon, label: 'Notifications', href: '/admin/notifications' },
  ];

  const activityIconMap: Record<string, React.FC<{ className?: string }>> = {
    'person-add': PersonAddIcon,
    'card': CardIcon,
    'globe': GlobeIcon,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider">Admin Panel</p>
          <h1 className="text-xl md:text-2xl font-bold mt-0.5">Welcome, {user?.name || 'Admin'}</h1>
        </div>
        <button
          onClick={logout}
          className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-zinc-400 hover:text-white transition"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 mb-7">
        {statCards.map((card) => (
          <div key={card.label} className="p-4 rounded-2xl bg-surface border border-border">
            <div className={`w-9 h-9 rounded-[10px] ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon className={card.color} />
            </div>
            <div className="text-xl md:text-2xl font-bold">{card.value}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-base font-bold mb-3">Manage</h2>
      <div className="flex justify-between mb-7">
        {quickActions.map((action) => (
          <Link key={action.label} href={action.href} className="flex flex-col items-center group">
            <div className="w-12 h-12 rounded-[14px] bg-surface border border-border flex items-center justify-center mb-1.5 group-hover:border-primary/50 transition">
              <action.icon className="text-primary" />
            </div>
            <span className="text-[11px] text-zinc-500 font-medium text-center">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <h2 className="text-base font-bold mb-3">Recent Activity</h2>
      <div className="rounded-2xl bg-surface border border-border p-4">
        {activity.length === 0 ? (
          <p className="text-zinc-500 text-center py-4 text-sm">No recent activity</p>
        ) : (
          activity.map((item, i) => {
            const Icon = activityIconMap[item.icon] || PeopleIcon;
            return (
              <div key={i} className={`flex items-center py-3 ${i < activity.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center mr-3" style={{ backgroundColor: item.color + '20' }}>
                  <Icon className="" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate">{item.text}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{timeAgo(item.time)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
