'use client';

import Link from 'next/link';
import Script from 'next/script';
import Image from 'next/image';
import { Logo } from '@/components/Logo';
import { SearchConsoleStats } from '@/components/SearchConsoleStats';
import {
  ChatBotIcon, PhoneIcon, SearchIcon, GlobeIcon,
  ChartIcon, WhatsAppIcon, ShieldIcon, HeadsetIcon,
} from '@/components/Icons';
import React, { useState, useEffect, useRef } from 'react';

const TOTAL_LAUNCH_SEATS = 1000;
const SPOTS_TAKEN_KEY = 'sxSpotsTaken';

const DEMO_WEBSITES = [
  { title: "Friends Factory Cafe", subtitle: 'Cafe Business', url: 'https://friendsfactorycafe.com/', image: '/screenshots/1.png' },
  { title: 'Wedding Planner Vadodara', subtitle: 'Wedding Planning', url: 'https://weddingplannervadodara.in/', image: '/screenshots/2.png' },
  { title: 'Waterproofing Vadodara', subtitle: 'Construction Services', url: 'https://waterproofingvadodara.com/', image: '/screenshots/3.png' },
  { title: 'Interior Design Vadodara', subtitle: 'Interior Design', url: 'https://interiordesignvadodara.in/', image: '/screenshots/4.png' },
  { title: 'Solar Installation', subtitle: 'Solar Energy', url: 'https://solarinstallationvadodara.in/', image: '/screenshots/5.png' },
  { title: 'Wow Shaadi', subtitle: 'Wedding Services', url: 'https://wowshaadi.com/', image: '/screenshots/6.png' },
];

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

function LeadForm() {
  const [form, setForm] = useState({ name: '', category: '', phone: '', bizType: '', website: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const planFeatures = [
    'On-Page & Technical SEO',
    'Google Search Console Setup',
    'Local SEO — City & Near Me Keywords',
    'Google Business Profile Optimisation',
    'Monthly SEO & Analytics Report',
    'Keyword Research for Your Business',
    'Meta Tags, Sitemaps & Structured Data',
    'Competitor SEO Analysis',
    'Google Map / Local Pack Ranking',
    'Priority Chat Support',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Please enter your company name.'); return; }
    if (!form.category.trim()) { setError('Please enter your business category.'); return; }
    if (form.phone.replace(/\D/g, '').length < 10) { setError('Please enter a valid WhatsApp number.'); return; }
    if (!form.bizType) { setError('Please select your business type.'); return; }

    setLoading(true);
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead');
    }

    const msg = [
      `Hi! I'm interested in getting my business ranked on Google with Scalify SEO.`,
      ``,
      `Company: ${form.name}`,
      `Category: ${form.category}`,
      `Business Type: ${form.bizType}`,
      `WhatsApp: +91${form.phone}`,
      form.website ? `Website: ${form.website}` : null,
      ``,
      `Please share the registration link.`,
    ].filter(l => l !== null).join('\n');

    window.open(`https://wa.me/916353583138?text=${encodeURIComponent(msg)}`, '_blank');
    setLoading(false);
  };

  return (
    <div id="signup-form" className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-[1.15] mb-2">
          Get Found on Google Today
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500">
          Local SEO done for you — ₹3,999/month
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5 mb-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1">
            Company Name <span className="text-zinc-600 font-normal">(don't write your personal name)</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
            required
            className="w-full rounded-lg border border-border bg-inputBg px-3 py-2 text-xs sm:text-sm text-white placeholder-zinc-600 focus:border-green-500/50 focus:outline-none transition"
            placeholder="e.g. Sharma Electricals, Priya Salon"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1">
            Business Category <span className="text-zinc-600 font-normal">(what type of business?)</span>
          </label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
            required
            className="w-full rounded-lg border border-border bg-inputBg px-3 py-2 text-xs sm:text-sm text-white placeholder-zinc-600 focus:border-green-500/50 focus:outline-none transition"
            placeholder="e.g. Salon, Restaurant, Clinic, Gym"
          />
        </div>
        <div className="flex rounded-lg border border-border bg-inputBg overflow-hidden focus-within:border-green-500/50 transition">
          <span className="flex items-center px-3 text-zinc-500 text-xs sm:text-sm border-r border-border select-none">+91</span>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
            required
            className="flex-1 py-2 px-3 bg-transparent text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none"
            placeholder="WhatsApp number"
          />
        </div>
        <select
          required
          value={form.bizType}
          onChange={(e) => setForm(f => ({ ...f, bizType: e.target.value }))}
          className="w-full rounded-lg border border-border bg-inputBg px-3 py-2 text-xs sm:text-sm focus:border-green-500/50 focus:outline-none transition appearance-none"
          style={{ color: form.bizType ? '#fff' : '#52525b' }}
        >
          <option value="" disabled>I am a... *</option>
          <option value="Small Business Owner">Small Business Owner</option>
          <option value="Freelancer">Freelancer</option>
          <option value="Agency / Marketing Team">Agency / Marketing Team</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="text"
          value={form.website}
          onChange={(e) => setForm(f => ({ ...f, website: e.target.value }))}
          className="w-full rounded-lg border border-border bg-inputBg px-3 py-2 text-xs sm:text-sm text-white placeholder-zinc-600 focus:border-green-500/50 focus:outline-none transition"
          placeholder="Your website URL (optional)"
        />
        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-green-500 px-3 py-2.5 text-xs sm:text-sm font-bold text-white transition hover:bg-green-400 active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? 'Opening WhatsApp...' : 'Get Started — Chat on WhatsApp →'}
        </button>
      </form>

      <div className="space-y-2 pt-3 border-t border-border">
        <p className="text-xs text-zinc-400 font-semibold mb-2">What you get:</p>
        {planFeatures.map((feature) => (
          <div key={feature} className="flex items-start gap-2">
            <span className="flex-shrink-0 w-3.5 h-3.5 rounded-full bg-green-500/10 border border-green-500/25 flex items-center justify-center mt-0.5">
              <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-xs text-zinc-400">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const FAQS = [
  {
    q: 'How much does Scalify cost?',
    a: 'Scalify Pro is ₹3,999/month. No setup fee, no hidden charges. Cancel anytime. Pay manually each month — no auto-debit.',
  },
  {
    q: 'What exactly do I get for ₹3,999/month?',
    a: 'Complete Local SEO done for you: Google Search Console setup, on-page & technical SEO, keyword research, meta tags, sitemaps, structured data, Google Business Profile optimisation, city & near-me keyword targeting, competitor analysis, and a monthly ranking report.',
  },
  {
    q: 'How does Local SEO work? Will I actually rank on Google?',
    a: 'We set up Google Search Console, optimise meta tags, build your sitemap, add structured data, and target "near me" keywords for your city. Most businesses start appearing in local searches within 2–4 months. An SEO agency charges ₹8,000/month for exactly this — it\'s included in your plan.',
  },
  {
    q: 'How long before I see results?',
    a: 'SEO takes time — typically 2 to 4 months to see meaningful ranking movement. We start your technical setup immediately, submit your sitemap to Google, and track progress every month with a detailed report.',
  },
  {
    q: 'Do you need access to my website?',
    a: 'Yes — we\'ll need access to your website (WordPress, Wix, Squarespace, or any platform) to implement on-page SEO changes. We guide you through the process step by step.',
  },
  {
    q: 'How do I pay?',
    a: 'Payment is via Razorpay — India\'s most trusted payment gateway. Pay ₹3,999/month manually each month. No auto-debit, no hidden charges, no setup fee. Cancel anytime.',
  },
  {
    q: 'Is Scalify legitimate? Can I trust you?',
    a: 'Absolutely. We use Razorpay (India\'s most trusted payment gateway), issue GST invoices for every payment, and your data is always yours.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes — no lock-in contracts. Cancel anytime with one click. You keep access until the end of your current billing month. Your data and content are always yours.',
  },
  {
    q: 'What industries does Scalify support?',
    a: 'All of them! We have templates for restaurants, salons, doctors, lawyers, gyms, coaching centers, photographers, real estate agents, retail shops, NGOs, and more. Or describe your business and our AI creates something unique.',
  },
];

function FAQSection() {
  const [open, setOpen] = React.useState<number | null>(null);
  return (
    <section className="py-28 px-4 sm:px-6 border-t border-border">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <div className="flex items-center gap-3 justify-center mb-6">
            <span className="h-px w-8 bg-zinc-800" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">FAQ</span>
            <span className="h-px w-8 bg-zinc-800" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]">
            Everything You Want<br />
            <span className="text-green-400">To Know.</span>
          </h2>
          <p className="mt-4 text-zinc-500 text-lg">Honest answers. No fluff.</p>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-sm sm:text-base font-semibold text-white leading-snug">{faq.q}</span>
                <span className={`flex-shrink-0 w-6 h-6 rounded-full border border-border flex items-center justify-center transition-transform ${open === i ? 'rotate-45 border-green-500/50 text-green-400' : 'text-zinc-500'}`}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                    <path d="M4 0h2v10H4zM0 4h10v2H0z" />
                  </svg>
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


export default function LandingPage() {
  const spotsLeft = useSpotsTaken();
const pricingRef = useRef<HTMLDivElement>(null);
  const viewContentFired = useRef(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  useEffect(() => {
    const el = pricingRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !viewContentFired.current) {
          viewContentFired.current = true;
          if (typeof window !== 'undefined' && (window as any).fbq) {
            const eventId = `vc_landing_${Date.now()}`;
            (window as any).fbq('track', 'ViewContent', { content_name: 'Scalify Pro Pricing', currency: 'INR', value: 1499 }, { eventID: eventId });
          }
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
            <span className="truncate">Your customers are searching on Google right now — is your business ranking?</span>
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
            <a href="#features" className="text-zinc-500 hover:text-white text-sm transition">What We Do</a>
            <a href="#pricing" className="text-zinc-500 hover:text-white text-sm transition">Pricing</a>
            <a href="#faq" className="text-zinc-500 hover:text-white text-sm transition">FAQ</a>
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
        <div className="max-w-7xl mx-auto grid gap-14 lg:gap-12 lg:grid-cols-2 items-start">
          {/* Left: CTA Section */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="h-px w-8 bg-zinc-800" />
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Local SEO for Small Businesses — India</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-5xl font-extrabold leading-[0.95] tracking-tight mb-8">
              The Business<br />
              That Shows Up<br />
              <span className="text-green-400">Gets the Customer.</span>
            </h1>
            <p className="text-lg sm:text-xl text-zinc-400 max-w-lg leading-relaxed mb-10">
              We do your Local SEO — Google Search Console, keyword research, on-page optimisation, and Google Maps ranking. You focus on your business. We get you found.
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-600 mb-8 pb-8 border-b border-border">
              {['No agency needed', 'Done-for-you SEO', 'Rank in 2–4 months', 'Monthly ranking reports'].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-green-500" />
                  {t}
                </span>
              ))}
            </div>

            <div className="text-sm text-zinc-600">
              <p className="mb-2">✓ Secure payment via Razorpay · ✓ No auto-debit · ✓ Cancel anytime</p>
            </div>
          </div>

          {/* Right: Lead Form */}
          <div ref={pricingRef} className="lg:sticky lg:top-24">
            <LeadForm />
          </div>
        </div>
      </section>

      {/* ── PRICING TABLE ── */}
      <section id="pricing" className="py-20 px-4 sm:px-6 border-t border-border bg-zinc-950">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-extrabold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
              🔥 Limited offer — First 500 people only
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] mb-3">
              One Plan. <span className="text-green-400">Everything Included.</span>
            </h2>
            <p className="text-zinc-500 text-lg">No hidden fees. No agency bills. Cancel anytime.</p>
          </div>

          {/* Price highlight bar */}
          <div className="rounded-2xl bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/20 p-6 sm:p-8 mb-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-end gap-4">
              <div>
                <p className="text-zinc-500 text-sm mb-1">Regular price</p>
                <span className="text-zinc-500 line-through text-3xl font-bold">₹5,000</span>
              </div>
              <div className="w-px h-12 bg-zinc-700" />
              <div>
                <p className="text-green-400 text-sm font-bold mb-1">Your price today</p>
                <div className="flex items-end gap-2">
                  <span className="text-6xl font-black text-white leading-none">₹3,999</span>
                  <span className="text-zinc-400 text-lg mb-1">/month</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center sm:items-end gap-3">
              <div className="flex gap-3 flex-wrap justify-center sm:justify-end">
                <span className="px-4 py-2 bg-green-500 text-black text-sm font-extrabold rounded-xl">
                  💰 You save ₹1,000/month
                </span>
                <span className="px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-extrabold rounded-xl">
                  ₹12,000 saved/year
                </span>
              </div>
              <p className="text-zinc-600 text-xs">Billed monthly · No auto-debit · Cancel anytime</p>
            </div>
          </div>

          {/* Feature table */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x-0">
              {[
                ['🔍', 'On-Page SEO', 'Title tags, meta descriptions, headings, image alt text — fully optimised'],
                ['📍', 'Local SEO & Google Maps', 'Rank for city + near me searches. Show up where your customers look'],
                ['🗺️', 'Google Business Profile', 'Setup, optimisation & regular updates to your GBP listing'],
                ['🔧', 'Technical SEO', 'Site speed, crawl errors, canonical tags, XML sitemap, robots.txt'],
                ['🎯', 'Keyword Research', 'Find exactly what your customers type — and rank for those terms'],
                ['📊', 'Google Search Console', 'Full setup, verification, sitemap submission & monthly monitoring'],
                ['📈', 'Monthly Ranking Report', 'Clicks, impressions, position tracking — delivered every month'],
                ['🔎', 'Competitor SEO Analysis', 'See what your competitors rank for and close the gap'],
                ['🏗️', 'Schema & Structured Data', 'LocalBusiness, FAQ & breadcrumb markup for better visibility'],
                ['📝', 'Content SEO Guidance', 'What pages to add, what to write, how to structure your content'],
                ['🔗', 'Internal Linking Strategy', 'Connect your pages to pass authority and improve rankings'],
                ['🛡️', 'Priority Chat Support', 'Real humans. Fast replies. Questions answered — always.'],
              ].map(([icon, title, desc]) => (
                <div key={title} className="flex items-start gap-4 px-6 py-5 border-b border-border last:border-b-0 sm:even:border-l sm:border-b hover:bg-white/[0.02] transition">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{icon}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-bold text-white">{title}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={scrollToForm}
              className="inline-block px-12 py-4 bg-green-500 hover:bg-green-400 text-black font-extrabold text-lg rounded-xl transition shadow-xl shadow-green-500/20"
            >
              Get Started — ₹3,999/month →
            </button>
            <p className="mt-3 text-zinc-600 text-sm">Offer valid for first 500 people only · Price goes up after that</p>
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
              Everything in SEO.<br />
              <span className="text-green-400">Done for You.</span>
            </h2>
            <p className="mt-5 text-zinc-500 max-w-xl mx-auto text-lg">
              An SEO agency charges ₹8,000–15,000/month for this. We do it all for ₹3,999/month — no contracts, no fluff.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                Icon: SearchIcon,
                title: 'Local SEO — Done for You',
                desc: 'Search Console, meta tags, sitemaps, structured data. All of it handled. You rank, you get found, you get customers.',
                included: true,
              },
              {
                Icon: GlobeIcon,
                title: 'Google Business Profile',
                desc: 'Full setup & optimisation of your GBP listing so you appear on Google Maps and the local pack for your city.',
                included: true,
              },
              {
                Icon: ChartIcon,
                title: 'Keyword Research',
                desc: 'We find exactly what your customers type into Google — then optimise your pages to rank for those terms.',
                included: true,
              },
              {
                Icon: ShieldIcon,
                title: 'Technical SEO',
                desc: 'Site speed, crawl errors, XML sitemap, canonical tags, robots.txt — all fixed and maintained for you.',
                included: true,
              },
              {
                Icon: ChatBotIcon,
                title: 'On-Page SEO',
                desc: 'Title tags, meta descriptions, headings, image alt text, internal linking — every page fully optimised.',
                included: true,
              },
              {
                Icon: PhoneIcon,
                title: 'Schema & Structured Data',
                desc: 'LocalBusiness, FAQ, and breadcrumb schema so Google understands your business and shows rich results.',
                included: true,
              },
              {
                Icon: ChartIcon,
                title: 'Monthly Ranking Report',
                desc: 'Clicks, impressions, position tracking and SEO progress — a clear report delivered to you every month.',
                included: true,
              },
              {
                Icon: HeadsetIcon,
                title: 'Priority Chat Support',
                desc: 'SEO questions? Stuck on something? Message us anytime. Real people, fast replies.',
                included: true,
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
              Get Started — ₹3,999/month
            </button>
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO SECTION ── */}
      <section id="portfolio" className="py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center gap-3 justify-center mb-6">
              <span className="h-px w-8 bg-zinc-800" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Built & Live</span>
              <span className="h-px w-8 bg-zinc-800" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] mb-4">
              Beautiful Websites<br />
              <span className="text-green-400">We've Built</span>
            </h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto">750+ businesses across industries. All starting at ₹3,999/month.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEMO_WEBSITES.map((demo, idx) => (
              <a
                key={idx}
                href={demo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-2xl overflow-hidden border border-border hover:border-green-500/50 transition-all duration-300 h-64 sm:h-72"
              >
                <Image
                  src={demo.image}
                  alt={demo.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className="absolute inset-0 flex flex-col justify-between p-4">
                  <div />
                  <div className="bg-gradient-to-t from-black/80 to-transparent pt-8 pb-2">
                    <h3 className="text-white font-semibold text-lg">{demo.title}</h3>
                    <p className="text-green-400 text-sm">{demo.subtitle}</p>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-green-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <p className="text-white text-sm font-semibold">Click to explore</p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <p className="text-center text-zinc-500 text-sm mt-10">All live websites built with our service. Click any to see them in action.</p>
        </div>
      </section>

      {/* ── MEMBER RESULTS ── */}
      <SearchConsoleStats />

      {/* ── FAQs ── */}
      <section id="faq">
        <FAQSection />
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
            Not because your competitor is better. Because they showed up on Google and you didn&apos;t. That&apos;s the only difference — and SEO fixes it.
          </p>
          <button
            onClick={scrollToForm}
            className="px-8 py-4 bg-green-500 hover:bg-green-400 text-white text-base font-bold rounded-xl transition"
          >
            Get Found on Google Today
          </button>
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
              Get Started — ₹3,999/month
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
                title: 'Create Your Account',
                desc: 'Name, phone, email, password — done in 30 seconds. Pay securely via Razorpay and your account goes live instantly.',
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
                    Get Started — ₹3,999/month
                  </button>
                )}
              </div>
            ))}
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
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight mb-8">
            Your Competitor<br />
            Is on Google.<br />
            <span className="text-green-400">Are You?</span>
          </h2>
          <p className="text-zinc-500 text-lg mb-5 max-w-xl mx-auto leading-relaxed">
            Right now, someone is searching for exactly what you offer. If you&apos;re not showing up — they go to whoever is. That customer is gone. It happens a hundred times a day. Scalify ends that.
          </p>
          <p className="text-green-400 font-bold text-lg mb-12">
            Local SEO · Google Maps · Search Console · Monthly Reports · Done for You.
          </p>
          <button
            onClick={scrollToForm}
            className="px-14 py-5 bg-green-500 hover:bg-green-400 text-white text-lg font-extrabold rounded-2xl transition"
          >
            Get Started — ₹3,999/month
          </button>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-700">
            {['Secure payment via Razorpay', 'Cancel anytime', 'No auto-debit'].map((t) => (
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
              <a href="#portfolio" className="hover:text-white transition">Portfolio</a>
              <a href="#faq" className="hover:text-white transition">FAQ</a>
              <Link href="/login" className="hover:text-white transition">Login</Link>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-5 py-6 border-b border-border text-sm text-zinc-600">
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/refund" className="hover:text-white transition">Refund Policy</Link>
            <Link href="/shipping" className="hover:text-white transition">Shipping</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8">
            <p className="text-zinc-700 text-sm">© 2026 Scalify. All rights reserved.</p>
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
