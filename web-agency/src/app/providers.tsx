'use client';

import { useEffect } from 'react';
import { AuthProvider } from '../context/AuthContext';

function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ServiceWorkerRegistrar />
      {children}
    </AuthProvider>
  );
}
