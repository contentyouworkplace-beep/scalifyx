'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function PushNotificationBanner() {
  const [status, setStatus] = useState<'unknown' | 'granted' | 'denied' | 'unsupported'>('unknown');
  const [dismissed, setDismissed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('unsupported');
      return;
    }
    if (localStorage.getItem('push_dismissed')) { setDismissed(true); return; }
    setStatus(Notification.permission as 'granted' | 'denied' | 'unknown');
  }, []);

  const handleEnable = async () => {
    if (!VAPID_PUBLIC_KEY) return;
    setSubscribing(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') { setStatus('denied'); return; }

      const reg = await navigator.serviceWorker.register('/service-worker.js');
      await navigator.serviceWorker.ready;

      const existing = await reg.pushManager.getSubscription();
      if (existing) await existing.unsubscribe();

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      await apiFetch('/notifications/subscribe-web', {
        method: 'POST',
        body: JSON.stringify({ subscription: sub.toJSON() }),
      });

      setStatus('granted');
    } catch (err) {
      console.error('Push subscription error:', err);
    } finally {
      setSubscribing(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('push_dismissed', '1');
    setDismissed(true);
  };

  if (dismissed || status === 'granted' || status === 'denied' || status === 'unsupported' || !VAPID_PUBLIC_KEY) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-4 py-3 mb-4">
      <div className="flex items-center gap-3">
        <span className="text-xl">🔔</span>
        <div>
          <p className="text-sm font-bold text-white">Enable Notifications</p>
          <p className="text-xs text-zinc-400">Get alerts for new messages, updates &amp; offers</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleDismiss}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition px-2 py-1"
        >
          Later
        </button>
        <button
          onClick={handleEnable}
          disabled={subscribing}
          className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
        >
          {subscribing ? '...' : 'Enable'}
        </button>
      </div>
    </div>
  );
}
