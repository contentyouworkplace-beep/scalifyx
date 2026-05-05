'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { BottomTabs } from '../../components/BottomTabs';
import { AdminMobileHeader } from '../../components/MobileHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace('/login');
      } else if (!isAdmin) {
        router.replace('/dashboard');
      }
    }
  }, [user, isLoading, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-bg">
      <div className="hidden md:block">
        <Sidebar variant="admin" />
      </div>
      <AdminMobileHeader />
      <BottomTabs variant="admin" />
      <main className="md:ml-64 min-h-screen pt-14 md:pt-0 pb-20 md:pb-0">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
