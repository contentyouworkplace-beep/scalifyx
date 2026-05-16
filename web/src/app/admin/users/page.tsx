'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../../lib/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  // Onboarding data
  business_name: string;
  business_category: string;
  business_city: string;
  whatsapp_number: string;
  business_address: string;
  business_description: string;
  logo_url: string;
  instagram_url: string;
  facebook_url: string;
  existing_website_url: string;
  google_maps_link: string;
  services: Array<{ name: string; description?: string; price?: string }>;
  gallery_images: string[];
  domain_purchased: boolean;
  domain_name: string;
  onboarding_completed: boolean;
  created_at: string;
  subscription: { plan: string; status: string; end_date: string | null; amount: number };
}

function timeAgo(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)}d ago`;
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

function fmtDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function WhatsAppBtn({ phone }: { phone: string }) {
  if (!phone) return null;
  const clean = phone.replace(/\D/g, '');
  const num = clean.startsWith('91') ? clean : `91${clean}`;
  return (
    <a href={`https://wa.me/${num}`} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold hover:bg-green-500/20 transition">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378l-.111.066-1.149.604.13-.483A8.4 8.4 0 003.6 9.173a8.5 8.5 0 108.5 8.5 8.504 8.504 0 00-8.5-8.5z"/></svg>
      WhatsApp
    </a>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const isPro = plan === 'pro';
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold ${isPro ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
      {isPro ? 'PRO' : 'FREE'}
    </span>
  );
}

function Row({ user, onPlanChange }: { user: User; onPlanChange: () => void }) {
  const [open, setOpen] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  const handleManualUpgrade = async () => {
    if (!confirm(`Manually upgrade ${user.name} to PRO?`)) return;
    setUpgrading(true);
    try {
      await apiFetch(`/admin/users/${user.id}/manual-upgrade`, { method: 'POST' });
      toast.success(`${user.name} upgraded to PRO`);
      onPlanChange();
    } catch {
      toast.error('Failed to upgrade');
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="border-b border-border last:border-0">
      {/* Main row */}
      <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface/60 transition text-left" onClick={() => setOpen(o => !o)}>
        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-sm bg-primary/10 text-primary">
          {(user.name || '?')[0].toUpperCase()}
        </div>

        {/* Name + business */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold">{user.name || '—'}</span>
            {user.business_name && (
              <span className="text-xs text-zinc-500 truncate">· {user.business_name}</span>
            )}
          </div>
          <div className="text-xs text-zinc-600 mt-0.5">
            {user.phone || user.whatsapp_number || user.email || '—'}
            {user.business_city ? ` · ${user.business_city}` : ''}
          </div>
        </div>

        {/* Right side */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <PlanBadge plan={user.plan || user.subscription?.plan || 'free'} />
          {user.onboarding_completed && (
            <span className="hidden sm:inline px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-green-500/10 text-green-500">✓ Profile</span>
          )}
          <svg className={`text-zinc-600 transition-transform ${open ? 'rotate-180' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
        </div>
      </button>

      {/* Expanded details */}
      {open && (
        <div className="px-4 pb-5 bg-zinc-950/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 pt-3 mb-4">
            {/* Contact */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Contact</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex gap-2"><span className="text-zinc-600 w-16 flex-shrink-0">Email</span><span className="text-zinc-300 break-all">{user.email || '—'}</span></div>
                <div className="flex gap-2"><span className="text-zinc-600 w-16 flex-shrink-0">Phone</span><span className="text-zinc-300">{user.phone || user.whatsapp_number || '—'}</span></div>
                <div className="flex gap-2"><span className="text-zinc-600 w-16 flex-shrink-0">City</span><span className="text-zinc-300">{user.business_city || '—'}</span></div>
                <div className="flex gap-2"><span className="text-zinc-600 w-16 flex-shrink-0">Address</span><span className="text-zinc-300 text-xs">{user.business_address || '—'}</span></div>
              </div>
            </div>

            {/* Business */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Business</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex gap-2"><span className="text-zinc-600 w-16 flex-shrink-0">Name</span><span className="text-zinc-300">{user.business_name || '—'}</span></div>
                <div className="flex gap-2"><span className="text-zinc-600 w-16 flex-shrink-0">Category</span><span className="text-zinc-300">{user.business_category || '—'}</span></div>
                <div className="flex gap-2"><span className="text-zinc-600 w-16 flex-shrink-0">Domain</span><span className="text-zinc-300">{user.domain_name || (user.domain_purchased ? 'Purchased' : '—')}</span></div>
                {user.existing_website_url && (
                  <div className="flex gap-2"><span className="text-zinc-600 w-16 flex-shrink-0">Website</span><a href={user.existing_website_url} target="_blank" rel="noopener noreferrer" className="text-primary text-xs underline truncate">{user.existing_website_url}</a></div>
                )}
              </div>
            </div>

            {/* Plan + Subscription */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Subscription</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex gap-2"><span className="text-zinc-600 w-16 flex-shrink-0">Plan</span><span className="text-zinc-300 capitalize">{user.subscription?.plan || user.plan || 'free'}</span></div>
                <div className="flex gap-2"><span className="text-zinc-600 w-16 flex-shrink-0">Status</span><span className="text-zinc-300 capitalize">{user.subscription?.status || 'inactive'}</span></div>
                <div className="flex gap-2"><span className="text-zinc-600 w-16 flex-shrink-0">Expires</span><span className="text-zinc-300">{fmtDate(user.subscription?.end_date)}</span></div>
                <div className="flex gap-2"><span className="text-zinc-600 w-16 flex-shrink-0">Paid</span><span className="text-zinc-300">{user.subscription?.amount ? `₹${user.subscription.amount}` : '—'}</span></div>
                <div className="flex gap-2"><span className="text-zinc-600 w-16 flex-shrink-0">Joined</span><span className="text-zinc-300">{fmtDate(user.created_at)}</span></div>
              </div>
            </div>

            {/* Services */}
            {user.services?.length > 0 && (
              <div className="sm:col-span-2 lg:col-span-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Services ({user.services.length})</p>
                <div className="flex flex-wrap gap-2">
                  {user.services.map((s, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-zinc-300">
                      {s.name}{s.price ? ` · ₹${s.price}` : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {user.business_description && (
              <div className="sm:col-span-2 lg:col-span-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-1">About</p>
                <p className="text-xs text-zinc-400 leading-relaxed">{user.business_description}</p>
              </div>
            )}

            {/* Social */}
            {(user.instagram_url || user.facebook_url) && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Social</p>
                <div className="space-y-1.5 text-sm">
                  {user.instagram_url && <div className="flex gap-2"><span className="text-zinc-600 w-16 flex-shrink-0">Instagram</span><a href={user.instagram_url} target="_blank" rel="noopener noreferrer" className="text-primary text-xs underline truncate">{user.instagram_url}</a></div>}
                  {user.facebook_url && <div className="flex gap-2"><span className="text-zinc-600 w-16 flex-shrink-0">Facebook</span><a href={user.facebook_url} target="_blank" rel="noopener noreferrer" className="text-primary text-xs underline truncate">{user.facebook_url}</a></div>}
                </div>
              </div>
            )}

            {/* Gallery count + logo */}
            {(user.logo_url || user.gallery_images?.length > 0) && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Media</p>
                <div className="flex items-center gap-3">
                  {user.logo_url && (
                    <img src={user.logo_url} alt="logo" className="w-10 h-10 rounded-lg object-cover border border-border" />
                  )}
                  {user.gallery_images?.length > 0 && (
                    <span className="text-xs text-zinc-400">{user.gallery_images.length} gallery image{user.gallery_images.length !== 1 ? 's' : ''}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-3 border-t border-border/50">
            <WhatsAppBtn phone={user.phone || user.whatsapp_number || ''} />
            {(user.plan !== 'pro' && user.subscription?.plan !== 'pro') && (
              <button
                onClick={handleManualUpgrade}
                disabled={upgrading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/20 transition disabled:opacity-50"
              >
                {upgrading ? 'Upgrading...' : '⬆ Manual Upgrade'}
              </button>
            )}
            <span className="ml-auto text-[11px] text-zinc-700">ID: {user.id.slice(0, 8)}…</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pro' | 'free' | 'onboarded'>('all');
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/admin/users');
      setUsers(data.users || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.phone || '').includes(q) ||
      (u.whatsapp_number || '').includes(q) ||
      (u.business_name || '').toLowerCase().includes(q) ||
      (u.business_city || '').toLowerCase().includes(q);

    const plan = u.plan || u.subscription?.plan || 'free';
    const matchFilter =
      filter === 'all' ||
      (filter === 'pro' && plan === 'pro') ||
      (filter === 'free' && plan !== 'pro') ||
      (filter === 'onboarded' && u.onboarding_completed);

    return matchSearch && matchFilter;
  });

  const proCount = users.filter(u => (u.plan || u.subscription?.plan) === 'pro').length;
  const onboardedCount = users.filter(u => u.onboarding_completed).length;

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold">Users</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {users.length} total · {proCount} pro · {onboardedCount} onboarded
          </p>
        </div>
        <button onClick={fetchUsers} className="px-4 py-2 rounded-xl bg-surface border border-border text-sm font-semibold hover:border-primary/40 transition">
          Refresh
        </button>
      </div>

      {/* Summary chips */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="rounded-2xl bg-surface border border-border p-3 text-center">
          <div className="text-xl font-extrabold">{users.length}</div>
          <div className="text-[11px] text-zinc-600 mt-0.5">Total</div>
        </div>
        <div className="rounded-2xl bg-surface border border-primary/20 p-3 text-center">
          <div className="text-xl font-extrabold text-primary">{proCount}</div>
          <div className="text-[11px] text-zinc-600 mt-0.5">Pro</div>
        </div>
        <div className="rounded-2xl bg-surface border border-green-500/20 p-3 text-center">
          <div className="text-xl font-extrabold text-green-400">{onboardedCount}</div>
          <div className="text-[11px] text-zinc-600 mt-0.5">Onboarded</div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center bg-surface border border-border rounded-xl px-3 mb-3 focus-within:border-primary/50 transition">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-600 flex-shrink-0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          className="flex-1 bg-transparent py-3 ml-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none"
          placeholder="Search name, phone, email, business, city…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-zinc-600 hover:text-zinc-400 text-xs ml-2">✕</button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {([
          { key: 'all', label: 'All' },
          { key: 'pro', label: '✦ Pro' },
          { key: 'free', label: 'Free' },
          { key: 'onboarded', label: '✓ Onboarded' },
        ] as const).map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
              filter === f.key ? 'bg-primary/15 border-primary text-primary' : 'bg-surface border-border text-zinc-500 hover:border-zinc-600'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Users list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-600 text-sm">No users found</div>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden">
          {filtered.map(u => (
            <Row key={u.id} user={u} onPlanChange={fetchUsers} />
          ))}
        </div>
      )}
    </div>
  );
}
