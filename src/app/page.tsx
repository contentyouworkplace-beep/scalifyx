'use client';

import Link from 'next/link';
import Script from 'next/script';
import { BUSINESS_TYPES, WEBSITE_TEMPLATES } from '@/lib/constants';
import { Logo } from '@/components/Logo';
import {
  ChatBotIcon, PaletteIcon, PhoneIcon, SearchIcon, GlobeIcon,
  ChartIcon, WhatsAppIcon, ShieldIcon, HeadsetIcon,
  RestaurantIcon, ScissorsIcon, HospitalIcon, ScaleIcon, ShoppingBagIcon,
  DumbbellIcon, BookIcon, CameraIcon, CarIcon, HomeOutlineIcon, BriefcaseIcon, WrenchIcon,
} from '@/components/Icons';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const TOTAL_LAUNCH_SEATS = 1000;
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
  return TOTAL_LAUNCH_SEATS - taken;
}

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!';
  let pwd = '';
  for (let i = 0; i < 10; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
  return pwd;
}

function SignupForm({ spotsLeft }: { spotsLeft: number }) {
  const { signUp } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  useEffect(() => {
    if (!loading) return;
    const base = 'Launching your account';
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
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid phone number.'); return;
    }
    if (!email.trim()) { setError('Please enter your email.'); return; }

    setLoading(true);
    const autoPassword = generatePassword();
    const result = await signUp(email, autoPassword, name, phone);

    if (!result.success) {
      setError(result.error || 'Something went wrong. Please try again.');
      setLoading(false);
      return;
    }

    const waMessage = encodeURIComponent(
      `Hi ScalifyX! I just signed up. 🚀\n\nName: ${name}\nPhone: +91${phone}\nEmail: ${email}\n\nReady to launch my business website!`
    );
    window.open(`https://wa.me/916353583148?text=${waMessage}`, '_blank');
    router.replace('/dashboard');
  };

  return (
    <div id="signup-form" className="rounded-2xl border border-border bg-card p-7 sm:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="h-px w-5 bg-green-500" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-green-400">Live in 60 seconds</span>
        </div>
        <h2 className="text-2xl sm:text-[26px] font-extrabold text-white leading-[1.15]">
          Your next customer is already searching. Be there.
        </h2>
        <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
          Create your account — we send your enquiry to WhatsApp instantly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-xl border border-border bg-inputBg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-green-500/50 focus:outline-none transition"
          placeholder="Full name"
        />
        <div className="flex rounded-xl border border-border bg-inputBg overflow-hidden focus-within:border-green-500/50 transition">
          <span className="flex items-center px-4 text-zinc-500 text-sm border-r border-border select-none">+91</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            required
            className="flex-1 py-3 px-4 bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none"
            placeholder="Phone number"
          />
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-xl border border-border bg-inputBg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-green-500/50 focus:outline-none transition"
          placeholder="Email address"
        />
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-green-500 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-green-400 active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? loadingText : 'Create Account & Go Live →'}
        </button>
      </form>

      <div className="mt-5 pt-5 border-t border-border flex items-center justify-between text-xs text-zinc-700">
        <span>No setup fee</span>
        <span>·</span>
        <span>{spotsLeft} spots left</span>
        <span>·</span>
        <span>Cancel anytime</span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const spotsLeft = useSpotsTaken();

  const scrollToForm = () => {
    const target = document.getElementById('signup-form');
    if (!target) return;
    const y = target.getBoundingClientRect().top + window.pageYOffset - 120;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-bg text-white">
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-K97W1RGBXV" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-K97W1RGBXV');`}
      </Script>

      {/* ── ANNOUNCEMENT BAR ── */}
      <div className="fixed top-0 w-full z-[60] bg-gradient-to-r from-indigo-950 via-violet-950 to-indigo-950 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
          <p className="text-white/70 text-xs font-medium flex items-center gap-3 overflow-hidden">
            <span className="truncate">Your customers are searching right now — is your business showing up?</span>
            <span className="flex-shrink-0 bg-white/10 border border-white/10 rounded-full px-2.5 py-0.5 text-white font-bold text-xs">
              {spotsLeft} spots left
            </span>
          </p>
          <button
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="hidden sm:block flex-shrink-0 text-white/40 hover:text-white text-xs transition ml-1"
          >
            See how →
          </button>
        </div>
      </div>

      {/* ── NAV ── */}
      <nav className="fixed top-9 w-full z-50 bg-bg/85 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/"><Logo size={30} /></Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-zinc-500 hover:text-white text-sm transition">Features</a>
            <a href="#how-it-works" className="text-zinc-500 hover:text-white text-sm transition">How It Works</a>
            <a href="#templates" className="text-zinc-500 hover:text-white text-sm transition">Templates</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-zinc-500 hover:text-white transition px-3 py-2">Login</Link>
            <button
              onClick={scrollToForm}
              className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white text-sm font-bold rounded-lg transition"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-40 sm:pt-48 pb-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid gap-14 lg:grid-cols-[1.15fr_0.85fr] items-start">
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-8">
              <span className="h-px w-8 bg-zinc-800" />
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">India&apos;s Growth Platform for Small Businesses</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight mb-8">
              The Business<br />
              That Shows Up<br />
              <span className="text-green-400">Gets the Customer.</span>
            </h1>
            <p className="text-lg sm:text-xl text-zinc-400 max-w-lg leading-relaxed mb-10">
              We build your website, set up Local SEO, and connect every lead directly to your WhatsApp — in 60 seconds.
            </p>
            <div className="mb-10">
              <a
                href="#features"
                className="inline-block px-7 py-3.5 rounded-xl border border-border text-white text-sm font-semibold hover:border-white/25 transition"
              >
                See How It Works ↓
              </a>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-600">
              {['No agency needed', 'No tech skills required', 'Live in 60 seconds', 'Leads on WhatsApp daily'].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-green-500" />
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <SignupForm spotsLeft={spotsLeft} />
          </div>
        </div>
      </section>

      {/* ── MEMBERSHIP PLAN ── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 justify-center mb-5">
            <span className="h-px w-8 bg-zinc-800" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Membership</span>
            <span className="h-px w-8 bg-zinc-800" />
          </div>
          <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            One plan. Everything included.
          </h2>
          <p className="text-center text-zinc-500 text-sm mb-12 max-w-md mx-auto">
            No hidden fees. No setup cost. Just your business online — from day one.
          </p>

          <div className="max-w-sm mx-auto relative">
            {/* Best value badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <span className="bg-green-500 text-black text-[11px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-green-500/30">
                Best Value
              </span>
            </div>

            <div className="rounded-3xl border border-green-500/20 bg-gradient-to-b from-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-green-500/5">
              {/* Plan name */}
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-4">Growth Plan</p>

              {/* Price */}
              <div className="flex items-end gap-1 mb-2">
                <span className="text-4xl font-extrabold text-white leading-none">₹1,499</span>
                <span className="text-zinc-500 text-sm mb-1">/month</span>
              </div>
              <p className="text-zinc-600 text-xs mb-8">Billed monthly · Cancel anytime</p>

              {/* Feature list */}
              <ul className="space-y-3.5 mb-9">
                {[
                  'AI-Powered Business Website',
                  'Local SEO & Google Search Indexing',
                  'WhatsApp Lead Capture — Instant',
                  'Mobile-First Responsive Design',
                  'SSL Security & Managed Hosting',
                  'Analytics & Visitor Dashboard',
                  'Custom Domain Ready',
                  '10+ Professional Templates',
                  'Monthly Updates & Improvements',
                  '24/7 Priority Support',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/10 border border-green-500/25 flex items-center justify-center">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-sm text-zinc-300">{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#signup-form"
                className="block w-full text-center bg-green-500 hover:bg-green-400 text-black font-extrabold text-sm py-4 rounded-xl transition-all duration-200 shadow-lg shadow-green-500/20 hover:shadow-green-400/30 tracking-wide"
              >
                Get Started — ₹1,499/mo
              </a>

              <p className="text-center text-zinc-600 text-xs mt-4">No credit card required to sign up</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="py-14 border-y border-border">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-4">
          {[
            { num: '50,000+', label: 'Businesses Online' },
            { num: '60 sec', label: 'Average Setup Time' },
            { num: '99.9%', label: 'Uptime Guarantee' },
            { num: '12+', label: 'Industries Served' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{s.num}</div>
              <div className="text-xs text-zinc-600 font-semibold uppercase tracking-widest mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── THE PROBLEM — editorial ── */}
      <section className="py-28 px-4 sm:px-6 bg-surface/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center gap-3 justify-center mb-10">
            <span className="h-px w-8 bg-zinc-800" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">The Reality</span>
            <span className="h-px w-8 bg-zinc-800" />
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.0] tracking-tight mb-8">
            Right now, someone just<br className="hidden sm:block" />
            searched for your business.<br />
            <span className="text-zinc-700">They went to your competitor.</span>
          </h2>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed mb-10">
            Not because your competitor is better. Because they showed up on Google and you didn&apos;t. That&apos;s the only difference — and it&apos;s fixable in 60 seconds.
          </p>
          <button
            onClick={scrollToForm}
            className="px-8 py-4 bg-green-500 hover:bg-green-400 text-white text-base font-bold rounded-xl transition"
          >
            Get Found on Google Today
          </button>
        </div>
      </section>

      {/* ── LOCAL SEO ── */}
      <section className="py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-zinc-800" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Your #1 Growth Engine</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-[1.05] tracking-tight mb-6">
              The Moment They Search,<br />
              <span className="text-green-400">You Appear.</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-5">
              Someone types <span className="text-white">&ldquo;best salon near me&rdquo;</span> or <span className="text-white">&ldquo;doctor in Pune&rdquo;</span> — and your business is right there. We handle every layer of Local SEO: Google Search Console, meta tags, sitemaps, page speed, structured data. Done automatically.
            </p>
            <p className="text-zinc-600 text-base leading-relaxed mb-8">
              An SEO agency charges <span className="text-white font-semibold">₹8,000/month</span> for exactly this. On ScalifyX, it comes with your plan — on day one.
            </p>
            <button
              onClick={scrollToForm}
              className="px-7 py-3.5 bg-green-500 hover:bg-green-400 text-white text-sm font-bold rounded-xl transition"
            >
              Start Local SEO Setup →
            </button>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              <span className="ml-3 text-xs text-zinc-700 font-mono">google.com</span>
            </div>
            <div className="text-xs text-zinc-600 mb-5 font-mono bg-surface/50 rounded-lg px-3 py-2 border border-border">
              🔍 &quot;best salon near me&quot;
            </div>
            {[
              { name: 'Your Business', loc: 'Mumbai · 0.3 km', rating: '4.9', isYou: true },
              { name: 'Sharma Hair Studio', loc: 'Mumbai · 0.8 km', rating: '4.3', isYou: false },
              { name: 'Classic Cuts', loc: 'Mumbai · 1.2 km', rating: '4.1', isYou: false },
            ].map((r) => (
              <div
                key={r.name}
                className={`flex items-center justify-between p-3.5 rounded-xl mb-2 border transition ${r.isYou ? 'bg-green-500/10 border-green-500/25' : 'bg-surface/30 border-border'}`}
              >
                <div>
                  <div className={`text-sm font-semibold ${r.isYou ? 'text-green-400' : 'text-zinc-500'}`}>
                    {r.name}
                    {r.isYou && <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full font-bold">TOP</span>}
                  </div>
                  <div className="text-xs text-zinc-700 mt-0.5">{r.loc}</div>
                </div>
                <div className="text-xs text-yellow-500 font-bold">★ {r.rating}</div>
              </div>
            ))}
            <p className="text-xs text-zinc-700 mt-4 text-center">This is what customers see. You&apos;re at the top.</p>
          </div>
        </div>
      </section>

      {/* ── WHATSAPP ── */}
      <section className="py-28 px-4 sm:px-6 bg-surface/20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
              <div className="w-8 h-8 rounded-full bg-green-500/15 border border-green-500/20 flex items-center justify-center">
                <WhatsAppIcon size={15} className="text-green-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Priya Singh</div>
                <div className="text-xs text-zinc-600">New enquiry · just now</div>
              </div>
              <span className="ml-auto text-xs bg-green-500/10 text-green-400 font-bold px-2.5 py-1 rounded-full border border-green-500/20">Live</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-green-500/15 border border-green-500/20 rounded-2xl rounded-tr-sm px-4 py-2.5">
                  <p className="text-sm text-white">Hi! I found your salon on Google. Do you have slots this Saturday?</p>
                  <p className="text-xs text-zinc-600 mt-1 text-right">via your website · 2:41 PM</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-green-500/15 border border-green-500/20 rounded-2xl rounded-tr-sm px-4 py-2.5">
                  <p className="text-sm text-white">I&apos;d like to book a hair colour + trim.</p>
                  <p className="text-xs text-zinc-600 mt-1 text-right">2:41 PM</p>
                </div>
              </div>
              <div className="flex">
                <div className="max-w-[80%] bg-surface border border-border rounded-2xl rounded-tl-sm px-4 py-2.5">
                  <p className="text-sm text-zinc-300">Yes! Saturday 11am is open. Shall I confirm?</p>
                  <p className="text-xs text-zinc-600 mt-1">You · 2:43 PM ✓✓</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-zinc-700 mt-5 text-center">This is your inbox. Real customers. No middleman.</p>
          </div>
          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-zinc-800" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Direct Lead Capture</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-[1.05] tracking-tight mb-6">
              Leads Arrive on Your Phone.<br />
              <span className="text-green-400">Instantly. Personally.</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-5">
              Every visitor sees one button — WhatsApp. They tap it, they&apos;re in your chat. You reply, you close. No CRM. No form submissions to chase. No email threads that go nowhere.
            </p>
            <p className="text-zinc-600 text-base leading-relaxed mb-8">
              Just real customers — on the phone that&apos;s already in your hand.
            </p>
            <button
              onClick={scrollToForm}
              className="px-7 py-3.5 bg-green-500 hover:bg-green-400 text-white text-sm font-bold rounded-xl transition"
            >
              Start Getting Leads on WhatsApp →
            </button>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-28 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <div className="flex items-center gap-3 justify-center mb-6">
              <span className="h-px w-8 bg-zinc-800" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">How It Works</span>
              <span className="h-px w-8 bg-zinc-800" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]">
              From Invisible to Found.<br />
              <span className="text-green-400">In 60 Seconds.</span>
            </h2>
            <p className="mt-5 text-zinc-500 max-w-lg mx-auto text-lg">
              No code. No calls. No waiting. Three steps between you and customers finding you on Google.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                step: '01',
                title: 'Tell Us Who You Are',
                desc: 'Name, phone, email. Done in under 30 seconds. No credit card. No paperwork. Your account is live the moment you hit submit.',
                cta: true,
              },
              {
                step: '02',
                title: 'We Build Everything',
                desc: 'Our AI reads your business type and city, then writes your copy, designs your pages, sets up Local SEO, and wires your WhatsApp — automatically.',
                cta: false,
              },
              {
                step: '03',
                title: 'Leads Start Coming In',
                desc: 'Your site goes live. Google indexes it. Customers find you. They tap WhatsApp. You close the deal from the phone in your pocket.',
                cta: false,
              },
            ].map((s) => (
              <div key={s.step} className="p-8 rounded-2xl border border-border bg-card flex flex-col">
                <div className="text-7xl font-extrabold text-white/[0.04] mb-5 leading-none select-none">{s.step}</div>
                <h3 className="text-base font-bold text-white mb-3">{s.title}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed flex-1">{s.desc}</p>
                {s.cta && (
                  <button
                    onClick={scrollToForm}
                    className="mt-6 w-full py-3 bg-green-500 hover:bg-green-400 text-white rounded-xl font-bold text-sm transition"
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
      <section id="features" className="py-28 px-4 sm:px-6 bg-surface/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="flex items-center gap-3 justify-center mb-6">
              <span className="h-px w-8 bg-zinc-800" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">What You Get</span>
              <span className="h-px w-8 bg-zinc-800" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]">
              Your Entire Digital Presence.<br />
              <span className="text-green-400">Built by AI. Managed by Us.</span>
            </h2>
            <p className="mt-5 text-zinc-500 max-w-xl mx-auto text-lg">
              Everything a ₹50,000/year agency delivers — done for you automatically, without a single briefing call.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                Icon: ChatBotIcon,
                title: 'AI Website Builder',
                desc: 'Describe your business in plain language. AI writes the copy, designs the pages, and publishes it — without you touching a line of code.',
                included: true,
              },
              {
                Icon: SearchIcon,
                title: 'Local SEO — Done for You',
                desc: 'Search Console, meta tags, sitemaps, structured data. All of it, handled automatically. You rank, you get found, you get customers.',
                included: true,
              },
              {
                Icon: WhatsAppIcon,
                title: 'Leads Land on WhatsApp',
                desc: 'Every visitor sees one button. They tap. They\'re in your chat. You close from your phone. No form. No delay. No middleman.',
                included: true,
              },
              {
                Icon: PhoneIcon,
                title: 'Mobile-First Design',
                desc: 'Your customers are on their phones. Your site loads instantly, looks flawless, and converts on every screen and every network.',
                included: true,
              },
              {
                Icon: ShieldIcon,
                title: 'Hosting + SSL',
                desc: 'Enterprise-grade servers. 99.9% uptime. SSL certificate. Google trusts you from day one — and so do your customers.',
                included: true,
              },
              {
                Icon: GlobeIcon,
                title: 'Live Domain in Seconds',
                desc: 'yourbusiness.scalifyx.com the moment you sign up. Add your own .com or .in domain anytime — one click.',
                included: true,
              },
              {
                Icon: PaletteIcon,
                title: '12+ Industry Templates',
                desc: 'Restaurant to clinic. Salon to law firm. Gym to coaching. Every template is built for conversion, not just to look good.',
                included: true,
              },
              {
                Icon: ChartIcon,
                title: 'Analytics Dashboard',
                desc: 'Who visited. Where they came from. Which page made them message you. Monthly SEO performance reports — to your inbox.',
                included: false,
              },
              {
                Icon: HeadsetIcon,
                title: '24/7 Support',
                desc: 'Real people watching your site around the clock. AI-backed so response time is instant. Problems fixed before you notice them.',
                included: false,
              },
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border border-border bg-card hover:border-white/10 transition group">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl border border-border bg-white/[0.03] flex items-center justify-center text-zinc-600 group-hover:text-green-400 group-hover:border-green-500/20 transition">
                    <f.Icon size={20} />
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${f.included ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-violet-500/10 border-violet-500/20 text-violet-400'}`}>
                    {f.included ? 'INCLUDED' : 'PRO'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 text-center">
            <button
              onClick={scrollToForm}
              className="px-10 py-4 bg-green-500 hover:bg-green-400 text-white text-base font-bold rounded-xl transition"
            >
              Get Everything — Start Today
            </button>
            <p className="mt-3 text-zinc-700 text-sm">Only {spotsLeft} launch seats remaining</p>
          </div>
        </div>
      </section>

      {/* ── TEMPLATES ── */}
      <section id="templates" className="py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center gap-3 justify-center mb-6">
              <span className="h-px w-8 bg-zinc-800" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Industry Templates</span>
              <span className="h-px w-8 bg-zinc-800" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]">
              Your Industry. Your Design.<br />
              <span className="text-green-400">Ready.</span>
            </h2>
            <p className="mt-5 text-zinc-500 max-w-lg mx-auto">
              Pick a template built for your trade — or let AI design something entirely yours. Either way, you&apos;re live in seconds.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {WEBSITE_TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={scrollToForm}
                className="p-5 rounded-2xl border border-border bg-card hover:border-green-500/25 hover:bg-green-500/[0.03] transition text-left group"
              >
                <div className="w-8 h-8 rounded-lg border border-border bg-white/[0.03] flex items-center justify-center text-zinc-600 group-hover:text-green-400 group-hover:border-green-500/20 transition mb-3">
                  <PaletteIcon size={16} />
                </div>
                <h4 className="text-sm font-semibold text-white group-hover:text-green-400 transition leading-snug">{t.name}</h4>
                <p className="text-xs text-zinc-700 mt-1">{t.preview}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUSINESS TYPES ── */}
      <section id="business" className="py-20 px-4 sm:px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Every Business. One Platform.
            </h2>
            <p className="mt-4 text-zinc-500 max-w-lg mx-auto">
              Your competitors already have websites. Now you have one that wins.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
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
                  onClick={scrollToForm}
                  className="p-4 rounded-xl border border-border bg-card hover:border-green-500/25 hover:bg-green-500/[0.03] transition text-center group"
                >
                  <div className="w-9 h-9 mx-auto rounded-lg border border-border bg-white/[0.03] flex items-center justify-center text-zinc-600 group-hover:text-green-400 group-hover:border-green-500/20 transition mb-2">
                    <BizIcon size={18} />
                  </div>
                  <div className="text-sm font-medium text-zinc-500 group-hover:text-white transition">{b.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-28 px-4 sm:px-6 bg-surface/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center gap-3 justify-center mb-6">
              <span className="h-px w-8 bg-zinc-800" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Customer Stories</span>
              <span className="h-px w-8 bg-zinc-800" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]">
              They Used to Miss Leads.<br />
              <span className="text-green-400">Now They Don&apos;t.</span>
            </h2>
            <p className="mt-4 text-zinc-500">Real businesses. Real leads. Real results — not projections.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                name: 'Priya S.',
                biz: 'Salon Owner, Pune',
                quote: '12 WhatsApp enquiries on day one. Not a single ad. People just found me on Google and messaged directly.',
              },
              {
                name: 'Dr. Rahul M.',
                biz: 'Dentist, Mumbai',
                quote: 'Patients search "dentist near me" and I show up. New appointments doubled in 2 months. My old agency couldn\'t do this in 2 years.',
              },
              {
                name: 'Ankit T.',
                biz: 'Tutor, Delhi',
                quote: 'Described my tutoring centre, was live in under a minute. Parents WhatsApp me directly now. Closed 4 new students that week.',
              },
            ].map((t) => (
              <div key={t.name} className="p-7 rounded-2xl border border-border bg-card">
                <div className="text-5xl text-zinc-800 font-serif leading-none mb-5 select-none">&ldquo;</div>
                <p className="text-zinc-300 text-sm leading-relaxed mb-6">{t.quote}</p>
                <div className="flex items-center gap-3 pt-5 border-t border-border">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold select-none">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{t.name}</div>
                    <div className="text-zinc-600 text-xs">{t.biz}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-32 px-4 sm:px-6 border-y border-border">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-10 border border-violet-500/20 bg-violet-500/10 rounded-full text-violet-400 text-xs font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            {spotsLeft} launch seats remaining
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight mb-8">
            Your Competitor<br />
            Is on Google.<br />
            <span className="text-green-400">Are You?</span>
          </h2>
          <p className="text-zinc-500 text-lg mb-5 max-w-xl mx-auto leading-relaxed">
            Right now, someone is searching for exactly what you offer. If you&apos;re not showing up — they go to whoever is. That customer is gone. It happens a hundred times a day. ScalifyX ends that.
          </p>
          <p className="text-green-400 font-bold text-lg mb-12">
            Professional Website · Local SEO · WhatsApp leads · Working while you sleep.
          </p>
          <button
            onClick={scrollToForm}
            className="px-14 py-5 bg-green-500 hover:bg-green-400 text-white text-lg font-extrabold rounded-2xl transition"
          >
            Get Started — Go Live Today
          </button>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-700">
            {['No credit card required', 'Cancel anytime', 'Live in 60 seconds'].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-border">
            <Link href="/"><Logo size={28} /></Link>
            <div className="flex gap-8 text-sm text-zinc-600">
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#templates" className="hover:text-white transition">Templates</a>
              <a href="#business" className="hover:text-white transition">Business Types</a>
              <Link href="/login" className="hover:text-white transition">Login</Link>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8">
            <p className="text-zinc-700 text-sm">© 2026 ScalifyX. All rights reserved.</p>
            <div className="flex items-center gap-4 text-zinc-600 text-sm">
              <span>App coming soon on</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition cursor-default">
                  <svg width="13" height="15" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                  </svg>
                  Google Play
                </span>
                <span className="text-zinc-800">·</span>
                <span className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition cursor-default">
                  <svg width="11" height="15" viewBox="0 0 384 512" fill="currentColor">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-62.1 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                  </svg>
                  App Store
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
