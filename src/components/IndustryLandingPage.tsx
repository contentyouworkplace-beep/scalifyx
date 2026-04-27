'use client';

import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { LandingConfig } from '@/lib/nicheLandingData';
import { Logo } from '@/components/Logo';

const TOTAL_LAUNCH_SEATS = 1000;
const SPOTS_TAKEN_KEY = 'sxSpotsTaken';
const CTA_TEXT = 'Signup & send enquiry on WhatsApp';

const SLUG_IMAGE_MAP: Record<string, string> = {
  'hair-transplant-skin-clinics': '/niche/hair-transplant-skin-clinics.jpg',
  'visa-consultants': '/niche/visa-consultants.jpg',
  'packers-and-movers': '/niche/packers-and-movers.jpg',
  'packaging-manufacturers': '/niche/packaging-manufacturers.jpg',
  'cosmetic-surgery-clinics': '/niche/cosmetic-surgery-clinics.jpg',
  'pest-control-services': '/niche/pest-control-services.jpg',
  exporters: '/niche/exporters.jpg',
  'cctv-security-system-installation': '/niche/cctv-security-system-installation.jpg',
  'luxury-property-consultants': '/niche/luxury-property-consultants.jpg',
  'solar-panel-installation': '/niche/solar-panel-installation.jpg',
};

function conciseText(text: string, maxLen = 120) {
  if (text.length <= maxLen) {
    return text;
  }

  return `${text.slice(0, maxLen - 1).trim()}...`;
}

function useSpotsLeft() {
  const [taken, setTaken] = useState(847);

  useEffect(() => {
    const stored = localStorage.getItem(SPOTS_TAKEN_KEY);
    if (stored) {
      setTaken(parseInt(stored, 10));
      return;
    }

    const val = Math.floor(Math.random() * 80) + 820;
    localStorage.setItem(SPOTS_TAKEN_KEY, String(val));
    setTaken(val);
  }, []);

  return TOTAL_LAUNCH_SEATS - taken;
}

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!';
  let pwd = '';

  for (let i = 0; i < 10; i += 1) {
    pwd += chars[Math.floor(Math.random() * chars.length)];
  }

  return pwd;
}

export function IndustryLandingPage({ config }: { config: LandingConfig }) {
  const spotsLeft = useSpotsLeft();
  const { signUp } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  const imagePath = SLUG_IMAGE_MAP[config.slug] || '/niche/local-business.jpg';

  const quickPainPoints = useMemo(() => config.painPoints.slice(0, 3), [config.painPoints]);
  const quickOutcomes = useMemo(() => config.outcomes.slice(0, 3), [config.outcomes]);

  useEffect(() => {
    if (!loading) {
      return;
    }

    const base = 'Creating your account';
    let dots = 0;
    setLoadingText(base);

    const interval = setInterval(() => {
      dots = (dots + 1) % 4;
      setLoadingText(base + '.'.repeat(dots));
    }, 400);

    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }

    setLoading(true);

    const autoPassword = generatePassword();
    const result = await signUp(email, autoPassword, name, phone);

    if (!result.success) {
      setError(result.error || 'Something went wrong. Please try again.');
      setLoading(false);
      return;
    }

    router.replace('/dashboard');
  };

  return (
    <div className="min-h-screen bg-bg text-white">
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-K97W1RGBXV" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-K97W1RGBXV');
        `}
      </Script>

      <div className="fixed top-0 w-full z-[60] bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 py-2 px-4 text-center">
        <p className="text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 flex-nowrap sm:flex-wrap overflow-hidden">
          <span className="truncate sm:whitespace-normal">Only the first 1,000 businesses get launch pricing for website + SEO setup.</span>
          <span className="bg-white/20 border border-white/30 rounded-full px-2.5 py-0.5 font-extrabold text-xs flex-shrink-0">
            {spotsLeft} spots left
          </span>
        </p>
      </div>

      <nav className="fixed top-[36px] w-full z-50 bg-bg/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo size={32} />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#benefits" className="text-zinc-400 hover:text-white transition text-sm">Benefits</a>
            <a href="#how-it-works" className="text-zinc-400 hover:text-white transition text-sm">How It Works</a>
            <a href="#signup-form" className="text-zinc-400 hover:text-white transition text-sm">Get Started</a>
          </div>
          <a
            href="#signup-form"
            className="px-4 sm:px-5 py-2 text-xs sm:text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition whitespace-nowrap"
          >
            {CTA_TEXT}
          </a>
        </div>
      </nav>

      <section className="pt-32 sm:pt-40 pb-14 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-7">
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 min-h-[380px]">
              <Image src={imagePath} alt={config.nicheName} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/35" />
              <div className="relative p-7 sm:p-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 bg-green-500/20 border border-green-400/50 rounded-full text-green-300 text-xs sm:text-sm font-bold">
                  Built for {config.nicheName}
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.06] max-w-xl">{config.heroTitle}</h1>
                <p className="text-zinc-200 text-base sm:text-lg mt-4 max-w-xl">{conciseText(config.heroSubtitle, 170)}</p>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {['No credit card', 'Fast setup', 'WhatsApp leads', 'Local SEO included'].map((item) => (
                    <span key={item} className="px-3 py-1.5 rounded-full bg-black/40 border border-white/20 text-xs font-semibold text-zinc-200">
                      {item}
                    </span>
                  ))}
                </div>
                <a
                  href="#signup-form"
                  className="inline-flex mt-7 px-8 py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-extrabold text-base transition"
                >
                  {CTA_TEXT}
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5" id="signup-form">
            <div className="rounded-3xl bg-card border border-border p-6 sm:p-7 shadow-2xl shadow-black/40 scroll-mt-40 sticky top-28">
              <div className="bg-gradient-to-r from-emerald-600 to-green-500 rounded-xl px-4 py-2.5 text-center mb-4">
                <span className="text-white text-xs sm:text-sm font-bold">Only {spotsLeft} launch seats left</span>
              </div>

              <h2 className="text-2xl font-extrabold leading-tight">Launch your {config.nicheName} website today</h2>
              <p className="text-zinc-400 text-sm mt-1 mb-4">Create account in under 60 seconds.</p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-inputBg border border-border rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 transition"
                  placeholder="Your full name"
                />
                <div className="flex items-center bg-inputBg border border-border rounded-xl overflow-hidden focus-within:border-green-500 transition">
                  <span className="px-3 text-zinc-500 text-sm font-medium select-none">+91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="flex-1 py-3 pr-4 bg-transparent text-white placeholder-zinc-600 focus:outline-none text-sm"
                    placeholder="Phone number"
                  />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-inputBg border border-border rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 transition"
                  placeholder="Email address"
                />

                {error ? (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-base transition disabled:opacity-60"
                >
                  {loading ? loadingText : CTA_TEXT}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Leads in WhatsApp', value: 'Direct' },
            { label: 'Setup Time', value: '60 sec' },
            { label: 'Local SEO', value: 'Included' },
            { label: 'Launch Pricing', value: '₹1499/mo' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-card p-5 text-center">
              <div className="text-2xl font-black text-green-400">{item.value}</div>
              <div className="text-zinc-400 text-sm mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="benefits" className="py-12 px-4 border-y border-border bg-surface/50">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
            <h3 className="text-xl font-extrabold mb-4">What Is Costing You Leads</h3>
            <div className="space-y-3">
              {quickPainPoints.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 w-6 h-6 rounded-full bg-red-500/20 text-red-300 text-xs font-bold flex items-center justify-center">!</span>
                  <p className="text-zinc-300 text-sm leading-relaxed">{conciseText(item, 98)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-6">
            <h3 className="text-xl font-extrabold mb-4">What You Get Instead</h3>
            <div className="space-y-3">
              {quickOutcomes.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 w-6 h-6 rounded-full bg-green-500/20 text-green-300 text-xs font-bold flex items-center justify-center">✓</span>
                  <p className="text-zinc-200 text-sm leading-relaxed">{conciseText(item, 98)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-9">
            <h2 className="text-3xl sm:text-4xl font-extrabold">Simple Flow. Better Conversions.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              ['01', 'Fill quick form', 'Name, phone, and email only.'],
              ['02', 'Launch niche page', 'Get your focused website + SEO setup.'],
              ['03', 'Capture more leads', 'Visitors contact you directly via CTA.'],
            ].map(([step, title, desc]) => (
              <div key={step} className="rounded-2xl bg-card border border-border p-6">
                <div className="text-5xl leading-none font-extrabold text-green-500/30 mb-3">{step}</div>
                <h3 className="text-lg font-bold mb-1">{title}</h3>
                <p className="text-zinc-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <a href="#signup-form" className="inline-flex px-10 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-extrabold transition">
              {CTA_TEXT}
            </a>
          </div>
        </div>
      </section>

      <section className="py-14 px-4 border-y border-border bg-surface/50">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-4">
          {[imagePath, '/niche/local-business.jpg', '/niche/solar-panel-installation.jpg'].map((src) => (
            <div key={src} className="relative h-52 rounded-2xl overflow-hidden border border-white/10">
              <Image src={src} alt="Business growth visual" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight">Turn Visits Into Real Enquiries</h2>
          <p className="text-zinc-400 text-base sm:text-lg mt-4 mb-8">{conciseText(config.proof, 140)}</p>
          <a
            href="#signup-form"
            className="inline-flex items-center justify-center px-12 py-5 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-extrabold text-lg transition"
          >
            {CTA_TEXT}
          </a>
          <p className="text-zinc-500 text-sm mt-3">Only {spotsLeft} launch seats remaining.</p>
        </div>
      </section>

      <footer className="py-10 px-4 border-t border-border bg-surface/40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/">
            <Logo size={30} />
          </Link>
          <div className="text-zinc-500 text-sm text-center md:text-right">
            <p>ScalifyX for {config.nicheName}</p>
            <p>© 2026 ScalifyX. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-3 bg-bg/90 backdrop-blur-xl border-t border-border">
        <a
          href="#signup-form"
          className="w-full inline-flex items-center justify-center px-5 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-extrabold text-sm transition"
        >
          {CTA_TEXT}
        </a>
      </div>
    </div>
  );
}
