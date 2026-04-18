'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../../lib/api';

interface Payment {
  id: string;
  userName: string;
  amount: number;
  method: string;
  date: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  transactionId: string;
  plan: string;
}

const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  completed: { color: 'text-green-400', bg: 'bg-green-400/20' },
  pending: { color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
  failed: { color: 'text-red-400', bg: 'bg-red-400/20' },
  refunded: { color: 'text-indigo-400', bg: 'bg-indigo-400/20' },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(async () => {
    try {
      const data = await apiFetch('/payment/admin/all');
      const mapped = (data.payments || []).map((p: any) => ({
        id: p.id, userName: p.profiles?.name || 'Unknown', amount: p.amount || 0,
        method: p.method || 'Razorpay', date: p.created_at,
        status: p.status || 'pending', transactionId: p.transaction_id || p.razorpay_payment_id || p.id?.substring(0, 12) || '',
        plan: p.plan || 'Pro',
      }));
      setPayments(mapped);
    } catch (e) { console.error('Fetch payments error:', e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const filtered = payments.filter((p) => {
    const matchesSearch = p.userName.toLowerCase().includes(search.toLowerCase()) || p.transactionId.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (filter === 'all' || p.status === filter);
  });

  const stats = {
    total: payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0),
    pending: payments.filter(p => p.status === 'pending').length,
    failed: payments.filter(p => p.status === 'failed').length,
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      {/* Stats Banner */}
      <div className="flex rounded-[14px] bg-surface border border-border p-4 mb-4">
        <div className="flex-1 text-center">
          <p className="text-lg font-bold text-primary">₹{stats.total}</p>
          <p className="text-[11px] text-zinc-500 mt-0.5">Collected</p>
        </div>
        <div className="w-px bg-border" />
        <div className="flex-1 text-center">
          <p className="text-lg font-bold text-yellow-400">{stats.pending}</p>
          <p className="text-[11px] text-zinc-500 mt-0.5">Pending</p>
        </div>
        <div className="w-px bg-border" />
        <div className="flex-1 text-center">
          <p className="text-lg font-bold text-red-400">{stats.failed}</p>
          <p className="text-[11px] text-zinc-500 mt-0.5">Failed</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center bg-surface border border-border rounded-xl px-3 mb-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-500"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input className="flex-1 bg-transparent py-3.5 ml-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none" placeholder="Search by name or TXN ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Filter */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {(['all', 'completed', 'pending', 'failed', 'refunded'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition ${filter === f ? 'bg-primary/20 border-primary text-primary' : 'bg-surface border-border text-zinc-500'}`}
          >{f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
      </div>

      {/* Payment Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <svg className="mx-auto mb-3 text-zinc-600" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <p className="text-sm text-zinc-500">No payments found</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((p) => {
            const config = STATUS_CONFIG[p.status] || STATUS_CONFIG.pending;
            return (
              <div key={p.id} className="rounded-[14px] bg-surface border border-border p-3.5">
                {/* Header */}
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mr-2.5 flex-shrink-0">
                    <span className="text-sm font-bold text-primary">{p.userName.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{p.userName}</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">{formatDate(p.date)} · {p.method}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-base font-bold ${p.status === 'refunded' ? 'line-through text-zinc-500' : ''}`}>₹{p.amount}</p>
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold mt-1 ${config.bg} ${config.color}`}>
                      {p.status}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between mt-2.5 pt-2.5 border-t border-border">
                  <span className="text-[11px] text-zinc-600 font-mono">{p.transactionId}</span>
                  <span className="text-[11px] text-zinc-500">{p.plan}</span>
                </div>

                {/* Actions for pending */}
                {p.status === 'pending' && (
                  <div className="flex gap-2 mt-2.5 pt-2.5 border-t border-border">
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-xs font-medium text-primary">
                      ✓ Mark Paid
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-400/10 border border-yellow-400/30 text-xs font-medium text-yellow-400">
                      🔔 Send Reminder
                    </button>
                  </div>
                )}
                {p.status === 'failed' && (
                  <div className="flex gap-2 mt-2.5 pt-2.5 border-t border-border">
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-medium text-red-400">
                      ↻ Retry
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-xs font-medium text-primary">
                      💬 Contact User
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
