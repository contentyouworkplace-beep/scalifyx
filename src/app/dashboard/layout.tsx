'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { BottomTabs } from '../../components/BottomTabs';
import { MobileHeader } from '../../components/MobileHeader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-bg">
      {/* Desktop: sidebar */}
      <div className="hidden md:block">
        <Sidebar variant="user" />
      </div>
      {/* Mobile: top header + bottom tabs */}
      <MobileHeader />
      <BottomTabs variant="user" />
      {/* Main content */}
      <main className="md:ml-64 min-h-screen pt-14 md:pt-0 pb-20 md:pb-0">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
