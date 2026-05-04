'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/Logo';
import {
  HomeIcon, ChatBotIcon, GlobeIcon, PaletteIcon, DiamondIcon,
  GiftIcon, BellIcon, UserIcon, MessageIcon, ChartIcon, UsersIcon,
  TagIcon, CreditCardIcon, ClipboardIcon, SettingsIcon, LogOutIcon, ArrowLeftIcon,
} from '@/components/Icons';
import React from 'react';

const userLinks = [
  { href: '/dashboard', label: 'Home', icon: HomeIcon },
  { href: '/dashboard/chat', label: 'AI Chat', icon: ChatBotIcon },
  { href: '/dashboard/website', label: 'My Website', icon: GlobeIcon },
  { href: '/dashboard/templates', label: 'Templates', icon: PaletteIcon },
  { href: '/dashboard/plans', label: 'Plans', icon: DiamondIcon },
  { href: '/dashboard/referral', label: 'Share', icon: GiftIcon },
  { href: '/dashboard/notifications', label: 'Notifications', icon: BellIcon },
  { href: '/dashboard/profile', label: 'Profile', icon: UserIcon },
  { href: '/dashboard/support', label: 'Support', icon: MessageIcon },
];

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: ChartIcon },
  { href: '/admin/users', label: 'Users', icon: UsersIcon },
  { href: '/admin/chats', label: 'Chats', icon: MessageIcon },
  { href: '/admin/offers', label: 'Offers', icon: TagIcon },
  { href: '/admin/payments', label: 'Payments', icon: CreditCardIcon },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: ClipboardIcon },
  { href: '/admin/notifications', label: 'Notifications', icon: BellIcon },
];

export function Sidebar({ variant }: { variant: 'user' | 'admin' }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const links = variant === 'admin' ? adminLinks : userLinks;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface border-r border-border flex flex-col z-40">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/"><Logo size={32} /></Link>
        {variant === 'admin' && (
          <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full">Admin</span>
        )}
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-border">
        <div className="text-sm font-medium truncate">{user?.name || 'User'}</div>
        <div className="text-xs text-zinc-500 truncate">{user?.email}</div>
        {variant === 'user' && user?.plan && (
          <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full font-medium ${
            user.plan === 'pro' ? 'bg-primary/10 text-primary' : 'bg-zinc-700 text-zinc-300'
          }`}>
            {user.plan.toUpperCase()}
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/dashboard' && link.href !== '/admin' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm transition ${
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-zinc-400 hover:text-white hover:bg-card'
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Switch & Logout */}
      <div className="p-4 border-t border-border space-y-2">
        {variant === 'admin' ? (
          <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-card transition">
            <ArrowLeftIcon size={16} /> User Panel
          </Link>
        ) : user?.role === 'admin' ? (
          <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-card transition">
            <SettingsIcon size={16} /> Admin Panel
          </Link>
        ) : null}
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition"
        >
          <LogOutIcon size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}
