'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../../lib/api';

interface Payment {
  id: string;
  userName: string;
  userPhone: string;
  amount: number;
  method: string;
  date: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  transactionId: string;
  plan: string;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmtRevenue(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  completed: { label: 'Paid', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' },
  pending: { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' },
  failed: { label: 'Failed', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
  refunded: { label: 'Refunded', color: 'text-zinc-400', bg: 'bg-zinc-700/30 border-zinc-700/50' },
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/admin/payments');
      setPayments((data.payments || []).map((p: any) => ({
        id: p.id,
        userName: p.profiles?.name || 'Unknown',
        userPhone: p.profiles?.phone || p.profiles?.whatsapp_number || '',
        amount: p.amount || 0,
        method: p.method || 'Razorpay',
        date: p.created_at,
        status: p.status || 'pending',
        transactionId: p.razorpay_payment_id || p.transaction_id || p.id?.slice(0, 12) || '',
        plan: p.plan || 'pro',
      })));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const filtered = payments.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.userName.toLowerCase().includes(q) || p.transactionId.toLowerCase().includes(q) || p.userPhone.includes(q);
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const totalCollected = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
  const pendingCount = payments.filter(p => p.status === 'pending').length;
  const failedCount = payments.filter(p => p.status === 'failed').length;
  const now = new Date();
  const thisMonth = payments.filter(p => {
    const d = new Date(p.date);
    return p.status === 'completed' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((s, p) => s + p.amount, 0);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold">Payments</h1>
        <p className="text-sm text-zinc-500 mt-1">{payments.filter(p => p.status === 'completed').length} successful transactions</p>
      </div>

      {/* Revenue hero */}
      <div className="rounded-3xl bg-gradient-to-br from-green-500/15 via-green-500/5 to-transparent border border-green-500/25 p-5 mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-green-500/60 mb-1">Total Collected</p>
        <div className="flex items-end gap-4 flex-wrap">
          <span className="text-4xl font-black text-white">{fmtRevenue(totalCollected)}</span>
          <span className="mb-1 text-sm text-zinc-400"><span className="text-green-400 font-bold">{fmtRevenue(thisMonth)}</span> this month</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="rounded-2xl bg-surface border border-border p-3 text-center">
          <div className="text-lg font-extrabold text-green-400">{payments.filter(p => p.status === 'completed').length}</div>
          <div className="text-[11px] text-zinc-600 mt-0.5">Completed</div>
        </div>
        <div className="rounded-2xl bg-surface border border-yellow-400/20 p-3 text-center">
          <div className="text-lg font-extrabold text-yellow-400">{pendingCount}</div>
          <div className="text-[11px] text-zinc-600 mt-0.5">Pending</div>
        </div>
        <div className="rounded-2xl bg-surface border border-red-400/20 p-3 text-center">
          <div className="text-lg font-extrabold text-red-400">{failedCount}</div>
          <div className="text-[11px] text-zinc-600 mt-0.5">Failed</div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center bg-surface border border-border rounded-xl px-3 mb-3 focus-within:border-primary/50 transition">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-600 flex-shrink-0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          className="flex-1 bg-transparent py-3 ml-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none"
          placeholder="Search name, phone, transaction ID…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && <button onClick={() => setSearch('')} className="text-zinc-600 hover:text-zinc-400 text-xs ml-2">✕</button>}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(['all', 'completed', 'pending', 'failed'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition capitalize ${
              filter === f ? 'bg-primary/15 border-primary text-primary' : 'bg-surface border-border text-zinc-500 hover:border-zinc-600'
            }`}>
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Payment list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-600 text-sm">No payments found</div>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden">
          {filtered.map((p, i) => {
            const cfg = STATUS[p.status] || STATUS.pending;
            return (
              <div key={p.id} className={`flex items-center gap-3 px-4 py-3.5 ${i < filtered.length - 1 ? 'border-b border-border' : ''} hover:bg-surface/40 transition`}>
                <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-sm bg-primary/10 text-primary">
                  {(p.userName || '?')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{p.userName}</div>
                  <div className="text-[11px] text-zinc-600 mt-0.5 font-mono truncate">{p.transactionId}</div>
                  {p.userPhone && <div className="text-[11px] text-zinc-700">{p.userPhone}</div>}
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-base font-extrabold text-white">₹{p.amount}</div>
                  <div className="text-[11px] text-zinc-600">{fmtDate(p.date)}</div>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${cfg.bg} ${cfg.color}`}>
                    {cfg.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
