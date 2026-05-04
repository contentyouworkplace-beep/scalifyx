'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../../lib/api';
import toast from 'react-hot-toast';

interface Subscription {
  id: string;
  userName: string;
  phone: string;
  plan: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expiring' | 'expired' | 'cancelled';
  autoRenew: boolean;
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  active: { color: 'text-green-400', bg: 'bg-green-400/20', label: 'Active' },
  expiring: { color: 'text-yellow-400', bg: 'bg-yellow-400/20', label: 'Expiring Soon' },
  expired: { color: 'text-red-400', bg: 'bg-red-400/20', label: 'Expired' },
  cancelled: { color: 'text-zinc-400', bg: 'bg-zinc-400/20', label: 'Cancelled' },
};

function deriveStatus(sub: any): 'active' | 'expiring' | 'expired' | 'cancelled' {
  if (sub.status === 'cancelled') return 'cancelled';
  const end = new Date(sub.end_date);
  const now = new Date();
  if (end < now) return 'expired';
  const daysLeft = (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (daysLeft <= 7) return 'expiring';
  return 'active';
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = useCallback(async () => {
    try {
      const data = await apiFetch('/payment/admin/subscriptions');
      const mapped = (data.subscriptions || []).map((s: any) => ({
        id: s.id, userName: s.profiles?.name || 'Unknown', phone: s.profiles?.phone || '',
        plan: s.plan || 'pro', amount: s.amount || 0, startDate: s.start_date,
        endDate: s.end_date, status: deriveStatus(s), autoRenew: s.auto_renew || false,
      }));
      setSubscriptions(mapped);
    } catch (e) { console.error('Fetch subscriptions error:', e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSubscriptions(); }, [fetchSubscriptions]);

  const filtered = subscriptions.filter((s) => {
    const matchesSearch = s.userName.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    switch (filter) {
      case 'all': return true;
      case 'free_trial': return s.plan === 'trial' && (s.status === 'active' || s.status === 'expiring');
      case 'paid': return s.plan === 'pro' && (s.status === 'active' || s.status === 'expiring');
      case 'cancelled_trial': return s.plan === 'trial' && (s.status === 'cancelled' || s.status === 'expired');
      case 'cancelled_paid': return s.plan === 'pro' && (s.status === 'cancelled' || s.status === 'expired');
      default: return s.status === filter;
    }
  });

  const stats = {
    active: subscriptions.filter(s => s.status === 'active').length,
    expiring: subscriptions.filter(s => s.status === 'expiring').length,
    expired: subscriptions.filter(s => s.status === 'expired').length,
    revenue: subscriptions.filter(s => s.status === 'active' || s.status === 'expiring').reduce((sum, s) => sum + s.amount, 0),
  };

  const handleAction = (sub: Subscription, action: string) => {
    if (!confirm(`${action} ${sub.userName}'s subscription?`)) return;
    toast.success(`${action} action triggered`);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Subscriptions</h1>

      {/* Stats Banner */}
      <div className="flex rounded-[14px] bg-surface border border-border p-4 mb-4">
        <div className="flex-1 text-center">
          <p className="text-lg font-bold">{stats.active}</p>
          <p className="text-[11px] text-zinc-500 mt-0.5">Active</p>
        </div>
        <div className="w-px bg-border" />
        <div className="flex-1 text-center">
          <p className="text-lg font-bold text-yellow-400">{stats.expiring}</p>
          <p className="text-[11px] text-zinc-500 mt-0.5">Expiring</p>
        </div>
        <div className="w-px bg-border" />
        <div className="flex-1 text-center">
          <p className="text-lg font-bold text-red-400">{stats.expired}</p>
          <p className="text-[11px] text-zinc-500 mt-0.5">Expired</p>
        </div>
        <div className="w-px bg-border" />
        <div className="flex-1 text-center">
          <p className="text-lg font-bold text-primary">₹{stats.revenue}</p>
          <p className="text-[11px] text-zinc-500 mt-0.5">MRR</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center bg-surface border border-border rounded-xl px-3 mb-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-500"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input className="flex-1 bg-transparent py-3.5 ml-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none" placeholder="Search subscriptions..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {[
          { key: 'all', label: 'All' },
          { key: 'free_trial', label: 'Free Trial' },
          { key: 'paid', label: 'Paid' },
          { key: 'cancelled_trial', label: 'Cancelled Free' },
          { key: 'cancelled_paid', label: 'Cancelled Paid' },
          { key: 'active', label: 'Active' },
          { key: 'expiring', label: 'Expiring' },
          { key: 'expired', label: 'Expired' },
          { key: 'cancelled', label: 'Cancelled' },
        ].map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition ${filter === f.key ? 'bg-primary/20 border-primary text-primary' : 'bg-surface border-border text-zinc-500'}`}
          >{f.label}</button>
        ))}
      </div>

      {/* Subscription Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <svg className="mx-auto mb-3 text-zinc-600" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          <p className="text-sm text-zinc-500">No subscriptions found</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((sub) => {
            const config = STATUS_CONFIG[sub.status] || STATUS_CONFIG.active;
            return (
              <div key={sub.id} className="rounded-[14px] bg-surface border border-border p-4">
                {/* Header */}
                <div className="flex items-center mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mr-2.5 flex-shrink-0">
                    <span className="text-sm font-bold text-primary">{sub.userName.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{sub.userName}</p>
                    <p className="text-[11px] text-zinc-500">{sub.phone}</p>
                  </div>
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${config.bg} ${config.color}`}>
                    {config.label}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-zinc-500">Plan</span>
                    <span className="text-xs font-medium">{sub.plan === 'pro' ? `Pro — ₹${sub.amount}/mo` : '7-Day Trial'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-zinc-500">Period</span>
                    <span className="text-xs font-medium">{formatDate(sub.startDate)} → {formatDate(sub.endDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-zinc-500">Auto-Renew</span>
                    <span className={`text-xs font-medium ${sub.autoRenew ? 'text-primary' : 'text-zinc-500'}`}>{sub.autoRenew ? 'Yes' : 'No'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                  {sub.status === 'expired' && (
                    <button onClick={() => handleAction(sub, 'Reactivate')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-xs font-medium text-primary">
                      ↻ Reactivate
                    </button>
                  )}
                  {(sub.status === 'active' || sub.status === 'expiring') && (
                    <button onClick={() => handleAction(sub, 'Cancel')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-medium text-red-400">
                      ✕ Cancel
                    </button>
                  )}
                  {sub.status === 'expiring' && (
                    <button onClick={() => handleAction(sub, 'Extend')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-xs font-medium text-primary">
                      + Extend
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
