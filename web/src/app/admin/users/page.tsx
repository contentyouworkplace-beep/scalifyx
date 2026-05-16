'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../../lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
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

function fmtDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function timeAgo(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

// ── Create User Modal ─────────────────────────────────────────────────────────
function CreateUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', plan: 'free', amount: '1499' });
  const [saving, setSaving] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const submit = async () => {
    if (!form.email || !form.password) { toast.error('Email and password required'); return; }
    setSaving(true);
    try {
      await apiFetch('/admin/users', {
        method: 'POST',
        body: JSON.stringify({ ...form, amount: form.plan === 'pro' ? Number(form.amount) : 0 }),
      });
      toast.success('User created');
      onCreated();
      onClose();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-border shadow-2xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-extrabold">Create User</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-sm transition">✕</button>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Rahul Sharma' },
            { label: 'Email *', key: 'email', type: 'email', placeholder: 'user@email.com' },
            { label: 'Phone', key: 'phone', type: 'tel', placeholder: '9876543210' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-semibold text-zinc-500 mb-1 block">{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={(form as any)[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary/60"
              />
            </div>
          ))}

          <div>
            <label className="text-xs font-semibold text-zinc-500 mb-1 block">Password *</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Min 6 characters"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary/60 pr-10"
              />
              <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                {showPw
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-500 mb-1 block">Plan</label>
            <div className="grid grid-cols-2 gap-2">
              {(['free', 'pro'] as const).map(p => (
                <button key={p} type="button" onClick={() => setForm(f => ({ ...f, plan: p }))}
                  className={`py-2.5 rounded-xl text-sm font-bold border transition capitalize ${
                    form.plan === p ? (p === 'pro' ? 'bg-primary/20 border-primary text-primary' : 'bg-zinc-700 border-zinc-600 text-white') : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-zinc-600'
                  }`}>
                  {p === 'pro' ? '✦ Pro' : 'Free'}
                </button>
              ))}
            </div>
          </div>

          {form.plan === 'pro' && (
            <div>
              <label className="text-xs font-semibold text-zinc-500 mb-1 block">Amount Paid (₹)</label>
              <input
                type="number"
                min="0"
                value={form.amount}
                onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary/60"
              />
            </div>
          )}
        </div>

        <button
          onClick={submit}
          disabled={saving}
          className="w-full mt-5 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-extrabold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving
            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : 'Create User'
          }
        </button>
      </div>
    </div>
  );
}

// ── Apply Coupon Modal ────────────────────────────────────────────────────────
const DURATION_PRESETS = [
  { label: '10 min', minutes: 10 },
  { label: '30 min', minutes: 30 },
  { label: '1 hour', minutes: 60 },
  { label: '3 hours', minutes: 180 },
  { label: '6 hours', minutes: 360 },
  { label: '24 hours', minutes: 1440 },
];

function ApplyCouponModal({ user, onClose, onDone }: { user: User; onClose: () => void; onDone: () => void }) {
  const [price, setPrice] = useState('899');
  const [minutes, setMinutes] = useState(60);
  const [customMin, setCustomMin] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [saving, setSaving] = useState(false);

  const effectiveMinutes = useCustom ? Number(customMin) : minutes;
  const discount = 1499 - Number(price);
  const expiresAt = new Date(Date.now() + effectiveMinutes * 60000);

  const submit = async () => {
    if (!price || Number(price) < 1) { toast.error('Enter a valid price'); return; }
    if (!effectiveMinutes || effectiveMinutes < 1) { toast.error('Enter a valid duration'); return; }
    setSaving(true);
    try {
      await apiFetch(`/admin/users/${user.id}/apply-coupon`, {
        method: 'POST',
        body: JSON.stringify({ price: Number(price), original_price: 1499, minutes: effectiveMinutes }),
      });
      toast.success(`Coupon applied — ₹${price} valid for ${effectiveMinutes < 60 ? `${effectiveMinutes} min` : `${Math.round(effectiveMinutes / 60)}h`}`);
      onDone();
      onClose();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to apply coupon');
    } finally {
      setSaving(false);
    }
  };

  const removeCoupon = async () => {
    setSaving(true);
    try {
      await apiFetch(`/admin/users/${user.id}/remove-coupon`, { method: 'DELETE' });
      toast.success('Coupon removed');
      onDone();
      onClose();
    } catch {
      toast.error('Failed to remove coupon');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-border shadow-2xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="text-lg font-extrabold">Apply Coupon</h3>
            <p className="text-xs text-zinc-500 mt-0.5">{user.name || user.email}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-sm transition">✕</button>
        </div>

        <p className="text-xs text-zinc-600 mb-4 leading-relaxed">
          User will see this as a personal offer with a live countdown on their Plans page.
        </p>

        <div className="space-y-4">
          {/* Price */}
          <div>
            <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">Offer Price (₹)</label>
            <div className="flex gap-2 mb-2">
              {['699', '799', '899', '999', '1199'].map(v => (
                <button key={v} type="button" onClick={() => setPrice(v)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${price === v ? 'bg-primary/20 border-primary text-primary' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'}`}>
                  ₹{v}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">₹</span>
              <input
                type="number" min="1" max="1499"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-7 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary/60"
                placeholder="Custom price"
              />
            </div>
            {Number(price) > 0 && Number(price) < 1499 && (
              <p className="text-xs text-green-400 mt-1">User saves ₹{discount} off ₹1,499</p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">Valid For</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {DURATION_PRESETS.map(p => (
                <button key={p.minutes} type="button"
                  onClick={() => { setMinutes(p.minutes); setUseCustom(false); }}
                  className={`py-2 rounded-xl text-xs font-semibold border transition ${!useCustom && minutes === p.minutes ? 'bg-primary/20 border-primary text-primary' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'}`}>
                  {p.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number" min="1"
                value={customMin}
                onChange={e => { setCustomMin(e.target.value); setUseCustom(true); }}
                onFocus={() => setUseCustom(true)}
                placeholder="Custom minutes"
                className={`flex-1 bg-zinc-800 border rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none transition ${useCustom ? 'border-primary/60' : 'border-zinc-700'}`}
              />
              <span className="text-xs text-zinc-600">min</span>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-xl bg-zinc-800/60 border border-zinc-700/50 px-4 py-3">
            <p className="text-[11px] text-zinc-500 mb-0.5">User will see</p>
            <p className="text-sm font-extrabold text-white">₹{price} <span className="text-zinc-500 line-through font-normal text-xs">₹1,499</span></p>
            <p className="text-xs text-yellow-400 mt-0.5">
              Expires {expiresAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              {' · '}{expiresAt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={removeCoupon}
            disabled={saving}
            className="px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-bold hover:text-red-400 hover:border-red-500/30 transition disabled:opacity-50"
          >
            Remove
          </button>
          <button
            onClick={submit}
            disabled={saving || !price || Number(price) < 1 || !effectiveMinutes}
            className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-extrabold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Apply Coupon'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Set Password Modal ────────────────────────────────────────────────────────
function SetPasswordModal({ user, onClose }: { user: User; onClose: () => void }) {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setSaving(true);
    try {
      await apiFetch(`/admin/users/${user.id}/set-password`, {
        method: 'POST',
        body: JSON.stringify({ password }),
      });
      toast.success('Password updated');
      onClose();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to set password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-xs rounded-2xl bg-zinc-900 border border-border shadow-2xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-extrabold">Set Password</h3>
            <p className="text-xs text-zinc-500 mt-0.5">{user.name || user.email}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-sm transition">✕</button>
        </div>

        <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
          Passwords are hashed — this sets a new password for the user. Share it with them via WhatsApp.
        </p>

        <div>
          <label className="text-xs font-semibold text-zinc-500 mb-1 block">New Password</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Min 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary/60 pr-10"
              autoFocus
            />
            <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition">
              {showPw
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          </div>
        </div>

        <button
          onClick={submit}
          disabled={saving || password.length < 6}
          className="w-full mt-4 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-extrabold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Set Password'}
        </button>
      </div>
    </div>
  );
}

// ── Set Plan Modal ────────────────────────────────────────────────────────────
function SetPlanModal({ user, onClose, onDone }: { user: User; onClose: () => void; onDone: () => void }) {
  const [plan, setPlan] = useState<'free' | 'pro'>('pro');
  const [amount, setAmount] = useState('1499');
  const [months, setMonths] = useState('1');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      await apiFetch(`/admin/users/${user.id}/set-plan`, {
        method: 'POST',
        body: JSON.stringify({ plan, amount: Number(amount), months: Number(months) }),
      });
      toast.success(`Plan set to ${plan.toUpperCase()}`);
      onDone();
      onClose();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to set plan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-xs rounded-2xl bg-zinc-900 border border-border shadow-2xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-extrabold">Set Plan</h3>
            <p className="text-xs text-zinc-500 mt-0.5">{user.name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-sm transition">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-500 mb-2 block">Plan</label>
            <div className="grid grid-cols-2 gap-2">
              {(['free', 'pro'] as const).map(p => (
                <button key={p} type="button" onClick={() => setPlan(p)}
                  className={`py-3 rounded-xl text-sm font-bold border transition ${
                    plan === p ? (p === 'pro' ? 'bg-primary/20 border-primary text-primary' : 'bg-zinc-700 border-zinc-600 text-white') : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-zinc-600'
                  }`}>
                  {p === 'pro' ? '✦ Pro' : 'Free'}
                </button>
              ))}
            </div>
          </div>

          {plan === 'pro' && (
            <>
              <div>
                <label className="text-xs font-semibold text-zinc-500 mb-1 block">Amount Paid (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">₹</span>
                  <input
                    type="number" min="0"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-7 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary/60"
                  />
                </div>
                <div className="flex gap-2 mt-1.5">
                  {['899', '1199', '1499', '0'].map(v => (
                    <button key={v} type="button" onClick={() => setAmount(v)}
                      className={`flex-1 py-1 rounded-lg text-[11px] font-semibold border transition ${amount === v ? 'bg-primary/20 border-primary text-primary' : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-zinc-600'}`}>
                      {v === '0' ? 'Free' : `₹${v}`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-500 mb-1 block">Duration</label>
                <div className="flex gap-2">
                  {[['1', '1 month'], ['3', '3 months'], ['12', '1 year']].map(([v, label]) => (
                    <button key={v} type="button" onClick={() => setMonths(v)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition ${months === v ? 'bg-primary/20 border-primary text-primary' : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-zinc-600'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <button
          onClick={submit}
          disabled={saving}
          className="w-full mt-5 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-extrabold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving
            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : `Confirm — Set ${plan.toUpperCase()}${plan === 'pro' ? ` · ₹${amount}` : ''}`
          }
        </button>
      </div>
    </div>
  );
}

// ── User Row ──────────────────────────────────────────────────────────────────
function Row({ user, onRefresh }: { user: User; onRefresh: () => void }) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [showSetPlan, setShowSetPlan] = useState(false);
  const [showSetPassword, setShowSetPassword] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete ${user.name || user.email}?\n\nThis permanently removes the user, their subscription, and all data. This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await apiFetch(`/admin/users/${user.id}`, { method: 'DELETE' });
      toast.success('User deleted');
      onRefresh();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to delete');
      setDeleting(false);
    }
  };

  const handleQuickUpgrade = async () => {
    if (!confirm(`Upgrade ${user.name} to PRO (₹1,499, 30 days)?`)) return;
    setUpgrading(true);
    try {
      await apiFetch(`/admin/users/${user.id}/manual-upgrade`, { method: 'POST' });
      toast.success('Upgraded to PRO');
      onRefresh();
    } catch {
      toast.error('Failed to upgrade');
    } finally {
      setUpgrading(false);
    }
  };

  const isPro = (user.plan || user.subscription?.plan) === 'pro';

  return (
    <>
      {showSetPlan && (
        <SetPlanModal user={user} onClose={() => setShowSetPlan(false)} onDone={onRefresh} />
      )}
      {showSetPassword && (
        <SetPasswordModal user={user} onClose={() => setShowSetPassword(false)} />
      )}
      {showCoupon && (
        <ApplyCouponModal user={user} onClose={() => setShowCoupon(false)} onDone={onRefresh} />
      )}

      <div className="border-b border-border last:border-0">
        {/* Main row */}
        <button
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface/60 transition text-left"
          onClick={() => setOpen(o => !o)}
        >
          <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-sm ${isPro ? 'bg-primary/15 text-primary' : 'bg-zinc-800 text-zinc-400'}`}>
            {(user.name || user.email || '?')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{user.name || '—'}</span>
              {user.business_name && <span className="text-xs text-zinc-500 truncate hidden sm:inline">· {user.business_name}</span>}
            </div>
            <div className="text-xs text-zinc-600 mt-0.5 truncate">
              {user.phone || user.whatsapp_number || user.email}{user.business_city ? ` · ${user.business_city}` : ''}
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold ${isPro ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
              {isPro ? 'PRO' : 'FREE'}
            </span>
            {user.onboarding_completed && <span className="hidden sm:inline px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-green-500/10 text-green-500">✓</span>}
            <svg className={`text-zinc-600 transition-transform ${open ? 'rotate-180' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </div>
        </button>

        {/* Expanded */}
        {open && (
          <div className="px-4 pb-5 bg-zinc-950/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 pt-3 mb-4">

              {/* Contact */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Contact</p>
                <div className="space-y-1.5 text-sm">
                  <Row2 label="Email" value={user.email} />
                  <Row2 label="Phone" value={user.phone || user.whatsapp_number} />
                  <Row2 label="City" value={user.business_city} />
                  <Row2 label="Address" value={user.business_address} small />
                </div>
              </div>

              {/* Business */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Business</p>
                <div className="space-y-1.5 text-sm">
                  <Row2 label="Name" value={user.business_name} />
                  <Row2 label="Category" value={user.business_category} />
                  <Row2 label="Domain" value={user.domain_name || (user.domain_purchased ? 'Purchased' : undefined)} />
                  {user.existing_website_url && (
                    <div className="flex gap-2">
                      <span className="text-zinc-600 w-16 flex-shrink-0 text-xs">Website</span>
                      <a href={user.existing_website_url} target="_blank" rel="noopener noreferrer" className="text-primary text-xs underline truncate">{user.existing_website_url}</a>
                    </div>
                  )}
                </div>
              </div>

              {/* Subscription */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Subscription</p>
                <div className="space-y-1.5 text-sm">
                  <Row2 label="Plan" value={(user.subscription?.plan || user.plan || 'free').toUpperCase()} />
                  <Row2 label="Status" value={user.subscription?.status} />
                  <Row2 label="Expires" value={fmtDate(user.subscription?.end_date)} />
                  <Row2 label="Paid" value={user.subscription?.amount ? `₹${user.subscription.amount}` : undefined} />
                  <Row2 label="Joined" value={fmtDate(user.created_at)} />
                </div>
              </div>

              {/* Services */}
              {user.services?.length > 0 && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Services ({user.services.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {user.services.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-zinc-300">
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

              {/* Media */}
              {(user.logo_url || user.gallery_images?.length > 0) && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Media</p>
                  <div className="flex items-center gap-3">
                    {user.logo_url && <img src={user.logo_url} alt="" className="w-10 h-10 rounded-lg object-cover border border-border" />}
                    {user.gallery_images?.length > 0 && <span className="text-xs text-zinc-500">{user.gallery_images.length} photo{user.gallery_images.length !== 1 ? 's' : ''}</span>}
                  </div>
                </div>
              )}

              {/* Social */}
              {(user.instagram_url || user.facebook_url) && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Social</p>
                  <div className="space-y-1">
                    {user.instagram_url && <a href={user.instagram_url} target="_blank" rel="noopener noreferrer" className="block text-xs text-primary underline truncate">Instagram</a>}
                    {user.facebook_url && <a href={user.facebook_url} target="_blank" rel="noopener noreferrer" className="block text-xs text-primary underline truncate">Facebook</a>}
                  </div>
                </div>
              )}
            </div>

            {/* Action bar */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/40">
              {/* WhatsApp */}
              {(user.phone || user.whatsapp_number) && (
                <a
                  href={`https://wa.me/91${(user.phone || user.whatsapp_number).replace(/\D/g, '').replace(/^91/, '')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold hover:bg-green-500/20 transition"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                  WhatsApp
                </a>
              )}

              {/* Apply Coupon */}
              <button
                onClick={() => setShowCoupon(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold hover:bg-yellow-500/20 transition"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                Coupon
              </button>

              {/* Set Plan */}
              <button
                onClick={() => setShowSetPlan(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary text-xs font-bold hover:bg-primary/20 transition"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Set Plan
              </button>

              {/* Quick upgrade if free */}
              {!isPro && (
                <button
                  onClick={handleQuickUpgrade}
                  disabled={upgrading}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold hover:bg-yellow-500/20 transition disabled:opacity-50"
                >
                  {upgrading ? '…' : '⬆ Quick PRO (₹1,499)'}
                </button>
              )}

              {/* Set Password */}
              <button
                onClick={() => setShowSetPassword(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold hover:bg-zinc-700 hover:text-white transition"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Password
              </button>

              {/* Work tracker */}
              <Link
                href={`/admin/users/${user.id}/work`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold hover:bg-zinc-700 hover:text-white transition"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Work
              </Link>

              {/* Spacer */}
              <span className="flex-1" />

              {/* User ID */}
              <span className="text-[10px] text-zinc-700 font-mono hidden md:inline">{user.id.slice(0, 8)}…</span>

              {/* Delete */}
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/20 transition disabled:opacity-50"
              >
                {deleting
                  ? <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                  : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                }
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Row2({ label, value, small }: { label: string; value?: string | null; small?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex gap-2">
      <span className="text-zinc-600 w-16 flex-shrink-0 text-xs">{label}</span>
      <span className={`text-zinc-300 ${small ? 'text-xs' : 'text-sm'} break-words min-w-0`}>{value}</span>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pro' | 'free' | 'onboarded'>('all');
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

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
      {showCreate && <CreateUserModal onClose={() => setShowCreate(false)} onCreated={fetchUsers} />}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold">Users</h1>
          <p className="text-sm text-zinc-500 mt-1">{users.length} total · {proCount} pro · {onboardedCount} onboarded</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchUsers} className="px-3 py-2 rounded-xl bg-surface border border-border text-sm font-semibold hover:border-zinc-600 transition">
            Refresh
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-extrabold transition flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create User
          </button>
        </div>
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
        {search && <button onClick={() => setSearch('')} className="text-zinc-600 hover:text-zinc-400 text-xs ml-2">✕</button>}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
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

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-600 text-sm">No users found</div>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden">
          {filtered.map(u => (
            <Row key={u.id} user={u} onRefresh={fetchUsers} />
          ))}
        </div>
      )}
    </div>
  );
}
