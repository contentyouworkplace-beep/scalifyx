'use client';

import Link from 'next/link';
import Script from 'next/script';
import { BUSINESS_TYPES, WEBSITE_TEMPLATES } from '@/lib/constants';
import { Logo } from '@/components/Logo';
import {
  ChatBotIcon, PaletteIcon, PhoneIcon, SearchIcon, GlobeIcon,
  ChartIcon, WhatsAppIcon, ShieldIcon, HeadsetIcon, RocketIcon,
  RestaurantIcon, ScissorsIcon, HospitalIcon, ScaleIcon, ShoppingBagIcon,
  DumbbellIcon, BookIcon, CameraIcon, CarIcon, HomeOutlineIcon, BriefcaseIcon, WrenchIcon,
} from '@/components/Icons';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

/* ─── FREE SPOTS COUNTER (starts at 1000, counts down) ─── */
const TOTAL_FREE_SPOTS = 1000;
const SPOTS_TAKEN_KEY = 'sxSpotsTaken';

function useSpotsTaken() {
  const [taken, setTaken] = useState(847);
  useEffect(() => {
    const stored = localStorage.getItem(SPOTS_TAKEN_KEY);
    if (stored) { setTaken(parseInt(stored, 10)); return; }
    const val = Math.floor(Math.random() * 80) + 820;
    localStorage.setItem(SPOTS_TAKEN_KEY, String(val));
    setTaken(val);
  }, []);
  return TOTAL_FREE_SPOTS - taken;
}

/* ─────────────────────────────────────────
   SIGNUP POPUP
───────────────────────────────────────── */
function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!';
  let pwd = '';
  for (let i = 0; i < 10; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
  return pwd;
}

function SignupPopup({ onClose, spotsLeft }: { onClose: () => void; spotsLeft: number }) {
  const { signUp } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    if (!loading) return;
    const base = 'Creating your free account';
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
    if (!name.trim()) return setError('Please enter your name.');
    if (!email.trim()) return setError('Please enter your email.');
    setLoading(true);
    const autoPassword = generatePassword();
    const result = await signUp(email, autoPassword, name, phone);
    if (!result.success) {
      setError(result.error || 'Something went wrong. Please try again.');
      setLoading(false);
    } else {
      router.replace('/dashboard');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scarcity banner inside popup */}
        <div className="bg-gradient-to-r from-violet-700 to-indigo-700 px-4 py-2.5 text-center flex items-center justify-center gap-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-yellow-300 flex-shrink-0">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/>
          </svg>
          <span className="text-white text-xs font-bold">
            Only <span className="underline font-extrabold">{spotsLeft} spots left</span> at ₹0 — Free forever for first 1,000 businesses
          </span>
        </div>

        <div className="p-7">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-[52px] right-5 w-7 h-7 flex items-center justify-center rounded-full bg-surface hover:bg-border text-zinc-400 hover:text-white transition"
            aria-label="Close"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>

          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs font-bold">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              100% FREE — ₹0 Forever. No Credit Card.
            </div>
            <h2 className="text-2xl font-extrabold text-white leading-tight">
              Claim Your Free Website Now
            </h2>
            <p className="text-zinc-400 text-sm mt-1">Takes 60 seconds. No tech skills needed.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-inputBg border border-border rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 transition"
              placeholder="Your full name"
            />
            {/* Phone */}
            <div className="flex items-center bg-inputBg border border-border rounded-xl overflow-hidden focus-within:border-green-500 transition">
              <span className="px-3 text-zinc-500 text-sm font-medium select-none">🇮🇳 +91</span>
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

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-base transition disabled:opacity-60 shadow-lg shadow-green-500/20"
            >
              {loading ? loadingText : 'Get My Free Website'}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-600 mt-3">
            By signing up you agree to our Terms & Privacy Policy.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              {
                icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#6C5CE7" strokeWidth="2"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="#6C5CE7" strokeWidth="2"/></svg>,
                text: 'Free Website',
              },
              {
                icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#6C5CE7" strokeWidth="2"/><circle cx="12" cy="9" r="2.5" stroke="#6C5CE7" strokeWidth="2"/></svg>,
                text: 'Local SEO',
              },
              {
                icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#25D366"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.979-1.418A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke="#25D366" strokeWidth="1.8"/></svg>,
                text: 'Leads on WhatsApp',
              },
              {
                icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="#6C5CE7" strokeWidth="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="#6C5CE7" strokeWidth="2" strokeLinecap="round"/></svg>,
                text: 'Free Hosting',
              },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 bg-surface/60 rounded-lg px-3 py-2">
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="text-xs text-zinc-300 font-medium">{item.text}</span>
                <span className="ml-auto text-xs text-green-400 font-bold">FREE</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   LANDING PAGE
───────────────────────────────────────── */
export default function LandingPage() {
  const [showSignup, setShowSignup] = useState(false);
  const spotsLeft = useSpotsTaken();

  const openSignup = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setShowSignup(true);
  };

  return (
    <div className="min-h-screen bg-bg">
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-K97W1RGBXV"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-K97W1RGBXV');
        `}
      </Script>

      {showSignup && <SignupPopup onClose={() => setShowSignup(false)} spotsLeft={spotsLeft} />}

      {/* ── SCARCITY ANNOUNCEMENT BAR ── */}
      <div className="fixed top-0 w-full z-[60] bg-gradient-to-r from-violet-700 via-indigo-700 to-violet-700 py-2 px-4 text-center">
        <p className="text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 flex-nowrap sm:flex-wrap overflow-hidden">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-yellow-300 flex-shrink-0">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/>
          </svg>
          <span className="truncate sm:whitespace-normal">
            <span className="hidden sm:inline">LIMITED OFFER — </span>
            FREE for First 1,000 Businesses Only.
          </span>
          <span className="bg-white/15 border border-white/20 rounded-full px-2.5 py-0.5 text-white font-extrabold text-xs flex-shrink-0">
            {spotsLeft} spots left
          </span>
          <button
            onClick={() => openSignup()}
            className="hidden sm:block bg-white text-indigo-700 font-extrabold text-xs rounded-full px-3 py-1 hover:bg-indigo-50 transition flex-shrink-0"
          >
            Claim Yours →
          </button>
        </p>
      </div>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-[36px] w-full z-50 bg-bg/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/"><Logo size={32} /></Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-zinc-400 hover:text-white transition text-sm">Features</a>
            <a href="#templates" className="text-zinc-400 hover:text-white transition text-sm">Templates</a>
            <a href="#business" className="text-zinc-400 hover:text-white transition text-sm">For Your Business</a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="px-3 sm:px-4 py-2 text-sm text-zinc-400 hover:text-white transition">Login</Link>
            <button
              onClick={() => openSignup()}
              className="px-4 sm:px-5 py-2 text-xs sm:text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition whitespace-nowrap"
            >
              Get Free Website
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-36 sm:pt-44 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Free badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 mb-6 bg-green-500/10 border border-green-500/40 rounded-full text-green-400 text-sm font-bold">
            <RocketIcon size={15} />
            Free Website + Local SEO — Live in 60 Seconds
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight">
            Free Website. Free Local SEO.{' '}
            <br className="hidden sm:block" />
            <span className="gradient-text">Get Found on Google</span>{' '}
            <span className="text-green-400">— ₹0 Forever.</span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-4 leading-relaxed">
            Get a professional website + Local SEO that puts you on Google + leads delivered directly on your WhatsApp — all at{' '}
            <span className="text-white font-bold">₹0</span>. No agency. No coding. No credit card.
          </p>

          <p className="text-violet-400 font-bold text-sm sm:text-base mb-10 flex items-center justify-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/></svg>
            Free only for the first 1,000 businesses — {spotsLeft} spots remaining
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => openSignup()}
              className="px-10 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-extrabold text-lg transition shadow-xl shadow-green-500/30 flex items-center justify-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white"/></svg>
              Claim My Free Website Now
            </button>
            <a
              href="#features"
              className="px-8 py-4 bg-card hover:bg-surface border border-border text-white rounded-xl font-semibold text-lg transition"
            >
              See How It Works ↓
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500">
            {['No credit card', 'No hidden charges', 'Setup in 60 seconds', 'Free forever'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET FREE ── */}
      <section className="py-14 px-4 border-y border-border bg-surface/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-5xl sm:text-6xl font-black text-green-400 tracking-tight">FREE</span>
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mt-1">Everything below — ₹0 for the first 1,000 businesses</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#6C5CE7" strokeWidth="1.8"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="#6C5CE7" strokeWidth="1.8"/></svg>,
                label: 'Professional Website', sub: '₹0 forever',
              },
              {
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#6C5CE7" strokeWidth="1.8"/><circle cx="12" cy="9" r="2.5" stroke="#6C5CE7" strokeWidth="1.8"/></svg>,
                label: 'Local SEO Setup', sub: '₹0 forever',
              },
              {
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#25D366"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.979-1.418A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke="#25D366" strokeWidth="1.6"/></svg>,
                label: 'Leads Directly on WhatsApp', sub: 'Customers message you live',
              },
              {
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="#6C5CE7" strokeWidth="1.8"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="#6C5CE7" strokeWidth="1.8" strokeLinecap="round"/></svg>,
                label: 'SSL Hosting', sub: '99.9% uptime',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center text-center p-5 rounded-2xl bg-card border border-green-500/20 hover:border-green-500/50 transition"
              >
                <div className="mb-3">{item.icon}</div>
                <span className="text-white font-semibold text-sm leading-snug">{item.label}</span>
                <span className="text-green-400 text-xs font-bold mt-1.5 bg-green-500/10 px-2 py-0.5 rounded-full">{item.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCAL SEO HIGHLIGHT ── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl bg-card border border-border p-8 md:p-14 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-shrink-0 w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <SearchIcon size={44} className="text-primary" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold mb-4 uppercase tracking-widest">
                Your #1 Growth Engine
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 leading-snug">
                Show Up on Google When Customers Search for{' '}
                <span className="gradient-text">Your Business.</span>
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed mb-4">
                When someone searches <span className="text-white font-medium">&ldquo;best salon near me&rdquo;</span> or <span className="text-white font-medium">&ldquo;doctor in Pune&rdquo;</span> — your business shows up. We set up your complete Local SEO: Google Search Console, meta tags, sitemaps, page speed, structured data — all done for you, automatically.
              </p>
              <p className="text-zinc-400 text-base leading-relaxed mb-6">
                This alone is worth <span className="text-white font-semibold">₹8,000/month</span> from an SEO agency. On ScalifyX, it&apos;s included free.
              </p>
              <button
                onClick={() => openSignup()}
                className="px-7 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition shadow-lg shadow-primary/20"
              >
                Get My Free Local SEO Setup
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHATSAPP LEADS HIGHLIGHT ── */}
      <section className="py-4 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl bg-card border border-border p-8 md:p-14 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-shrink-0 w-24 h-24 rounded-3xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <WhatsAppIcon size={48} className="text-green-400" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold mb-4 uppercase tracking-widest">
                Zero Lead Leakage
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 leading-snug">
                Get Leads{' '}
                <span className="text-green-400">Directly on Your WhatsApp.</span>{' '}
                Not in a Form. Not in an Email.
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed mb-6">
                Every visitor on your site sees one button — WhatsApp. They tap it, they&apos;re in your chat. You reply, you close. No middlemen, no CRM, no follow-up email chains. Just real customers messaging you live on the phone that&apos;s already in your hand.
              </p>
              <button
                onClick={() => openSignup()}
                className="px-7 py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition shadow-lg shadow-green-500/20"
              >
                Start Getting Leads on WhatsApp — Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-14 border-y border-border bg-surface/40">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-4">
          {[
            { num: '50,000+', label: 'Businesses Online' },
            { num: '60 sec', label: 'Average Setup Time' },
            { num: '99.9%', label: 'Uptime Guarantee' },
            { num: '₹0', label: 'Cost to Start' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl sm:text-3xl font-extrabold gradient-text">{s.num}</div>
              <div className="text-zinc-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              You&apos;re 60 Seconds Away from Your{' '}
              <span className="gradient-text">Free Website</span>
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">No tech skills. No designer. No agency. Just 3 steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Sign Up in Seconds',
                desc: 'Create your free account with just your email and password. Zero friction. Takes 30 seconds.',
                cta: true,
              },
              {
                step: '02',
                title: 'Describe Your Business',
                desc: 'Tell our AI your business name, type, and location. It builds your complete website & local SEO automatically.',
                cta: false,
              },
              {
                step: '03',
                title: 'Go Live & Get Leads',
                desc: 'Your website is published instantly. Google starts finding you. WhatsApp leads start coming in.',
                cta: false,
              },
            ].map((s) => (
              <div key={s.step} className="p-7 rounded-2xl bg-card border border-border flex flex-col">
                <div className="text-6xl font-extrabold text-green-500/20 mb-4 leading-none">{s.step}</div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed flex-1">{s.desc}</p>
                {s.cta && (
                  <button
                    onClick={() => openSignup()}
                    className="mt-5 w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm transition"
                  >
                    Start Here →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 px-4 bg-surface/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Built for Indian Businesses.{' '}
              <span className="gradient-text">Priced at Zero.</span>
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Everything a ₹50,000/year agency charges for — completely free on ScalifyX.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                Icon: ChatBotIcon,
                title: 'AI Website Builder',
                desc: 'Just describe your business in plain language. Our AI builds a full professional website — no templates to wrestle with.',
                free: true,
              },
              {
                Icon: SearchIcon,
                title: 'Local SEO — Done for You',
                desc: 'Appear on Google when people search "best salon in Pune" or "doctor near me". We handle Google Search Console, meta tags, sitemaps — everything.',
                free: true,
              },
              {
                Icon: WhatsAppIcon,
                title: 'Get Leads Directly on WhatsApp',
                desc: 'Every visitor sees a WhatsApp button. One tap — they\'re in your chat. No forms. No delays. Leads come straight to the phone in your hand.',
                free: true,
              },
              {
                Icon: PhoneIcon,
                title: 'Mobile-First Design',
                desc: '90% of your customers browse on phones. Your ScalifyX website looks flawless on every screen, every time.',
                free: true,
              },
              {
                Icon: ShieldIcon,
                title: 'Free Hosting + SSL',
                desc: 'We host your site on enterprise-grade servers with 99.9% uptime and an SSL certificate — so Google trusts you from day one.',
                free: true,
              },
              {
                Icon: GlobeIcon,
                title: 'Free Subdomain',
                desc: 'Get yourbusiness.scalifyx.com live in seconds. Ready to upgrade? Add your own .com or .in domain anytime.',
                free: true,
              },
              {
                Icon: PaletteIcon,
                title: '12+ Premium Templates',
                desc: 'Restaurant, clinic, salon, portfolio, gym, coaching — pick a design made specifically for your industry.',
                free: true,
              },
              {
                Icon: ChartIcon,
                title: 'Analytics Dashboard',
                desc: 'See who\'s visiting your site, where they\'re from, and which pages drive the most leads. Monthly SEO reports included.',
                free: false,
              },
              {
                Icon: HeadsetIcon,
                title: '24/7 Support',
                desc: 'Real humans monitoring your website and SEO performance around the clock — backed by AI so response time is instant.',
                free: false,
              },
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-xl bg-card border border-border hover:border-primary/40 transition group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition">
                    <f.Icon size={22} />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${f.free ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-primary/10 border border-primary/30 text-primary'}`}>
                    {f.free ? 'FREE' : 'PRO'}
                  </span>
                </div>
                <h3 className="text-base font-bold mb-1.5 group-hover:text-primary transition">{f.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => openSignup()}
              className="px-10 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-extrabold text-lg transition shadow-xl shadow-green-500/25"
            >
              Get All of This — 100% Free
            </button>
            <p className="mt-3 text-zinc-500 text-sm">Only {spotsLeft} free spots remaining</p>
          </div>
        </div>
      </section>

      {/* ── TEMPLATES ── */}
      <section id="templates" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              12+ Industry Templates.{' '}
              <span className="text-green-400">All Free.</span>
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Pick your industry template or let AI design a fully custom one — in seconds.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {WEBSITE_TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => openSignup()}
                className="p-4 rounded-xl bg-card border border-border hover:border-green-500/40 transition text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:bg-primary/20 transition">
                  <PaletteIcon size={20} />
                </div>
                <h4 className="font-semibold text-sm group-hover:text-green-400 transition">{t.name}</h4>
                <p className="text-zinc-500 text-xs mt-1">{t.preview}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUSINESS TYPES ── */}
      <section id="business" className="py-20 px-4 bg-surface/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Whatever You Do — We&apos;ve Got You Covered
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Doctor, salon, restaurant, tutor, freelancer — ScalifyX works for every business type. For free.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {BUSINESS_TYPES.map((b) => {
              const bizIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
                restaurant: RestaurantIcon, salon: ScissorsIcon, doctor: HospitalIcon,
                lawyer: ScaleIcon, shop: ShoppingBagIcon, gym: DumbbellIcon,
                tutor: BookIcon, photographer: CameraIcon, auto: CarIcon,
                realestate: HomeOutlineIcon, freelancer: BriefcaseIcon, other: WrenchIcon,
              };
              const BizIcon = bizIcons[b.id] || BriefcaseIcon;
              return (
                <button
                  key={b.id}
                  onClick={() => openSignup()}
                  className="p-4 rounded-xl bg-card border border-border text-center hover:border-green-500/40 transition group"
                >
                  <div className="w-10 h-10 mx-auto rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2 group-hover:bg-primary/20 transition">
                    <BizIcon size={20} />
                  </div>
                  <div className="text-sm font-medium group-hover:text-green-400 transition">{b.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF / TRUST ── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
              50,000+ Businesses Trust ScalifyX
            </h2>
            <p className="text-zinc-400">Real businesses. Real leads. Real growth.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Priya S.',
                biz: 'Salon Owner, Pune',
                quote: '"I got 12 WhatsApp inquiries on the first day my site went live. Never spent a single rupee on ads."',
              },
              {
                name: 'Dr. Rahul M.',
                biz: 'Dentist, Mumbai',
                quote: '"Patients now find my clinic on Google when they search nearby. Appointments have doubled in 2 months."',
              },
              {
                name: 'Ankit T.',
                biz: 'Tutor, Delhi',
                quote: '"Set up in literally 60 seconds. My students\' parents WhatsApp me directly from the website. Game changer."',
              },
            ].map((t) => (
              <div key={t.name} className="p-6 rounded-2xl bg-card border border-border">
                <p className="text-zinc-300 text-sm leading-relaxed mb-5 italic">{t.quote}</p>
                <div>
                  <div className="text-white font-bold text-sm">{t.name}</div>
                  <div className="text-zinc-500 text-xs">{t.biz}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-4 bg-surface/40 border-y border-border">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 mb-6 bg-violet-500/10 border border-violet-500/30 rounded-full text-violet-400 text-sm font-bold">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/></svg>
            Only {spotsLeft} Free Spots Left out of 1,000
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-5 leading-tight">
            Your Competitor Is on Google.
            <br className="hidden sm:block" />
            <span className="gradient-text">Are You?</span>
          </h2>
          <p className="text-zinc-400 text-lg mb-3 leading-relaxed">
            Right now someone is searching for exactly what you offer. If your business isn&apos;t showing up — that customer goes to whoever is. A free website + Local SEO fixes that in 60 seconds.
          </p>
          <p className="text-green-400 font-bold text-xl mb-10">
            Free Website. Free SEO. Leads on WhatsApp. ₹0.
          </p>
          <button
            onClick={() => openSignup()}
            className="inline-flex items-center gap-3 px-14 py-5 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-extrabold text-xl transition shadow-2xl shadow-green-500/30"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white"/></svg>
            Get My Free Website Now
          </button>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-zinc-500">
            {['Free forever for first 1,000 users', 'No credit card', 'Cancel anytime'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/"><Logo size={32} /></Link>
            <div className="flex gap-6 text-sm text-zinc-500">
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#templates" className="hover:text-white transition">Templates</a>
              <a href="#business" className="hover:text-white transition">Business Types</a>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 pt-4 border-t border-border w-full">
            <p className="text-zinc-500 text-sm">App coming soon on</p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-white">
                <svg width="20" height="22" viewBox="0 0 512 512" fill="white">
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                </svg>
                <span className="text-sm font-medium">Google Play</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <svg width="18" height="22" viewBox="0 0 384 512" fill="white">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-62.1 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                </svg>
                <span className="text-sm font-medium">App Store</span>
              </div>
            </div>
          </div>

          <div className="text-zinc-600 text-sm">© 2026 ScalifyX. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
