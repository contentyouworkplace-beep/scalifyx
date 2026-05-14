'use client';

import { useAuth } from '../../../context/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { apiFetch } from '../../../lib/api';
import Link from 'next/link';
import { GlobeIcon } from '../../../components/Icons';

interface Website {
  id: string;
  business_name: string;
  business_type: string | null;
  description: string | null;
  logo_url: string | null;
  services: Array<{ name: string } | string>;
  photos: string[];
  contact: Record<string, string | null>;
  social_links: Record<string, string | null>;
  status: 'draft' | 'live' | 'paused' | 'deleted';
  deployed_url: string | null;
  preview_website_url: string | null;
  visitors: number;
  leads: number;
}

export default function MyWebsitePage() {
  const { user } = useAuth();
  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

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

  // Auto-create website from profile if onboarding done but no website record yet
  const syncFromProfile = useCallback(async () => {
    if (!user?.id || !user.onboarding_completed) return;
    setSyncing(true);
    try {
      await apiFetch('/onboarding/submit', {
        method: 'POST',
        body: JSON.stringify({
          business_name: user.businessName || user.business_name,
          business_category: user.business_category,
          business_city: user.business_city,
          whatsapp_number: user.whatsapp_number || user.phone,
          business_address: user.business_address,
          google_maps_link: user.google_maps_link,
          business_description: user.business_description,
          logo_url: user.logo_url,
          instagram_url: user.instagram_url,
          facebook_url: user.facebook_url,
          existing_website_url: user.existing_website_url,
          services: user.services || [],
          gallery_images: user.gallery_images || [],
          domain_purchased: user.domain_purchased || false,
          domain_name: user.domain_name,
          email: user.email,
        }),
      });
      await fetchWebsite();
    } catch {
      setLoading(false);
    } finally {
      setSyncing(false);
    }
  }, [user, fetchWebsite]);

  useEffect(() => {
    fetchWebsite();
  }, [fetchWebsite]);

  // If profile is done but no website record, auto-sync
  useEffect(() => {
    if (!loading && !website && user?.onboarding_completed) {
      syncFromProfile();
    }
  }, [loading, website, user?.onboarding_completed, syncFromProfile]);

  if (loading || syncing) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        {syncing && <span className="ml-3 text-sm text-zinc-400">Syncing your profile...</span>}
      </div>
    );
  }

  // No profile completed yet
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

  const isLive = website.status === 'live';

  return (
    <div className="max-w-lg mx-auto md:max-w-2xl pb-10">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-extrabold">My Website</h1>
        <Link
          href="/dashboard?edit=1"
          className="flex items-center gap-1.5 text-xs text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit Profile
        </Link>
      </div>
      <p className="text-zinc-500 text-sm mb-5">
        {isLive ? 'Your website is live' : 'Your profile is ready — website being built'}
      </p>

      {/* Status Banner */}
      {!isLive && (
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 mb-5 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </div>
          <div>
            <p className="font-semibold text-amber-400 text-sm">Website Being Built</p>
            <p className="text-xs text-zinc-400 mt-0.5">Our team has your details and is building your website. You'll be notified once it's live!</p>
          </div>
        </div>
      )}

      {/* Live URL */}
      {isLive && website.deployed_url && (
        <div className="rounded-2xl bg-green-500/10 border border-green-500/30 p-4 mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-green-400 font-semibold uppercase tracking-wider mb-1">🟢 Live</p>
            <a href={website.deployed_url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline break-all">
              {website.deployed_url}
            </a>
          </div>
          <a href={website.deployed_url} target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 px-3 py-2 rounded-lg bg-green-500/20 text-green-400 text-xs font-bold hover:bg-green-500/30 transition">
            Visit →
          </a>
        </div>
      )}

      {/* Preview Link (admin sets preview_website_url) */}
      {website.preview_website_url && (
        <div className="rounded-2xl bg-blue-500/10 border border-blue-500/30 p-4 mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-1">👁 Preview Ready</p>
            <p className="text-xs text-zinc-400">Your website preview is ready — check it out!</p>
          </div>
          <a
            href={website.preview_website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-bold hover:bg-blue-500/30 transition whitespace-nowrap"
          >
            Preview →
          </a>
        </div>
      )}

      {/* Business Profile Card */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden mb-5">
        {/* Header */}
        <div className="bg-primary/10 px-5 py-4 flex items-center gap-4">
          {website.logo_url ? (
            <img src={website.logo_url} alt="Logo" className="w-14 h-14 rounded-xl object-contain bg-white p-1 flex-shrink-0" />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary text-xl font-bold flex-shrink-0">
              {website.business_name?.charAt(0)?.toUpperCase() || 'B'}
            </div>
          )}
          <div>
            <h2 className="font-extrabold text-base">{website.business_name}</h2>
            {website.business_type && <p className="text-sm text-zinc-400">{website.business_type}</p>}
            {website.contact?.city && <p className="text-xs text-zinc-500 mt-0.5">📍 {website.contact.city}</p>}
          </div>
        </div>

        <div className="divide-y divide-border">
          {/* Contact */}
          {(website.contact?.whatsapp || website.contact?.address || website.contact?.email) && (
            <div className="px-5 py-4">
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-3">Contact</p>
              <div className="space-y-2">
                {website.contact?.whatsapp && (
                  <div className="flex items-center gap-2 text-sm"><span className="text-green-400">📱</span><span>{website.contact.whatsapp}</span></div>
                )}
                {website.contact?.address && (
                  <div className="flex items-center gap-2 text-sm"><span>📍</span><span className="text-zinc-300">{website.contact.address}</span></div>
                )}
                {website.contact?.email && (
                  <div className="flex items-center gap-2 text-sm"><span>✉️</span><span className="text-zinc-300">{website.contact.email}</span></div>
                )}
                {website.contact?.maps_link && (
                  <a href={website.contact.maps_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <span>🗺️</span><span>View on Google Maps</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Services */}
          {website.services?.length > 0 && (
            <div className="px-5 py-4">
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
          {(website.social_links?.instagram || website.social_links?.facebook || website.social_links?.existing_website) && (
            <div className="px-5 py-4">
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-3">Links</p>
              <div className="flex flex-wrap gap-3">
                {website.social_links?.instagram && (
                  <a href={website.social_links.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-pink-400 hover:underline">
                    📷 Instagram
                  </a>
                )}
                {website.social_links?.facebook && (
                  <a href={website.social_links.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-blue-400 hover:underline">
                    👍 Facebook
                  </a>
                )}
                {website.social_links?.existing_website && (
                  <a href={website.social_links.existing_website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-zinc-400 hover:underline">
                    🌐 Existing Site
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Gallery */}
          {website.photos?.length > 0 && (
            <div className="px-5 py-4">
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-3">Gallery</p>
              <div className="grid grid-cols-3 gap-2">
                {(website.photos as string[]).slice(0, 6).map((url, i) => (
                  <img key={i} src={url} alt="" className="w-full aspect-square rounded-lg object-cover" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats (live only) */}
      {isLive && (
        <>
          <h2 className="text-base font-bold mb-3">Stats</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Visitors', value: (website.visitors || 0).toLocaleString(), color: 'text-primary' },
              { label: 'Leads', value: (website.leads || 0).toLocaleString(), color: 'text-indigo-400' },
            ].map((s) => (
              <div key={s.label} className="p-4 rounded-2xl bg-surface border border-border">
                <div className={`text-xl font-extrabold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
