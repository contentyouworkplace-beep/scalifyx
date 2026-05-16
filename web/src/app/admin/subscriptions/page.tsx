'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../../lib/api';
import toast from 'react-hot-toast';

interface Sub {
  id: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  plan: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expiring' | 'expired' | 'cancelled';
}

function fmtDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function daysLeft(endDate: string) {
  return Math.max(0, Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000));
}

function deriveStatus(s: any): Sub['status'] {
  if (s.status === 'cancelled') return 'cancelled';
  const end = new Date(s.end_date);
  if (end < new Date()) return 'expired';
  if (daysLeft(s.end_date) <= 7) return 'expiring';
  return 'active';
}

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' },
  expiring: { label: 'Expiring', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' },
  expired: { label: 'Expired', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
  cancelled: { label: 'Cancelled', color: 'text-zinc-500', bg: 'bg-zinc-800/50 border-zinc-700/50' },
};

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<Sub[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'expiring' | 'expired' | 'cancelled'>('all');
  const [loading, setLoading] = useState(true);
  const [extending, setExtending] = useState<string | null>(null);

  const fetchSubs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/payment/admin/subscriptions');
      setSubs((data.subscriptions || []).map((s: any) => ({
        id: s.id,
        userName: s.profiles?.name || 'Unknown',
        userPhone: s.profiles?.phone || s.profiles?.whatsapp_number || '',
        userEmail: s.profiles?.email || '',
        plan: s.plan || 'pro',
        amount: s.amount || 0,
        startDate: s.start_date,
        endDate: s.end_date,
        status: deriveStatus(s),
      })));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSubs(); }, [fetchSubs]);

  const handleExtend = async (sub: Sub) => {
    if (!confirm(`Extend ${sub.userName}'s subscription by 30 days?`)) return;
    setExtending(sub.id);
    try {
      await apiFetch(`/payment/admin/extend/${sub.id}`, { method: 'POST', body: JSON.stringify({ days: 30 }) });
      toast.success('Extended by 30 days');
      fetchSubs();
    } catch {
      toast.error('Failed to extend');
    } finally {
      setExtending(null);
    }
  };

  const filtered = subs.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.userName.toLowerCase().includes(q) || s.userPhone.includes(q) || s.userEmail.toLowerCase().includes(q);
    const matchFilter = filter === 'all' || s.status === filter;
    return matchSearch && matchFilter;
  });

  const activeCount = subs.filter(s => s.status === 'active').length;
  const expiringCount = subs.filter(s => s.status === 'expiring').length;
  const expiredCount = subs.filter(s => s.status === 'expired').length;
  const mrr = subs.filter(s => s.status === 'active' || s.status === 'expiring').reduce((sum, s) => sum + s.amount, 0);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold">Subscriptions</h1>
        <p className="text-sm text-zinc-500 mt-1">{subs.length} total · MRR ₹{mrr.toLocaleString()}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {[
          { label: 'Active', value: activeCount, color: 'text-green-400', border: 'border-green-400/20' },
          { label: 'Expiring Soon', value: expiringCount, color: 'text-yellow-400', border: 'border-yellow-400/20' },
          { label: 'Expired', value: expiredCount, color: 'text-red-400', border: 'border-red-400/20' },
          { label: 'MRR', value: `₹${mrr.toLocaleString()}`, color: 'text-primary', border: 'border-primary/20' },
        ].map(c => (
          <div key={c.label} className={`rounded-2xl bg-surface border ${c.border} p-3 text-center`}>
            <div className={`text-xl font-extrabold ${c.color}`}>{c.value}</div>
            <div className="text-[11px] text-zinc-600 mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center bg-surface border border-border rounded-xl px-3 mb-3 focus-within:border-primary/50 transition">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-600 flex-shrink-0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          className="flex-1 bg-transparent py-3 ml-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none"
          placeholder="Search name, phone, email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && <button onClick={() => setSearch('')} className="text-zinc-600 hover:text-zinc-400 text-xs ml-2">✕</button>}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(['all', 'active', 'expiring', 'expired', 'cancelled'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition capitalize ${
              filter === f ? 'bg-primary/15 border-primary text-primary' : 'bg-surface border-border text-zinc-500 hover:border-zinc-600'
            }`}>
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Subscription list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-600 text-sm">No subscriptions found</div>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden">
          {filtered.map((s, i) => {
            const cfg = STATUS[s.status];
            const days = s.endDate ? daysLeft(s.endDate) : 0;
            return (
              <div key={s.id} className={`${i < filtered.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="flex items-center gap-3 px-4 py-3.5">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-sm bg-primary/10 text-primary">
                    {(s.userName || '?')[0].toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{s.userName}</div>
                    <div className="text-[11px] text-zinc-600 mt-0.5">
                      {s.userPhone || s.userEmail || '—'}
                    </div>
                    <div className="text-[11px] text-zinc-700 mt-0.5">
                      {fmtDate(s.startDate)} → {fmtDate(s.endDate)}
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-sm font-extrabold text-white">₹{s.amount}<span className="text-zinc-600 font-normal text-xs">/mo</span></div>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${cfg.bg} ${cfg.color}`}>
                      {s.status === 'active' || s.status === 'expiring' ? `${days}d left` : cfg.label}
                    </span>
                  </div>
                </div>

                {/* Expiring soon — show extend button */}
                {(s.status === 'expiring' || s.status === 'expired') && (
                  <div className="px-4 pb-3 flex items-center gap-2">
                    <button
                      onClick={() => handleExtend(s)}
                      disabled={extending === s.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/20 transition disabled:opacity-50"
                    >
                      {extending === s.id ? 'Extending…' : '+ Extend 30 days'}
                    </button>
                    {s.userPhone && (
                      <a
                        href={`https://wa.me/91${s.userPhone.replace(/\D/g, '').replace(/^91/, '')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold hover:bg-green-500/20 transition"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                        Remind
                      </a>
                    )}
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
