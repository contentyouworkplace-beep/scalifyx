'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { BellIcon } from '@/components/Icons';
import { LogoIcon } from '@/components/Logo';

export function MobileHeader() {
  const { user } = useAuth();
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-bg/90 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between h-14 px-4">
        <div>
          <div className="text-xs text-zinc-500">Hello</div>
          <div className="text-sm font-bold truncate max-w-[200px]">
            {user?.businessName || user?.name || 'Welcome!'}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/notifications" className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-zinc-400 hover:text-white transition">
            <BellIcon size={18} />
          </Link>
          <Link href="/">
            <LogoIcon size={32} />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function AdminMobileHeader() {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-bg/90 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2">
          <LogoIcon size={28} />
          <span className="text-sm font-bold">ScalifyX</span>
          <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">Admin</span>
        </div>
        <Link href="/admin/notifications" className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-zinc-400 hover:text-white transition">
          <BellIcon size={18} />
        </Link>
      </div>
    </header>
  );
}
