'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, ChatBotIcon, DiamondIcon, UserIcon, ChartIcon, UsersIcon, MessageIcon, TagIcon, CreditCardIcon } from '@/components/Icons';
import React from 'react';

const userTabs = [
  { href: '/dashboard', label: 'Home', Icon: HomeIcon },
  { href: '/dashboard/chat', label: 'AI Chat', Icon: ChatBotIcon },
  { href: '/dashboard/plans', label: 'Plans', Icon: DiamondIcon },
  { href: '/dashboard/profile', label: 'Profile', Icon: UserIcon },
];

const adminTabs = [
  { href: '/admin', label: 'Dashboard', Icon: ChartIcon },
  { href: '/admin/users', label: 'Users', Icon: UsersIcon },
  { href: '/admin/chats', label: 'Chats', Icon: MessageIcon },
  { href: '/admin/offers', label: 'Offers', Icon: TagIcon },
  { href: '/admin/payments', label: 'Payments', Icon: CreditCardIcon },
];

export function BottomTabs({ variant }: { variant: 'user' | 'admin' }) {
  const pathname = usePathname();
  const tabs = variant === 'admin' ? adminTabs : userTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-surface border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive =
            tab.href === '/dashboard' || tab.href === '/admin'
              ? pathname === tab.href
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-colors ${
                isActive ? 'text-primary' : 'text-zinc-500'
              }`}
            >
              <tab.Icon size={22} />
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
