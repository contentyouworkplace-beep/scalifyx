'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../../lib/api';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  title: string;
  body: string;
  target: 'all' | 'pro' | 'free';
  sentAt: string;
  status: 'sent' | 'draft' | 'scheduled';
  recipients: number;
}

const TARGET_OPTIONS = [
  { value: 'all', label: 'All Users', icon: '👥' },
  { value: 'pro', label: 'Pro Users', icon: '⭐' },
  { value: 'free', label: 'Free Users', icon: '👤' },
] as const;

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tab, setTab] = useState<'history' | 'compose'>('history');
  const [filter, setFilter] = useState<'all' | 'sent' | 'scheduled' | 'draft'>('all');
  const [loading, setLoading] = useState(true);

  // Compose state
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [target, setTarget] = useState<'all' | 'pro' | 'free'>('all');
  const [sending, setSending] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await apiFetch('/admin/notifications');
      const mapped = (data.notifications || []).map((n: any) => ({
        id: n.id, title: n.title, body: n.body, target: n.target || 'all',
        sentAt: n.sent_at || '', status: n.status || 'sent', recipients: n.recipients_count || 0,
      }));
      setNotifications(mapped);
    } catch (e) { console.error('Fetch notifications error:', e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const filtered = notifications.filter((n) => filter === 'all' || n.status === filter);

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) return toast.error('Please fill in both title and message body.');
    if (!confirm(`Send "${title}" to ${target === 'all' ? 'all users' : target + ' users'}?`)) return;
    setSending(true);
    try {
      await apiFetch('/admin/notifications', { method: 'POST', body: JSON.stringify({ title, body, target, status: 'sent' }) });
      toast.success('Notification sent!');
      setTitle(''); setBody(''); setTab('history'); fetchNotifications();
    } catch { toast.error('Failed to send notification.'); }
    finally { setSending(false); }
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) return toast.error('Title is required');
    try {
      await apiFetch('/admin/notifications', { method: 'POST', body: JSON.stringify({ title, body, target, status: 'draft' }) });
      toast.success('Saved as draft'); setTitle(''); setBody(''); fetchNotifications();
    } catch { toast.error('Failed to save draft.'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this notification?')) return;
    try {
      await apiFetch(`/admin/notifications/${id}`, { method: 'DELETE' });
      toast.success('Deleted'); fetchNotifications();
    } catch { toast.error('Failed to delete.'); }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Notifications</h1>

      {/* Tab Switcher */}
      <div className="flex gap-1 bg-surface rounded-xl p-1 mb-4">
        <button onClick={() => setTab('history')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition ${tab === 'history' ? 'bg-primary text-white' : 'text-zinc-500'}`}>
          📋 History
        </button>
        <button onClick={() => setTab('compose')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition ${tab === 'compose' ? 'bg-primary text-white' : 'text-zinc-500'}`}>
          ✏️ Compose
        </button>
      </div>

      {tab === 'history' ? (
        <>
          {/* Filters */}
          <div className="flex gap-1.5 mb-4 flex-wrap">
            {(['all', 'sent', 'scheduled', 'draft'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition ${filter === f ? 'bg-primary/20 border-primary text-primary' : 'bg-surface border-border text-zinc-500'}`}
              >{f.charAt(0).toUpperCase() + f.slice(1)}</button>
            ))}
          </div>

          {/* Notification Cards */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <svg className="mx-auto mb-3 text-zinc-600" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              <p className="text-sm text-zinc-500">No notifications found</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filtered.map((n) => {
                const statusConfig: Record<string, { color: string; bg: string }> = {
                  sent: { color: 'text-green-400', bg: 'bg-green-400/20' },
                  scheduled: { color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
                  draft: { color: 'text-zinc-400', bg: 'bg-zinc-400/20' },
                };
                const config = statusConfig[n.status];
                const targetConfig: Record<string, { color: string; bg: string }> = {
                  pro: { color: 'text-primary', bg: 'bg-primary/20' },
                  free: { color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
                  all: { color: 'text-zinc-400', bg: 'bg-zinc-400/20' },
                };
                const tConfig = targetConfig[n.target];

                return (
                  <div key={n.id} className="rounded-[14px] bg-surface border border-border p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <span className="text-xs">{n.status === 'sent' ? '✓' : n.status === 'scheduled' ? '⏱' : '📝'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{n.title}</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          {n.status === 'sent' ? `Sent ${n.sentAt ? new Date(n.sentAt).toLocaleString('en-IN') : ''}` : n.status === 'scheduled' ? `Scheduled: ${n.sentAt ? new Date(n.sentAt).toLocaleString('en-IN') : ''}` : 'Draft'}
                          {n.recipients > 0 ? ` · ${n.recipients.toLocaleString()} recipients` : ''}
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${tConfig.bg} ${tConfig.color}`}>
                        {n.target.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-2 line-clamp-2">{n.body}</p>

                    {(n.status === 'draft' || n.status === 'scheduled') && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-xs font-medium text-primary">
                          ✏️ Edit
                        </button>
                        <button onClick={() => handleDelete(n.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-medium text-red-400">
                          {n.status === 'scheduled' ? '✕ Cancel' : '🗑 Delete'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* Compose Tab */
        <div className="rounded-2xl bg-surface border border-border p-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">Notification Title</label>
            <input className="w-full px-3.5 py-3 bg-bg border border-border rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary" placeholder="e.g. 🎉 New Feature Available!" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">Message Body</label>
            <textarea className="w-full px-3.5 py-3 bg-bg border border-border rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary min-h-[100px]" placeholder="Write your notification message..." value={body} onChange={(e) => setBody(e.target.value)} maxLength={500} />
            <p className="text-[11px] text-zinc-600 text-right mt-1">{body.length}/500</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">Target Audience</label>
            <div className="flex gap-2">
              {TARGET_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => setTarget(opt.value)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium border transition ${target === opt.value ? 'bg-primary/20 border-primary text-primary' : 'bg-bg border-border text-zinc-500'}`}>
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {title.trim() && (
            <div className="rounded-xl bg-bg border border-border p-3">
              <p className="text-[11px] text-zinc-500 mb-1.5">Preview</p>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{body || 'Message body...'}</p>
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={handleSend} disabled={sending} className="flex-1 py-3.5 bg-primary text-white rounded-xl font-bold text-sm disabled:opacity-50">
              {sending ? 'Sending...' : '🚀 Send Now'}
            </button>
            <button onClick={handleSaveDraft} className="px-4 py-3.5 bg-surface border border-border text-zinc-400 rounded-xl font-medium text-sm">
              Save Draft
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
