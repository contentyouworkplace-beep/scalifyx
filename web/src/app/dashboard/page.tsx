'use client';

import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import Link from 'next/link';
import {
  ChatBotIcon, GlobeIcon, DiamondIcon, ZapIcon, SearchIcon,
  SparklesIcon, ShieldIcon, HeadsetIcon, PhoneIcon, LinkIcon, ChartIcon,
} from '../../components/Icons';

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-1.563.946-2.846 2.435-3.297 4.12-.45 1.684-.196 3.52.536 5.035.73 1.514 2.082 2.684 3.708 3.333 1.627.648 3.415.81 5.028.472 1.614-.337 3.053-1.198 4.014-2.458.96-1.26 1.498-2.836 1.498-4.467 0-2.549-1.039-4.947-2.886-6.739-1.848-1.792-4.353-2.799-6.966-2.799z"/>
    </svg>
  );
}
import { RocketIcon } from '../../components/Icons';
import { PushNotificationBanner } from '../../components/PushNotificationBanner';
import { TrialBanner } from '../../components/TrialBanner';
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
        <p className="text-zinc-500 mt-1">Welcome to your Scalify dashboard</p>
      </div>

      {/* Trial countdown banner */}
      <TrialBanner />

      {/* Push notification permission request */}
      <PushNotificationBanner />

      {/* Hero CTA Card - matches mobile app */}
      <Link href="/dashboard/plans" className="block rounded-2xl bg-primary p-5 md:p-6 mb-4 md:mb-6 hover:brightness-110 transition">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white leading-snug">
              AI at Work.<br />All-in-One
            </h2>
            <p className="text-white/70 text-xs md:text-sm mt-1.5 mb-3">
              Get a professional website with SEO — live in 60 seconds
            </p>
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-black/20 text-white text-xs font-semibold rounded-full">
              View Plans <RocketIcon size={12} />
            </span>
          </div>
          <RocketIcon size={48} className="text-white/30 hidden sm:block" />
        </div>
      </Link>

      {/* Website Status Card */}
      {user?.websiteUrl ? (
        <div className="rounded-2xl bg-card border border-border p-4 md:p-5 mb-4 md:mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-green-400 font-semibold">Live</span>
            <a href={user.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-semibold truncate">
              {user.websiteUrl}
            </a>
          </div>
          <div className="grid grid-cols-3 gap-3 border-t border-border pt-3">
            {[
              { val: stats.visitors.toLocaleString(), label: 'Visitors' },
              { val: stats.leads.toLocaleString(), label: 'Leads' },
              { val: `${stats.uptime}%`, label: 'Uptime' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-base md:text-lg font-bold">{s.val}</div>
                <div className="text-[11px] text-zinc-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-card border border-border p-4 mb-4 md:mb-6 text-center">
          <p className="text-sm font-semibold">No website yet</p>
          <p className="text-xs text-zinc-500 mt-1">Chat with AI to create one</p>
        </div>
      )}

      {/* Quick Actions */}
      <h2 className="text-sm md:text-base font-bold mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { href: '/dashboard/chat', Icon: ChatBotIcon, label: 'AI Chat', desc: 'Create website', action: null },
          { href: '/dashboard/website', Icon: GlobeIcon, label: 'My Website', desc: 'View & edit', action: null },
          { href: '/dashboard/plans', Icon: DiamondIcon, label: 'Plan', desc: '₹1,499/mo', action: null },
          { href: '#', Icon: ShareIcon, label: 'Share', desc: 'Tell friends', action: 'share' },
          { href: '#', Icon: WhatsAppIcon, label: 'WhatsApp', desc: 'Chat support', action: 'whatsapp' },
        ].map((a) => {
          if (a.action === 'share') {
            return (
              <button
                key="share"
                onClick={() => {
                  const msg = 'Hey! Check out Scalify — build a professional website with SEO in 60 seconds\n\nhttps://scalifyapp.com';
                  if (navigator.share) {
                    navigator.share({ title: 'Scalify', text: msg, url: 'https://scalifyapp.com' });
                  } else {
                    navigator.clipboard.writeText(msg);
                  }
                }}
                className="p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition group text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:bg-primary/20 transition">
                  <a.Icon size={20} />
                </div>
                <div className="text-sm font-semibold group-hover:text-primary transition">{a.label}</div>
                <div className="text-[11px] text-zinc-500 mt-0.5">{a.desc}</div>
              </button>
            );
          } else if (a.action === 'whatsapp') {
            return (
              <a
                key="whatsapp"
                href="https://wa.me/916353583149?text=I%20have%20activated%20the%20free%20trial%20now%20what%20is%20the%20next%20step..."
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:bg-primary/20 transition">
                  <a.Icon size={20} />
                </div>
                <div className="text-sm font-semibold group-hover:text-primary transition">{a.label}</div>
                <div className="text-[11px] text-zinc-500 mt-0.5">{a.desc}</div>
              </a>
            );
          } else {
            return (
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
            );
          }
        })}
      </div>

      {/* Why Scalify - matches mobile app feature list */}
      <h2 className="text-sm md:text-base font-bold mb-3">Why Scalify?</h2>
      <div className="space-y-2 mb-6">
        {[
          { Icon: ZapIcon, title: 'Live in 60 Seconds', desc: 'AI creates your website instantly' },
          { Icon: SearchIcon, title: 'SEO That Works', desc: 'Rank higher on Google with expert optimization' },
          { Icon: SparklesIcon, title: 'Keyword Optimization', desc: 'Target the right keywords your customers search' },
          { Icon: EyeIcon, title: 'Competitor Research', desc: 'Know what your competitors are doing & beat them' },
          { Icon: ChartIcon, title: 'Monthly Reports', desc: 'Detailed website & SEO performance reports' },
          { Icon: LinkIcon, title: 'Unlimited Updates', desc: 'Request website changes anytime via chat' },
          { Icon: HeadsetIcon, title: '24/7 Chat Support', desc: "We're always here to help" },
          { Icon: PhoneIcon, title: 'Mobile Responsive', desc: 'Looks perfect on all devices' },
          { Icon: ShieldIcon, title: 'Free SSL & Hosting', desc: 'Secure and lightning fast' },
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
