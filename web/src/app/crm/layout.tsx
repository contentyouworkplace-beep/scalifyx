'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const CRM_EMAIL = 'rahulmedhe05@gmail.com';

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const allowed = user?.email === CRM_EMAIL;

  useEffect(() => {
    if (!isLoading) {
      if (!user) router.replace('/login');
      else if (!allowed) router.replace('/dashboard');
    }
  }, [user, isLoading, allowed, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--primary) transparent transparent transparent' }} />
      </div>
    );
  }

  if (!user || !allowed) return null;

  return <>{children}</>;
}
