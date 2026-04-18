'use client';

import { useAuth } from '../../../context/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
  UserIcon, GlobeIcon, DiamondIcon, HeadsetIcon, ShieldIcon, LogOutIcon, GiftIcon,
} from '../../../components/Icons';

function EditIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
}
function ReceiptIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2-3-2z"/><path d="M8 10h8M8 14h4"/></svg>;
}
function LanguageIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z"/></svg>;
}
function HelpIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg>;
}
function StarIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
}
function ShareIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>;
}

const MENU_ITEMS = [
  { Icon: EditIcon, label: 'Edit Profile', href: '#', action: 'edit' as const },
  { Icon: GlobeIcon, label: 'My Website', href: '/dashboard/website', action: null },
  { Icon: DiamondIcon, label: 'Subscription', href: '/dashboard/plans', action: null },
  { Icon: ShareIcon, label: 'Share ScalifyX', href: '/dashboard/referral', action: null },
  { Icon: HeadsetIcon, label: 'Support', href: '/dashboard/support', action: null },
  { Icon: ReceiptIcon, label: 'Invoices', href: '#', action: null },
  { Icon: LanguageIcon, label: 'Language', href: '#', action: null },
  { Icon: HelpIcon, label: 'Help Center', href: '#', action: null },
  { Icon: StarIcon, label: 'Rate Us', href: '#', action: null },
  { Icon: ShieldIcon, label: 'Privacy Policy', href: '#', action: null },
];

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    businessName: user?.businessName || '',
  });
  const [saving, setSaving] = useState(false);
  const [referralStats, setReferralStats] = useState({ count: 0, earned: 0 });

  const fetchReferralStats = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { data } = await supabase
        .from('referral_ledger')
        .select('credits_earned')
        .eq('referrer_id', user.id);
      const earned = (data || []).reduce((sum: number, r: { credits_earned?: number }) => sum + (r.credits_earned || 0), 0);
      setReferralStats({ count: data?.length || 0, earned });
    } catch {}
  }, [user?.id]);

  useEffect(() => {
    fetchReferralStats();
  }, [fetchReferralStats]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: form.name,
          phone: form.phone,
          business_name: form.businessName,
        })
        .eq('id', user.id);

      if (error) throw error;
      updateUser({ name: form.name, phone: form.phone, businessName: form.businessName });
      setEditing(false);
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const initials = (user?.name || 'User').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="max-w-lg mx-auto md:max-w-2xl">
      {/* Profile Card - matches mobile app */}
      <div className="rounded-2xl bg-card border border-border p-6 text-center mb-4">
        <div className="w-[72px] h-[72px] mx-auto rounded-2xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center mb-3">
          <span className="text-2xl font-extrabold text-primary">{initials}</span>
        </div>
        <div className="text-lg md:text-xl font-bold">{user?.name || 'ScalifyX User'}</div>
        <div className="text-sm text-zinc-500 mt-0.5">{user?.email || user?.phone || 'No contact info'}</div>
        {user?.businessName && (
          <div className="text-xs text-zinc-500 mt-0.5">{user.businessName}</div>
        )}
        <button
          onClick={() => setEditing(true)}
          className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-lg hover:bg-primary/20 transition"
        >
          <UserIcon size={12} /> Edit Profile
        </button>

        {/* Stats Row */}
        <div className="flex items-center justify-center mt-5 pt-4 border-t border-border">
          <div className="flex-1 text-center">
            <div className="text-base font-bold">{user?.websiteUrl ? '1' : '0'}</div>
            <div className="text-[11px] text-zinc-500">Websites</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex-1 text-center">
            <div className="text-base font-bold capitalize">{user?.plan || 'Free'}</div>
            <div className="text-[11px] text-zinc-500">Plan</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex-1 text-center">
            <div className="text-base font-bold">₹{referralStats.earned}</div>
            <div className="text-[11px] text-zinc-500">Earned</div>
          </div>
        </div>
      </div>

      {/* Edit Form (modal-style) */}
      {editing && (
        <div className="rounded-2xl bg-card border border-border p-5 mb-4 space-y-4">
          <h3 className="text-sm font-bold">Edit Profile</h3>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-white text-sm focus:outline-none focus:border-primary transition"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-white text-sm focus:outline-none focus:border-primary transition"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Business Name</label>
            <input
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-white text-sm focus:outline-none focus:border-primary transition"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold text-sm transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex-1 py-2.5 bg-surface border border-border rounded-xl text-sm hover:bg-card transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Menu Items - matches mobile app */}
      <div className="space-y-1.5 mb-4">
        {MENU_ITEMS.map((item) => (
          item.action === 'edit' ? (
            <button
              key={item.label}
              onClick={() => setEditing(true)}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-surface border border-border hover:border-primary/20 transition"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <item.Icon size={20} />
              </div>
              <span className="text-[15px] font-semibold flex-1 text-left">{item.label}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          ) : (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-surface border border-border hover:border-primary/20 transition"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <item.Icon size={20} />
              </div>
              <span className="text-[15px] font-semibold flex-1">{item.label}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><path d="M9 18l6-6-6-6" /></svg>
            </Link>
          )
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={() => {
          if (confirm('Are you sure you want to logout?')) logout();
        }}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold text-sm hover:bg-red-500/20 transition"
      >
        <LogOutIcon size={18} /> Logout
      </button>

      <div className="text-center text-xs text-zinc-600 mt-4 mb-6">ScalifyX v1.0.0</div>
    </div>
  );
}
