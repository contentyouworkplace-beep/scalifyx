'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

function useCountdown(targetDate: Date) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) { setTime({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

function useInView(ref: React.RefObject<Element | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

function AnimSection({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const WEBINAR_DATE = new Date('2026-07-02T16:00:00+05:30');

// Custom premium SVGs replacing emojis
const MicrophoneIcon = (
  <svg className="w-3.5 h-3.5 text-cyan-400 mr-1.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
  </svg>
);

const ClockIcon = (
  <svg className="w-3.5 h-3.5 text-slate-300 mr-1.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const GiftIcon = (
  <svg className="w-3.5 h-3.5 text-slate-300 mr-1.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h17.25c.621 0 1.125-.504 1.125-1.125V8.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
  </svg>
);

const CheckIcon = (
  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const CalendarIcon = (
  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75" />
  </svg>
);

const LEARNS = [
  {
    icon: (
      <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
      </svg>
    ),
    text: 'Why your competitors rank higher — and exactly how to beat them'
  },
  {
    icon: (
      <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-2.23 2.23m2.23-2.23A12.016 12.016 0 0018 7.5" />
      </svg>
    ),
    text: 'The 3-step SEO framework that works for any business in India'
  },
  {
    icon: (
      <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21m-9-3a3 3 0 100 6 3 3 0 000-6z" />
      </svg>
    ),
    text: 'How to pick keywords your ideal customers are actually searching'
  },
  {
    icon: (
      <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519" />
      </svg>
    ),
    text: 'What Google looks for in 2025 (most businesses get this wrong)'
  },
  {
    icon: (
      <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.214.113a3.433 3.433 0 003.957-.495l.024-.025M16.5 12h-9" />
      </svg>
    ),
    text: 'How to turn website visitors into paying customers'
  },
  {
    icon: (
      <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A1.5 1.5 0 0019.5 21l2.25-2.25a1.5 1.5 0 000-2.25l-5.83-5.83" />
      </svg>
    ),
    text: 'Live website audit — see real mistakes fixed in real time'
  }
];

const BONUSES = [
  { num: '01', title: 'SEO Checklist PDF', desc: '47-point checklist to audit your website today', value: '₹2,000' },
  { num: '02', title: 'Keyword Research Template', desc: 'Ready-to-use Google Sheets template', value: '₹1,500' },
  { num: '03', title: 'Competitor Analysis Guide', desc: 'Spy on what\'s working for your rivals', value: '₹1,500' },
  { num: '04', title: 'Local SEO Blueprint', desc: 'Dominate your city on Google Maps & Search', value: '₹2,500' },
  { num: '05', title: 'Content Calendar Template', desc: '90 days of content ideas pre-planned', value: '₹1,000' },
  { num: '06', title: '1-on-1 Strategy Session', desc: '15-minute free call with me after the webinar', value: '₹5,000' },
];

export default function SeoWebinarPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', whatsapp: '', company: '', pain_point: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const countdown = useCountdown(WEBINAR_DATE);
  const formRef = useRef<HTMLDivElement>(null);

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.whatsapp.trim() || !form.company.trim() || !form.pain_point.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(form.whatsapp.replace(/\s/g, ''))) {
      setError('Please enter a valid 10-digit WhatsApp number.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/seo-webinar/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Registration failed');
      router.push('/seo-webinar/success');
    } catch {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 font-sans overflow-x-hidden antialiased selection:bg-cyan-500 selection:text-slate-900">
      
      {/* Dynamic Keyframes for Glow Buttons (funnel style) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        @keyframes pulseBorder {
          0%, 100% {
            border-color: rgba(255, 107, 53, 0.4);
            box-shadow: 0 0 12px rgba(255, 107, 53, 0.2), inset 0 0 6px rgba(255, 107, 53, 0.1);
          }
          50% {
            border-color: rgba(255, 107, 53, 1);
            box-shadow: 0 0 24px rgba(255, 107, 53, 0.6), inset 0 0 12px rgba(255, 107, 53, 0.3);
          }
        }

        .lightning-btn {
          position: relative;
          background: linear-gradient(135deg, #FF6B35, #ff8454);
          border: 2px solid rgba(255, 107, 53, 0.5);
          animation: pulseBorder 2s infinite ease-in-out;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .lightning-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.08);
          box-shadow: 0 0 28px rgba(255, 107, 53, 0.7);
        }

        .premium-card {
          background: rgba(30, 41, 59, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .premium-card:hover {
          border-color: rgba(6, 182, 212, 0.3);
          background: rgba(30, 41, 59, 0.55);
        }
      `}</style>

      {/* FLOAT HEADER */}
      <header className="absolute top-0 left-0 right-0 h-20 flex items-center justify-between px-6 sm:px-8 z-40 bg-transparent">
        <div className="text-xl sm:text-2xl font-black text-white tracking-tight select-none">
          Scalify
        </div>
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] sm:text-xs font-black tracking-wider px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md shadow-black/10">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
          LIMITED SEATS AVAILABLE
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-0 overflow-hidden bg-slate-900 border-b border-white/5">
        {/* Soft background glows */}
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-15 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-15%] w-[45%] aspect-square bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-10%] right-[-15%] w-[45%] aspect-square bg-gradient-to-tl from-indigo-600 to-purple-500 rounded-full blur-[140px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end">
            
            {/* COLUMN 1: HERO TEXT (order-1 on mobile, order-1 on desktop) */}
            <div className="col-span-1 lg:col-span-5 py-8 lg:py-16 order-1 lg:order-1 flex flex-col justify-center">
              {/* Top Banner */}
              <div className="inline-flex self-start items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[10px] sm:text-xs uppercase tracking-widest px-4.5 py-1.5 rounded-full shadow-lg shadow-yellow-500/10 mb-6">
                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-2.23 2.23m2.23-2.23A12.016 12.016 0 0018 7.5" />
                </svg>
                DOMINATE YOUR LOCAL MARKET
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center gap-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3.5 py-1 rounded-full text-xs font-bold">
                  {MicrophoneIcon}
                  Free Live Webinar
                </span>
                <span className="inline-flex items-center gap-1 bg-white/5 text-slate-300 border border-white/10 px-3.5 py-1 rounded-full text-xs font-bold">
                  {ClockIcon}
                  60 Minutes
                </span>
                <span className="inline-flex items-center gap-1 bg-white/5 text-slate-300 border border-white/10 px-3.5 py-1 rounded-full text-xs font-bold">
                  {GiftIcon}
                  6 Free Bonuses
                </span>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6.5xl font-black tracking-tight leading-[1.05] text-white mb-6">
                THE <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">LOCAL GROWTH</span> SUMMIT
              </h1>

              {/* Tagline */}
              <div className="text-lg sm:text-xl lg:text-2xl font-extrabold text-[#FF6B35] mb-2 tracking-tight">
                Rank on Google Without Spending on Ads
              </div>

              {/* Sub-tagline */}
              <div className="text-sm sm:text-base font-bold text-slate-300 mb-6 leading-relaxed">
                Rank on Google &amp; Generate Organic Leads. Don't just depend on referrals.
              </div>

              {/* Description */}
              <p className="text-slate-400 text-sm sm:text-base mb-8 leading-relaxed font-medium">
                A free 60-minute live webinar for local business owners who want more customers from Google — organically. No paid ads. No guesswork. Just results.
              </p>

              {/* Date & Time info block */}
              <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 mb-8 shadow-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      {CalendarIcon} Date
                    </div>
                    <div className="text-base sm:text-lg font-black text-white mt-1.5">2nd July 2026</div>
                  </div>
                  <div className="border-l border-white/10 pl-4">
                    <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Time
                    </div>
                    <div className="text-base sm:text-lg font-black text-white mt-1.5">4:00 PM - 5:00 PM IST</div>
                  </div>
                </div>
              </div>

              {/* Countdown block */}
              <div className="flex gap-4 items-center bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 shadow-lg self-start">
                {[
                  { val: countdown.d, label: 'Days' },
                  { val: countdown.h, label: 'Hrs' },
                  { val: countdown.m, label: 'Min' },
                  { val: countdown.s, label: 'Sec' },
                ].map(({ val, label }, i) => (
                  <div key={label} className="flex items-center">
                    {i > 0 && <span className="text-[#FF6B35] text-lg font-bold px-1.5 animate-pulse">:</span>}
                    <div className="text-center min-w-[36px]">
                      <div className="text-xl font-extrabold text-white leading-none">{String(val).padStart(2, '0')}</div>
                      <div className="text-[9px] text-cyan-400 font-bold tracking-wider uppercase mt-1.5">{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 2: SPEAKER PHOTO (order-3 on mobile, order-2 on desktop) */}
            <div className="col-span-1 lg:col-span-3 flex flex-col justify-end relative min-h-[480px] sm:min-h-[580px] lg:min-h-[700px] order-3 lg:order-2 select-none">
              <div className="relative w-full h-full flex items-end justify-center">
                {/* Speaker image */}
                <img
                  src="/hero-image.png"
                  alt="Rahul Medhe"
                  className="max-h-[480px] sm:max-h-[580px] lg:max-h-[680px] w-auto object-contain object-bottom relative z-10 scale-110 sm:scale-115 lg:scale-120 transform origin-bottom"
                />
                {/* Glow behind photo */}
                <div className="absolute bottom-10 w-48 sm:w-64 h-48 sm:h-64 bg-cyan-500/20 rounded-full blur-3xl z-0 scale-95" />
                {/* Fading gradient to cover cutoff */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent z-20 pointer-events-none" />
              </div>
            </div>

            {/* COLUMN 3: REGISTRATION FORM (order-2 on mobile, order-3 on desktop) */}
            <div className="col-span-1 lg:col-span-4 order-2 lg:order-3 py-6 lg:py-16" ref={formRef}>
              <div className="bg-slate-800/60 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-2xl">
                
                {/* Form header pill */}
                <div className="bg-gradient-to-r from-sky-400 to-cyan-500 text-slate-950 font-black text-center text-[10px] sm:text-xs tracking-wider py-2.5 px-4 rounded-full mb-6 shadow-md uppercase">
                  ⚡ Reserve Your Free Seat Now
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="name" className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Your Full Name *</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Rahul Sharma"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full bg-slate-900 border border-white/10 text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-xs focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all duration-300 font-semibold"
                    />
                  </div>

                  <div>
                    <label htmlFor="whatsapp" className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">WhatsApp Number *</label>
                    <input
                      id="whatsapp"
                      type="tel"
                      placeholder="9876543210"
                      value={form.whatsapp}
                      onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                      className="w-full bg-slate-900 border border-white/10 text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-xs focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all duration-300 font-semibold"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Company / Business *</label>
                    <input
                      id="company"
                      type="text"
                      placeholder="My Business Name"
                      value={form.company}
                      onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                      className="w-full bg-slate-900 border border-white/10 text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-xs focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all duration-300 font-semibold"
                    />
                  </div>

                  <div>
                    <label htmlFor="pain_point" className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">What is your #1 SEO / Local Google pain point? *</label>
                    <textarea
                      id="pain_point"
                      placeholder="e.g. My business doesn't appear on Google Maps..."
                      value={form.pain_point}
                      onChange={e => setForm(f => ({ ...f, pain_point: e.target.value }))}
                      rows={2}
                      className="w-full bg-slate-900 border border-white/10 text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-xs focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all duration-300 font-semibold resize-y min-h-[60px]"
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-[11px] font-bold bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                      ⚠️ {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4.5 text-white font-black text-sm rounded-full transition-all duration-300 cursor-pointer uppercase tracking-wider lightning-btn"
                  >
                    {submitting ? 'Registering...' : '🎟 Register For Free'}
                  </button>

                  <p className="text-center text-[9px] text-slate-500 font-bold">🔒 Details safe. No spam, ever.</p>
                </form>

              </div>
            </div>

          </div>
        </div>

        {/* Bottom glowing line to cover cut */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent z-30" />
      </section>

      {/* STATS BAR */}
      <section className="bg-slate-900 border-b border-white/5 py-8 px-4 sm:px-6 relative z-20">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: '500+', label: 'Seats Available' },
            { val: '60 Min', label: 'Live Training' },
            { val: '6', label: 'Free Bonuses' },
            { val: '100%', label: 'Free to Attend' },
          ].map(s => (
            <div key={s.label} className="flex flex-col gap-1">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400">{s.val}</div>
              <div className="text-xs sm:text-sm text-slate-400 font-bold tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* INSTAGRAM STYLE COMPARISON GRID */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 relative overflow-hidden border-b border-white/5">
        {/* Subtle glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-8">
              
              {/* NOT ABOUT TEACHING SEO */}
              <AnimSection>
                <div className="bg-slate-800/40 border border-red-500/20 hover:border-red-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute -top-12 -left-12 w-24 h-24 bg-red-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500" />
                  
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-400 text-2xl font-bold border border-red-500/20">
                      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-white mb-3">
                        This Webinar is <span className="text-red-500 uppercase font-black">NOT</span> about teaching you SEO.
                      </h3>
                      <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-semibold">
                        It's about showing you how we help local businesses generate more qualified leads from <span className="text-cyan-400 font-bold">Google</span>, <span className="text-emerald-400 font-bold">ChatGPT</span>, <span className="text-purple-400 font-bold">Gemini</span>, and AI-powered search.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimSection>

              {/* PERFECT FOR */}
              <AnimSection delay={80}>
                <div className="premium-card rounded-3xl p-6 sm:p-8 shadow-xl">
                  <h3 className="text-xs font-black uppercase tracking-widest text-cyan-400 mb-6">
                    PERFECT FOR:
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        label: 'Local Business Owners',
                        icon: (
                          <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 00-.75-.75h-1.5a.75.75 0 00-.75.75V21m-6-10.5V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-7.5M12 3v18M3 10.5h18" />
                          </svg>
                        )
                      },
                      {
                        label: 'Clinics',
                        icon: (
                          <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        )
                      },
                      {
                        label: 'Service Businesses',
                        icon: (
                          <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A1.5 1.5 0 0019.5 21l2.25-2.25a1.5 1.5 0 000-2.25l-5.83-5.83" />
                          </svg>
                        )
                      },
                      {
                        label: 'Consultants',
                        icon: (
                          <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372" />
                          </svg>
                        )
                      },
                      {
                        label: 'Agencies',
                        icon: (
                          <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-10.5h16.5" />
                          </svg>
                        )
                      },
                      {
                        label: 'Struggling Businesses',
                        icon: (
                          <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519" />
                          </svg>
                        )
                      },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl p-3.5 hover:bg-white/10 hover:border-white/10 transition-all duration-300">
                        {item.icon}
                        <span className="text-xs sm:text-sm font-bold text-slate-200">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimSection>

            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-8">
              
              {/* GET FOUND ON */}
              <AnimSection delay={120}>
                <div className="premium-card rounded-3xl p-6 sm:p-8 shadow-xl">
                  <h3 className="text-xs font-black uppercase tracking-widest text-cyan-400 mb-6">
                    GET FOUND ON:
                  </h3>
                  <div className="flex flex-col gap-3">
                    {[
                      {
                        text: 'Google Search',
                        icon: (
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                          </svg>
                        )
                      },
                      {
                        text: 'Google Business Profile',
                        icon: (
                          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21.9 8.89l-1.05-4.37c-.22-.9-1-1.52-1.91-1.52H5.05c-.9 0-1.69.62-1.91 1.52L2.1 8.89c-.16.66.04 1.35.54 1.84.07.07.15.14.23.2V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-8.07c.08-.06.16-.13.23-.2.5-.49.7-1.18.54-1.84zM5.05 5h13.9l.96 4H4.09l.96-4zm12.95 14H6v-7h12v7zM8.5 13H11v4H8.5v-4z"/>
                          </svg>
                        )
                      },
                      {
                        text: 'ChatGPT Search',
                        icon: (
                          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l5.438-3.125M14.187 8.096L15 3l-5.438 3.125M6.062 12h11.876M12 6.062v11.876" />
                          </svg>
                        )
                      },
                      {
                        text: 'Gemini Search',
                        icon: (
                          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2c-.1 3.2-2.8 5.9-6 6 3.2.1 5.9 2.8 6 6 .1-3.2 2.8-5.9 6-6z" />
                          </svg>
                        )
                      },
                      {
                        text: '& More AI Search',
                        icon: (
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l1.64 8.2a1 1 0 001.936-.18L13.9 10.742" />
                          </svg>
                        )
                      }
                    ].map(b => (
                      <div key={b.text} className="flex items-center gap-4 bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl px-5 py-3 transition-all duration-300">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center border border-white/10 shadow-inner">
                          {b.icon}
                        </div>
                        <span className="text-sm sm:text-base font-bold text-slate-100">{b.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimSection>

              {/* IS THIS WEBINAR FOR YOU? */}
              <AnimSection delay={160}>
                <div className="premium-card rounded-3xl p-6 sm:p-8 shadow-xl">
                  <h3 className="text-xs font-black uppercase tracking-widest text-cyan-400 mb-6">
                    IS THIS WEBINAR FOR YOU?
                  </h3>
                  <div className="flex flex-col gap-4">
                    {[
                      "Your website isn't generating enquiries.",
                      "You're spending too much on ads.",
                      "Your competitors rank above you.",
                      "You want more organic leads.",
                      "You want customers to find your business on Google & AI Search."
                    ].map((text, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-6.5 h-6.5 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mt-0.5">
                          {CheckIcon}
                        </div>
                        <p className="text-slate-300 text-sm sm:text-base font-bold leading-relaxed">
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimSection>

            </div>

          </div>
        </div>
      </section>

      {/* WHAT YOU'LL LEARN */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <AnimSection>
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                Inside The Webinar
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">What You'll Learn in 60 Minutes</h2>
              <p className="text-slate-400 text-base sm:text-lg mt-4 max-w-xl mx-auto leading-relaxed">
                No fluff. No theory. Just a proven framework you can apply immediately.
              </p>
            </div>
          </AnimSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LEARNS.map((l, i) => (
              <AnimSection key={i} delay={i * 60}>
                <div className="flex gap-4 items-start bg-slate-800/40 border border-white/5 hover:border-cyan-500/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 shadow-md shadow-black/10">
                  {l.icon}
                  <p className="text-sm sm:text-base font-bold text-slate-200 leading-relaxed">{l.text}</p>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* 6 BONUSES */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <AnimSection>
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                🎁 Exclusive Bonuses
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">6 Bonuses — All Yours For Free</h2>
              <p className="text-slate-400 text-base sm:text-lg mt-4 leading-relaxed">
                Worth <span className="text-[#FF6B35] font-black">₹13,500+</span> — Revealed inside the webinar
              </p>
            </div>
          </AnimSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BONUSES.map((b, i) => (
              <AnimSection key={i} delay={i * 60}>
                <div className="h-full premium-card rounded-2xl p-6 relative overflow-hidden shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="text-3xl font-black text-white/10 leading-none">{b.num}</div>
                      <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-black px-2.5 py-1 rounded-md">
                        VALUE {b.value}
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-white mb-2 leading-tight">{b.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold">{b.desc}</p>
                  </div>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST PILLARS BANNER */}
      <section className="bg-slate-900 border-b border-white/5 py-8 px-4 sm:px-6 relative z-10 shadow-inner">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-around items-center gap-6 text-center">
          {[
            {
              label: 'Proven Strategies That Work',
              icon: (
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6" />
                </svg>
              )
            },
            {
              label: 'Real Results for Local Businesses',
              icon: (
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519" />
                </svg>
              )
            },
            {
              label: 'Live Q&A Session',
              icon: (
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM21.375 9.75a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM17.625 20.25a7.5 7.5 0 00-11.25 0" />
                </svg>
              )
            },
            {
              label: 'Live Website Review & Audits',
              icon: (
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
                </svg>
              )
            },
          ].map(p => (
            <div key={p.label} className="flex items-center gap-2.5">
              {p.icon}
              <span className="text-sm font-extrabold text-slate-300 tracking-tight">{p.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 py-12 px-4 text-center relative z-10">
        <p className="text-xs sm:text-sm text-slate-500 font-bold">© 2026 · SEO Webinar · All Rights Reserved</p>
        <p className="text-[10px] text-slate-600 mt-2 font-bold uppercase tracking-wider">This webinar is 100% free. No hidden charges.</p>
      </footer>
    </main>
  );
}
