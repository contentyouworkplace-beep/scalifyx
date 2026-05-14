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
      {/* Sticky WhatsApp support FAB */}
      <a
        href="https://wa.me/916353583148?text=Hi%2C%20I%20need%20help%20with%20my%20Scalify%20account"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 md:bottom-6 left-4 md:left-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white px-4 py-3 rounded-full shadow-lg shadow-green-500/30 transition-all hover:scale-105 active:scale-95"
        title="Chat with support on WhatsApp"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378L2 18l1.382-4.882A9.86 9.86 0 012.086 8.978C2.086 3.95 6.036 0 11.064 0c2.427 0 4.706.945 6.42 2.66a9.01 9.01 0 012.651 6.403c-.002 5.029-3.952 9.319-8.084 9.319z"/>
        </svg>
        <span className="text-sm font-semibold hidden md:inline">Support</span>
      </a>
    </div>
  );
}
