'use client';

import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import Link from 'next/link';
import {
  ChatBotIcon, GlobeIcon, DiamondIcon, ZapIcon, SearchIcon,
  SparklesIcon, ShieldIcon, HeadsetIcon, PhoneIcon, LinkIcon, ChartIcon,
} from '../../components/Icons';
import { RocketIcon } from '../../components/Icons';
import { PushNotificationBanner } from '../../components/PushNotificationBanner';
import React from 'react';

function ShareIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
    </svg>
  );
}

function EyeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

export default function DashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ visitors: 0, leads: 0, uptime: 99.9 });

  useEffect(() => {
    if (user?.id) {
      apiFetch(`/user/${user.id}/analytics`)
        .then((d) => setStats({ visitors: d.visitors || 0, leads: d.leads || 0, uptime: d.uptime || 99.9 }))
        .catch(() => {});
    }
  }, [user]);

  return (
    <div>
      {/* Greeting - hidden on mobile (shown in MobileHeader) */}
      <div className="hidden md:block mb-8">
        <h1 className="text-2xl font-bold">
          Hey, <span className="gradient-text">{user?.name || 'there'}</span>
        </h1>
        <p className="text-zinc-500 mt-1">Welcome to your project dashboard</p>
      </div>

      {/* Push notification permission request */}
      <PushNotificationBanner />

      {/* Hero CTA Card */}
      <Link href="/dashboard/projects" className="block rounded-2xl bg-primary p-5 md:p-6 mb-4 md:mb-6 hover:brightness-110 transition">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white leading-snug">
              Project<br />Dashboard
            </h2>
            <p className="text-white/70 text-xs md:text-sm mt-1.5 mb-3">
              Track your projects, view deliverables, and connect with our team
            </p>
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-black/20 text-white text-xs font-semibold rounded-full">
              View Projects <RocketIcon size={12} />
            </span>
          </div>
          <GlobeIcon size={48} className="text-white/30 hidden sm:block" />
        </div>
      </Link>

      {/* Active Projects Card */}
      <div className="rounded-2xl bg-card border border-border p-4 md:p-5 mb-4 md:mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-xs text-green-400 font-semibold">Active</span>
          <span className="text-xs text-zinc-400 font-medium">Your Projects</span>
        </div>
        <div className="grid grid-cols-3 gap-3 border-t border-border pt-3">
          {[
            { val: '3', label: 'Active Projects' },
            { val: '12', label: 'Deliverables' },
            { val: '8', label: 'Messages' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-base md:text-lg font-bold">{s.val}</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-sm md:text-base font-bold mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { href: '/dashboard/inquiries', Icon: ChatBotIcon, label: 'New Inquiry', desc: 'Submit a project', action: null },
          { href: '/dashboard/projects', Icon: GlobeIcon, label: 'Projects', desc: 'View all projects', action: null },
          { href: '/dashboard/deliverables', Icon: DiamondIcon, label: 'Deliverables', desc: 'Download files', action: null },
          { href: '/dashboard/messages', Icon: ShareIcon, label: 'Messages', desc: 'Team chat', action: null },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:bg-primary/20 transition">
              <a.Icon size={20} />
            </div>
            <div className="text-sm font-semibold group-hover:text-primary transition">{a.label}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">{a.desc}</div>
          </Link>
        ))}
      </div>

      {/* Why Choose Us */}
      <h2 className="text-sm md:text-base font-bold mb-3">Why Choose Scalify Agency?</h2>
      <div className="space-y-2 mb-6">
        {[
          { Icon: ZapIcon, title: 'Quick Turnaround', desc: 'Fast delivery without compromising quality' },
          { Icon: SearchIcon, title: 'SEO Optimized', desc: 'Build to rank higher on Google' },
          { Icon: SparklesIcon, title: 'Custom Design', desc: 'Tailored design matching your brand identity' },
          { Icon: EyeIcon, title: 'Expert Team', desc: 'Experienced designers and developers' },
          { Icon: ChartIcon, title: 'Performance Reports', desc: 'Track your projects progress & deliverables' },
          { Icon: LinkIcon, title: 'Ongoing Support', desc: 'Post-launch support and maintenance' },
          { Icon: HeadsetIcon, title: 'Direct Communication', desc: 'Connect with your dedicated project team' },
          { Icon: PhoneIcon, title: 'Mobile First', desc: 'Responsive design for all devices' },
          { Icon: ShieldIcon, title: 'Secure & Hosted', desc: 'Free SSL, hosting, and security included' },
        ].map((f) => (
          <div key={f.title} className="flex items-center gap-3 p-3 md:p-3.5 rounded-2xl bg-card border border-border">
            <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <f.Icon size={18} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold">{f.title}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
