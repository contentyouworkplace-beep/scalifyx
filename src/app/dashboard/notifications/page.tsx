'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';
import type { Notification } from '@shared/types';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('notifications')
      .select('*')
      .eq('status', 'sent')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        // Filter to notifications relevant to this user
        const filtered = (data || []).filter((n: Notification) => {
          if (n.target === 'all') return true;
          if (n.target === 'pro' && user?.plan === 'pro') return true;
          if (n.target === 'free' && user?.plan !== 'pro') return true;
          if (n.target === 'specific' && n.target_user_ids?.includes(user?.id || '')) return true;
          return false;
        });
        setNotifications(filtered);
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-bold">Notifications</h1>
        <p className="text-sm text-zinc-500 mt-1">Stay updated with the latest news</p>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg></div>
          <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
          <p className="text-sm text-zinc-500">You&apos;ll see updates here when there are new notifications.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className="p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-sm">{n.title}</h3>
                  <p className="text-sm text-zinc-400 mt-1">{n.body}</p>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  n.type === 'promo' ? 'bg-purple-500/10 text-purple-400' :
                  n.type === 'alert' ? 'bg-red-500/10 text-red-400' :
                  n.type === 'update' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-zinc-700 text-zinc-400'
                }`}>
                  {n.type}
                </span>
              </div>
              <div className="text-xs text-zinc-600 mt-2">
                {new Date(n.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
