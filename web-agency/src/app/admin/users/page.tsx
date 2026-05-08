'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../../lib/api';
import toast from 'react-hot-toast';

interface UserItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  plan: 'free' | 'trial' | 'pro';
  business_name?: string;
  created_at: string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

const PLAN_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pro: { label: 'PRO', color: 'text-primary', bg: 'bg-primary/20' },
  trial: { label: 'TRIAL', color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
  free: { label: 'FREE', color: 'text-zinc-400', bg: 'bg-zinc-400/20' },
};

const EMPTY_FORM = { email: '', password: '', name: '', phone: '', plan: 'free' as string, business_name: '' };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Modals
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [resetModal, setResetModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Custom Offer modal
  const [offerModal, setOfferModal] = useState(false);
  const [offerTarget, setOfferTarget] = useState<UserItem | null>(null);
  const [offerForm, setOfferForm] = useState({ name: 'Special Offer', description: '', plan_type: 'pro' as 'pro' | 'trial', price: 499, original_price: 749, trial_days: 0, expires_at: '' });
  const [offerSaving, setOfferSaving] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await apiFetch('/user/admin/all');
      const mapped = (data.users || data || []).map((u: any) => ({
        id: u.id, name: u.name || 'Unknown', phone: u.phone || '', email: u.email || '',
        plan: u.plan || 'free', business_name: u.business_name || '', created_at: u.created_at,
      }));
      setUsers(mapped);
    } catch (e) { console.error('Fetch users error:', e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search) || u.email.toLowerCase().includes(search.toLowerCase());
    if (filter === 'all') return matchesSearch;
    return matchesSearch && u.plan === filter;
  });

  // Create
  const handleCreate = async () => {
    if (!form.email.trim()) return toast.error('Email is required');
    if (!form.password || form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setSaving(true);
    try {
      await apiFetch('/user/admin/create', {
        method: 'POST',
        body: JSON.stringify({
          email: form.email.trim(), password: form.password,
          name: form.name.trim() || undefined, phone: form.phone.trim() || undefined,
          plan: form.plan, business_name: form.business_name.trim() || undefined,
        }),
      });
      toast.success(`User ${form.email.trim()} created`);
      setCreateModal(false); setForm(EMPTY_FORM); fetchUsers();
    } catch (e: any) { toast.error(e.message || 'Failed to create user'); }
    finally { setSaving(false); }
  };

  // Edit
  const openEdit = (user: UserItem) => {
    setSelectedUser(user);
    setForm({ email: user.email, password: '', name: user.name, phone: user.phone, plan: user.plan, business_name: user.business_name || '' });
    setEditModal(true);
  };
  const handleUpdate = async () => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      await apiFetch(`/user/admin/${selectedUser.id}/update`, {
        method: 'PUT',
        body: JSON.stringify({ name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), plan: form.plan, business_name: form.business_name.trim() }),
      });
      toast.success('User updated'); setEditModal(false); fetchUsers();
    } catch (e: any) { toast.error(e.message || 'Failed to update'); }
    finally { setSaving(false); }
  };

  // Reset Password
  const openResetPassword = (user: UserItem) => {
    setSelectedUser(user); setNewPassword(''); setShowPassword(false); setResetModal(true);
  };
  const handleResetPassword = async () => {
    if (!selectedUser) return;
    if (!newPassword || newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setSaving(true);
    try {
      await apiFetch(`/user/admin/${selectedUser.id}/reset-password`, { method: 'POST', body: JSON.stringify({ password: newPassword }) });
      toast.success(`Password reset for ${selectedUser.name || selectedUser.email}`);
      setResetModal(false);
    } catch (e: any) { toast.error(e.message || 'Failed to reset password'); }
    finally { setSaving(false); }
  };

  // Delete
  const openDeleteConfirm = (user: UserItem) => {
    setDeleteTarget(user);
    setDeleteModal(true);
  };
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiFetch(`/user/admin/${deleteTarget.id}`, { method: 'DELETE' });
      toast.success('User deleted'); setDeleteModal(false); setDeleteTarget(null); fetchUsers();
    } catch (e: any) { toast.error(e.message || 'Failed to delete'); }
    finally { setDeleting(false); }
  };

  // Custom Offer
  const openOfferModal = (user: UserItem) => {
    setOfferTarget(user);
    setOfferForm({ name: 'Special Offer', description: '', plan_type: 'pro', price: 499, original_price: 749, trial_days: 0, expires_at: '' });
    setOfferModal(true);
  };
  const handleSendOffer = async () => {
    if (!offerTarget) return;
    if (!offerForm.name.trim()) return toast.error('Offer name required');
    setOfferSaving(true);
    try {
      await apiFetch('/admin/user-offers', {
        method: 'POST',
        body: JSON.stringify({
          user_id: offerTarget.id,
          name: offerForm.name.trim(),
          description: offerForm.description.trim(),
          plan_type: offerForm.plan_type,
          price: Number(offerForm.price),
          original_price: Number(offerForm.original_price),
          trial_days: Number(offerForm.trial_days),
          features: [],
          expires_at: offerForm.expires_at || null,
        }),
      });
      toast.success(`🎁 Offer sent to ${offerTarget.name || offerTarget.email}`);
      setOfferModal(false);
    } catch (e: any) { toast.error(e.message || 'Failed to send offer'); }
    finally { setOfferSaving(false); }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const planSelector = (current: string, onSelect: (p: string) => void) => (
    <div className="flex gap-2">
      {[{ key: 'free', label: 'Free' }, { key: 'trial', label: 'Trial' }, { key: 'pro', label: 'Pro' }].map((p) => (
        <button key={p.key} onClick={() => onSelect(p.key)}
          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${current === p.key ? 'bg-primary/20 border-primary text-primary' : 'bg-surface border-border text-zinc-400'}`}
        >{p.label}</button>
      ))}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold">Users ({users.length})</h1>
        <button onClick={() => { setForm(EMPTY_FORM); setShowPassword(false); setCreateModal(true); }}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-sm font-semibold">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
          Add User
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center bg-surface border border-border rounded-xl px-3 mb-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-500"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input className="flex-1 bg-transparent py-3 ml-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none" placeholder="Search by name, email, phone..." value={search} onChange={(e) => setSearch(e.target.value)} />
        {search && <button onClick={() => setSearch('')} className="text-zinc-500">✕</button>}
      </div>

      {/* Filter Chips */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {[
          { key: 'all', label: `All (${users.length})` },
          { key: 'free', label: `Free (${users.filter(u => u.plan === 'free').length})` },
          { key: 'trial', label: `Trial (${users.filter(u => u.plan === 'trial').length})` },
          { key: 'pro', label: `Pro (${users.filter(u => u.plan === 'pro').length})` },
        ].map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${filter === f.key ? 'bg-primary/20 border-primary text-primary' : 'bg-surface border-border text-zinc-500'}`}
          >{f.label}</button>
        ))}
      </div>

      {/* User Cards */}
      <div className="space-y-2.5">
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <svg className="mx-auto mb-3 text-zinc-600" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            <p className="text-zinc-500 text-sm">No users found</p>
          </div>
        )}
        {filtered.map((user) => {
          const plan = PLAN_CONFIG[user.plan] || PLAN_CONFIG.free;
          return (
            <div key={user.id} className="rounded-2xl bg-surface border border-border p-3.5">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-sm font-bold text-primary">{user.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold truncate">{user.name}</p>
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  </div>
                  <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                  {user.phone && <p className="text-xs text-zinc-500">{user.phone}</p>}
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${plan.bg} ${plan.color}`}>{plan.label}</span>
                    <span className="text-[11px] text-zinc-600">{timeAgo(user.created_at)}</span>
                  </div>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <button onClick={() => openEdit(user)} className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition" title="Edit">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button onClick={() => openResetPassword(user)} className="p-2 rounded-lg bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 transition" title="Reset Password">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                </button>
                <button onClick={() => openDeleteConfirm(user)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition" title="Delete">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
                <button onClick={() => openOfferModal(user)} className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition" title="Send Custom Offer">
                  🎁
                </button>
                <button onClick={() => window.location.href = `/admin/chats?userId=${user.id}&userName=${user.name}`} className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition ml-auto" title="Chat">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create User Modal */}
      {createModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center" onClick={() => setCreateModal(false)}>
          <div className="bg-bg rounded-t-3xl md:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Add New User</h2>
              <button onClick={() => setCreateModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-3">
              <div><label className="text-xs font-semibold text-zinc-500 mb-1 block">Email *</label>
                <input className="w-full px-3.5 py-3 bg-surface border border-border rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary" placeholder="user@example.com" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} /></div>
              <div><label className="text-xs font-semibold text-zinc-500 mb-1 block">Password *</label>
                <div className="flex gap-2">
                  <input className="flex-1 px-3.5 py-3 bg-surface border border-border rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary" type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} />
                  <button onClick={() => setShowPassword(!showPassword)} className="px-3 bg-surface border border-border rounded-xl text-zinc-400">{showPassword ? '🙈' : '👁'}</button>
                </div></div>
              <div><label className="text-xs font-semibold text-zinc-500 mb-1 block">Name</label>
                <input className="w-full px-3.5 py-3 bg-surface border border-border rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary" placeholder="Full name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} /></div>
              <div><label className="text-xs font-semibold text-zinc-500 mb-1 block">Phone</label>
                <input className="w-full px-3.5 py-3 bg-surface border border-border rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} /></div>
              <div><label className="text-xs font-semibold text-zinc-500 mb-1 block">Plan</label>
                {planSelector(form.plan, (p) => setForm({...form, plan: p}))}</div>
              <div><label className="text-xs font-semibold text-zinc-500 mb-1 block">Business Name</label>
                <input className="w-full px-3.5 py-3 bg-surface border border-border rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary" placeholder="Business name (optional)" value={form.business_name} onChange={(e) => setForm({...form, business_name: e.target.value})} /></div>
            </div>
            <button onClick={handleCreate} disabled={saving} className="w-full mt-5 py-3.5 bg-primary text-white rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                Create User
              </>}
            </button>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center" onClick={() => setEditModal(false)}>
          <div className="bg-bg rounded-t-3xl md:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Edit User</h2>
              <button onClick={() => setEditModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-3">
              <div><label className="text-xs font-semibold text-zinc-500 mb-1 block">Name</label>
                <input className="w-full px-3.5 py-3 bg-surface border border-border rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} /></div>
              <div><label className="text-xs font-semibold text-zinc-500 mb-1 block">Email</label>
                <input className="w-full px-3.5 py-3 bg-surface border border-border rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} /></div>
              <div><label className="text-xs font-semibold text-zinc-500 mb-1 block">Phone</label>
                <input className="w-full px-3.5 py-3 bg-surface border border-border rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} /></div>
              <div><label className="text-xs font-semibold text-zinc-500 mb-1 block">Plan</label>
                {planSelector(form.plan, (p) => setForm({...form, plan: p}))}</div>
              <div><label className="text-xs font-semibold text-zinc-500 mb-1 block">Business Name</label>
                <input className="w-full px-3.5 py-3 bg-surface border border-border rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary" value={form.business_name} onChange={(e) => setForm({...form, business_name: e.target.value})} /></div>
            </div>
            <button onClick={handleUpdate} disabled={saving} className="w-full mt-5 py-3.5 bg-primary text-white rounded-xl font-bold text-sm disabled:opacity-50">
              {saving ? 'Saving...' : 'Update User'}
            </button>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center" onClick={() => setResetModal(false)}>
          <div className="bg-bg rounded-t-3xl md:rounded-2xl w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Reset Password</h2>
              <button onClick={() => setResetModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>
            <p className="text-sm text-zinc-500 mb-3">Reset password for {selectedUser?.name || selectedUser?.email}</p>
            <div className="flex gap-2">
              <input className="flex-1 px-3.5 py-3 bg-surface border border-border rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary" type={showPassword ? 'text' : 'password'} placeholder="New password (min 6 chars)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <button onClick={() => setShowPassword(!showPassword)} className="px-3 bg-surface border border-border rounded-xl text-zinc-400">{showPassword ? '🙈' : '👁'}</button>
            </div>
            <button onClick={handleResetPassword} disabled={saving} className="w-full mt-4 py-3.5 bg-primary text-white rounded-xl font-bold text-sm disabled:opacity-50">
              {saving ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && deleteTarget && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center" onClick={() => { if (!deleting) { setDeleteModal(false); setDeleteTarget(null); } }}>
          <div className="bg-bg rounded-t-3xl md:rounded-2xl w-full max-w-sm p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-400">
                  <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold mb-1">Delete User?</h2>
              <p className="text-sm text-zinc-400 mb-1">
                Are you sure you want to delete <span className="text-white font-semibold">{deleteTarget.name || deleteTarget.email}</span>?
              </p>
              <p className="text-xs text-red-400/80 mb-5">
                This will permanently remove their account, websites, and all data. This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => { setDeleteModal(false); setDeleteTarget(null); }}
                  disabled={deleting}
                  className="flex-1 py-3 bg-surface border border-border text-zinc-300 rounded-xl font-semibold text-sm hover:bg-surface/80 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold text-sm hover:bg-red-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🎁 Send Custom Offer Modal */}
      {offerModal && offerTarget && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center" onClick={() => setOfferModal(false)}>
          <div className="bg-bg rounded-t-3xl md:rounded-2xl w-full max-w-md max-h-[92vh] overflow-y-auto p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-bold">🎁 Send Custom Offer</h2>
              <button onClick={() => setOfferModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>
            <p className="text-xs text-zinc-500 mb-4">
              Sending to <span className="text-white font-semibold">{offerTarget.name || offerTarget.email}</span>
              {offerTarget.plan !== 'free' && <span className="ml-1 text-primary">({offerTarget.plan})</span>}
            </p>

            <div className="space-y-3">
              {/* Offer Name */}
              <div>
                <label className="text-xs font-semibold text-zinc-500 mb-1 block">Offer Name *</label>
                <input
                  className="w-full px-3.5 py-3 bg-surface border border-border rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary"
                  placeholder="e.g. Special Diwali Offer"
                  value={offerForm.name}
                  onChange={(e) => setOfferForm({ ...offerForm, name: e.target.value })}
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-zinc-500 mb-1 block">Description</label>
                <input
                  className="w-full px-3.5 py-3 bg-surface border border-border rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary"
                  placeholder="e.g. Exclusive 1-month deal just for you"
                  value={offerForm.description}
                  onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                />
              </div>

              {/* Plan Type */}
              <div>
                <label className="text-xs font-semibold text-zinc-500 mb-1 block">Plan Type</label>
                <div className="flex gap-2">
                  {(['pro', 'trial'] as const).map((p) => (
                    <button key={p} onClick={() => setOfferForm({ ...offerForm, plan_type: p })}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${offerForm.plan_type === p ? 'bg-primary/20 border-primary text-primary' : 'bg-surface border-border text-zinc-400'}`}>
                      {p === 'pro' ? '⭐ Pro' : '🆓 Trial'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price row */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-zinc-500 mb-1 block">Offer Price (₹)</label>
                  <input type="number" min="0"
                    className="w-full px-3.5 py-3 bg-surface border border-border rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary"
                    value={offerForm.price}
                    onChange={(e) => setOfferForm({ ...offerForm, price: Number(e.target.value) })}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-zinc-500 mb-1 block">Original Price (₹)</label>
                  <input type="number" min="0"
                    className="w-full px-3.5 py-3 bg-surface border border-border rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary"
                    value={offerForm.original_price}
                    onChange={(e) => setOfferForm({ ...offerForm, original_price: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Trial days (if trial plan) */}
              {offerForm.plan_type === 'trial' && (
                <div>
                  <label className="text-xs font-semibold text-zinc-500 mb-1 block">Trial Days</label>
                  <input type="number" min="0"
                    className="w-full px-3.5 py-3 bg-surface border border-border rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary"
                    value={offerForm.trial_days}
                    onChange={(e) => setOfferForm({ ...offerForm, trial_days: Number(e.target.value) })}
                  />
                </div>
              )}

              {/* Expiry */}
              <div>
                <label className="text-xs font-semibold text-zinc-500 mb-1 block">Offer Expires At (optional)</label>
                <input type="datetime-local"
                  className="w-full px-3.5 py-3 bg-surface border border-border rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary"
                  value={offerForm.expires_at}
                  onChange={(e) => setOfferForm({ ...offerForm, expires_at: e.target.value })}
                />
              </div>

              {/* Preview */}
              <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-3">
                <p className="text-xs text-zinc-500 mb-1">Preview for user</p>
                <p className="text-sm font-bold text-white">{offerForm.name || 'Offer Name'}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-green-400 font-extrabold text-lg">₹{offerForm.price}</span>
                  {offerForm.original_price > offerForm.price && (
                    <span className="text-zinc-500 line-through text-sm">₹{offerForm.original_price}</span>
                  )}
                  {offerForm.original_price > offerForm.price && (
                    <span className="text-green-400 text-xs font-bold bg-green-500/10 px-1.5 py-0.5 rounded-full">
                      {Math.round((1 - offerForm.price / offerForm.original_price) * 100)}% OFF
                    </span>
                  )}
                </div>
                {offerForm.description && <p className="text-xs text-zinc-500 mt-1">{offerForm.description}</p>}
              </div>
            </div>

            <button
              onClick={handleSendOffer}
              disabled={offerSaving}
              className="w-full mt-5 py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2 transition"
            >
              {offerSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : '🎁 Send Offer to User'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
