'use client';

import { useAuth } from '../../../context/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import { GlobeIcon, ChartIcon } from '../../../components/Icons';

interface Website {
  id: string;
  business_name: string;
  business_type: string | null;
  description: string | null;
  logo_url: string | null;
  services: Array<{ name: string }>;
  photos: string[];
  contact: {
    whatsapp?: string;
    address?: string;
    city?: string;
    email?: string;
    maps_link?: string;
  };
  social_links: {
    instagram?: string;
    facebook?: string;
    existing_website?: string;
  };
  status: 'draft' | 'live' | 'paused' | 'deleted';
  deployed_url: string | null;
  visitors: number;
  leads: number;
}

export default function MyWebsitePage() {
  const { user } = useAuth();
  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWebsite = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data } = await supabase
      .from('websites')
      .select('*')
      .eq('user_id', user.id)
      .not('status', 'eq', 'deleted')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    setWebsite(data ?? null);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { fetchWebsite(); }, [fetchWebsite]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // No website at all
  if (!website) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
          <GlobeIcon size={32} />
        </div>
        <h2 className="text-xl font-bold mb-2">No Website Yet</h2>
        {(user?.plan === 'pro' || user?.plan === 'trial') ? (
          <>
            <p className="text-sm text-zinc-500 mb-6">Complete your profile setup to get started!</p>
            <Link href="/dashboard" className="px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold transition">
              Complete Setup →
            </Link>
          </>
        ) : (
          <>
            <p className="text-sm text-zinc-500 mb-6">Upgrade to Scalify Pro to get your AI-built website!</p>
            <Link href="/dashboard/plans" className="px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold transition">
              Upgrade to Pro — ₹1,499/mo
            </Link>
          </>
        )}
      </div>
    );
  }

  // Draft website — profile created, waiting for deployment
  if (website.status === 'draft') {
    return (
      <div className="max-w-lg mx-auto md:max-w-2xl">
        <h1 className="text-2xl font-extrabold mb-1">My Website</h1>
        <p className="text-zinc-500 text-sm mb-6">Your business profile is ready</p>

        {/* Status Banner */}
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-5 mb-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </div>
          <div>
            <p className="font-semibold text-amber-400">Website Being Built</p>
            <p className="text-sm text-zinc-400 mt-0.5">Our team has received your details and is building your website. You'll get notified once it's live!</p>
          </div>
        </div>

        {/* Business Preview Card */}
        <div className="rounded-2xl bg-card border border-border overflow-hidden mb-5">
          {/* Header with logo */}
          <div className="bg-primary/10 px-6 py-5 flex items-center gap-4">
            {website.logo_url ? (
              <img src={website.logo_url} alt="Logo" className="w-16 h-16 rounded-xl object-contain bg-white p-1 flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold flex-shrink-0">
                {website.business_name?.charAt(0)?.toUpperCase() || 'B'}
              </div>
            )}
            <div>
              <h2 className="text-lg font-extrabold">{website.business_name}</h2>
              {website.business_type && <p className="text-sm text-zinc-400">{website.business_type}</p>}
              {website.contact?.city && <p className="text-xs text-zinc-500 mt-0.5">📍 {website.contact.city}</p>}
            </div>
          </div>

          {/* Details */}
          <div className="divide-y divide-border">

            {/* Contact Info */}
            {(website.contact?.whatsapp || website.contact?.address || website.contact?.email) && (
              <div className="px-6 py-4">
                <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-3">Contact</p>
                <div className="space-y-2">
                  {website.contact?.whatsapp && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-400">📱</span>
                      <span>{website.contact.whatsapp}</span>
                    </div>
                  )}
                  {website.contact?.address && (
                    <div className="flex items-center gap-2 text-sm">
                      <span>📍</span>
                      <span className="text-zinc-300">{website.contact.address}</span>
                    </div>
                  )}
                  {website.contact?.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <span>✉️</span>
                      <span className="text-zinc-300">{website.contact.email}</span>
                    </div>
                  )}
                  {website.contact?.maps_link && (
                    <a href={website.contact.maps_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <span>🗺️</span>
                      <span>View on Google Maps</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Services */}
            {website.services?.length > 0 && (
              <div className="px-6 py-4">
                <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-3">Services</p>
                <div className="flex flex-wrap gap-2">
                  {website.services.map((s, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {typeof s === 'string' ? s : s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {(website.social_links?.instagram || website.social_links?.facebook) && (
              <div className="px-6 py-4">
                <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-3">Social Media</p>
                <div className="flex gap-3">
                  {website.social_links?.instagram && (
                    <a href={website.social_links.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-pink-400 hover:underline">
                      <span>📷</span> Instagram
                    </a>
                  )}
                  {website.social_links?.facebook && (
                    <a href={website.social_links.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-blue-400 hover:underline">
                      <span>👍</span> Facebook
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Gallery */}
            {website.photos?.length > 0 && (
              <div className="px-6 py-4">
                <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-3">Gallery</p>
                <div className="grid grid-cols-3 gap-2">
                  {(website.photos as string[]).slice(0, 6).map((url, i) => (
                    <img key={i} src={url} alt={`Photo ${i + 1}`} className="w-full aspect-square rounded-lg object-cover" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit profile link */}
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-border text-zinc-300 hover:border-primary hover:text-primary transition text-sm font-medium mb-3"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit My Details
        </Link>
      </div>
    );
  }

  // Live website
  return (
    <div className="max-w-lg mx-auto md:max-w-2xl">
      <h1 className="text-2xl font-extrabold mb-4">My Website</h1>

      {/* Status Card */}
      <div className="rounded-2xl bg-surface border border-border p-4 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-green-400 font-semibold">Active & Live</span>
        </div>
        <a href={website.deployed_url!} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline break-all">
          {website.deployed_url}
        </a>
      </div>

      {/* Business summary */}
      <div className="rounded-2xl bg-card border border-border p-4 mb-5 flex items-center gap-4">
        {website.logo_url ? (
          <img src={website.logo_url} alt="Logo" className="w-14 h-14 rounded-xl object-contain bg-surface p-1 flex-shrink-0" />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary text-xl font-bold flex-shrink-0">
            {website.business_name?.charAt(0)?.toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-bold">{website.business_name}</p>
          {website.business_type && <p className="text-sm text-zinc-400">{website.business_type}</p>}
        </div>
      </div>

      {/* Analytics */}
      <h2 className="text-base font-bold mb-3">This Month</h2>
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: 'Visitors', value: (website.visitors || 0).toLocaleString(), color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Leads', value: (website.leads || 0).toLocaleString(), color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl bg-surface border border-border">
            <div className={`text-xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <h2 className="text-base font-bold mb-3">Website Actions</h2>
      <div className="space-y-2">
        {[
          { label: 'Edit Website', desc: 'Request changes via chat', href: '/dashboard/chat', color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Share Website', desc: 'Share your link', href: '#', color: 'text-green-400', bg: 'bg-green-500/10', share: true },
          { label: 'View Analytics', desc: 'Visitor stats', href: '#', color: 'text-purple-400', bg: 'bg-purple-500/10', icon: <ChartIcon size={20} /> },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            onClick={action.share ? (e: React.MouseEvent) => {
              e.preventDefault();
              const url = website.deployed_url!;
              navigator.share ? navigator.share({ title: website.business_name, url }) : navigator.clipboard.writeText(url);
            } : undefined}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface border border-border hover:border-primary/30 transition"
          >
            <div className={`w-11 h-11 rounded-xl ${action.bg} flex items-center justify-center ${action.color} flex-shrink-0`}>
              {action.icon || <GlobeIcon size={20} />}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">{action.label}</div>
              <div className="text-xs text-zinc-500">{action.desc}</div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-600"><path d="M9 18l6-6-6-6"/></svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
