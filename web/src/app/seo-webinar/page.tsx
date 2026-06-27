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
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

function Anim({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

/* ─── Cinematic section divider ─── */
function Divider({ label }: { label?: string }) {
  return (
    <div className="relative flex items-center justify-center py-2">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
      </div>
      {label && (
        <span className="relative z-10 bg-slate-900 px-5 text-[10px] font-black uppercase tracking-[0.25em] text-cyan-500/70">
          {label}
        </span>
      )}
    </div>
  );
}

const WEBINAR_DATE = new Date('2026-07-02T16:00:00+05:30');

const LEARNS = [
  { n: '01', head: 'Why Your Competitors Rank Above You', body: 'We\'ll show you exactly what they\'re doing — and how to beat them in your own city.' },
  { n: '02', head: 'The 3-Step SEO Formula', body: 'A simple framework that works for any business in India, even if you\'ve never done SEO before.' },
  { n: '03', head: 'How to Pick the Right Keywords', body: 'Find what your customers are searching right now — and show up exactly when they need you.' },
  { n: '04', head: 'What Google Wants in 2025', body: 'Most businesses get this wrong. We\'ll fix that in plain English — no jargon.' },
  { n: '05', head: 'Turn Visitors into Paying Customers', body: 'Getting traffic is only half the job. Learn how to convert clicks into enquiries.' },
  { n: '06', head: 'Live Website Audit on Screen', body: 'Watch Rahul fix a real website live. You\'ll instantly see what to do for your own.' },
];

const BONUSES = [
  { title: 'SEO Checklist PDF', desc: '47-point checklist — audit your website tonight', value: '₹2,000' },
  { title: 'Keyword Research Template', desc: 'Ready-to-use Google Sheets — plug and play', value: '₹1,500' },
  { title: 'Competitor Spy Guide', desc: 'See exactly what\'s working for your rivals', value: '₹1,500' },
  { title: 'Local SEO Blueprint', desc: 'Dominate Google Maps in your city', value: '₹2,500' },
  { title: 'Content Calendar (90 Days)', desc: '90 days of content ideas, fully planned out', value: '₹1,000' },
  { title: '15-Min Strategy Call With Rahul', desc: 'Free 1-on-1 call after the webinar — limited slots', value: '₹5,000' },
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
    <main className="min-h-screen bg-[#0a0f1a] text-slate-100 overflow-x-hidden antialiased">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }

        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 20px rgba(255,107,53,0.35), 0 4px 24px rgba(255,107,53,0.2); }
          50%      { box-shadow: 0 0 40px rgba(255,107,53,0.65), 0 4px 32px rgba(255,107,53,0.35); }
        }
        @keyframes badgePulse {
          0%,100% { opacity:1; } 50% { opacity:0.5; }
        }
        @keyframes floatY {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .cta-btn {
          background: linear-gradient(135deg, #FF6B35 0%, #ff8c42 50%, #FF6B35 100%);
          background-size: 200% auto;
          animation: glowPulse 2.5s infinite ease-in-out;
          transition: all 0.25s ease;
        }
        .cta-btn:hover {
          transform: translateY(-2px) scale(1.02);
          animation: shimmer 1s linear infinite, glowPulse 2.5s infinite;
        }
        .cta-btn:active { transform: scale(0.98); }

        .live-dot { animation: badgePulse 1.2s infinite ease-in-out; }
        .float-card { animation: floatY 4s ease-in-out infinite; }

        .glass {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(16px);
        }
        .glass-cyan {
          background: rgba(6,182,212,0.05);
          border: 1px solid rgba(6,182,212,0.15);
        }
        .cinema-border-top {
          border-top: 1px solid transparent;
          border-image: linear-gradient(90deg, transparent, rgba(6,182,212,0.5) 30%, rgba(99,102,241,0.5) 70%, transparent) 1;
        }
        .cinema-border-bottom {
          border-bottom: 1px solid transparent;
          border-image: linear-gradient(90deg, transparent, rgba(6,182,212,0.5) 30%, rgba(99,102,241,0.5) 70%, transparent) 1;
        }
        .photo-glow {
          filter: drop-shadow(0 0 40px rgba(6,182,212,0.25)) drop-shadow(0 30px 60px rgba(0,0,0,0.8));
        }
        .number-glow {
          text-shadow: 0 0 20px rgba(6,182,212,0.6);
        }
        input, textarea {
          background: rgba(255,255,255,0.04) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          color: white !important;
          transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
        }
        input:focus, textarea:focus {
          border-color: rgba(6,182,212,0.6) !important;
          box-shadow: 0 0 0 3px rgba(6,182,212,0.1) !important;
          outline: none !important;
        }
        ::placeholder { color: rgba(148,163,184,0.5) !important; }
      `}</style>

      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-5 sm:px-8"
        style={{ background: 'rgba(10,15,26,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="text-xl font-black text-white tracking-tight">Scalify<span className="text-cyan-400">.</span></div>
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 text-red-400 text-[10px] font-black tracking-widest px-3.5 py-1.5 rounded-full">
          <span className="live-dot w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
          LIMITED SEATS
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-20 pb-0 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-900/20 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-0">

          {/* ── Event badge ── */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-400/90 to-yellow-500/90 text-slate-950 font-black text-[11px] uppercase tracking-widest px-5 py-2 rounded-full shadow-lg shadow-yellow-500/20">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 1l2.39 4.84L18 6.91l-4 3.9.94 5.5L10 13.77l-4.94 2.54.94-5.5L2 6.91l5.61-.07z"/></svg>
              FREE Live Webinar · 2nd July 2026 · 4:00 PM IST
            </div>
          </div>

          {/* ── Main headline ── */}
          <div className="text-center mb-6">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.03] text-white mb-4">
              Get Your Business on{' '}
              <span style={{ background: 'linear-gradient(135deg,#22d3ee,#6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Page One of Google
              </span>
              <br />
              <span className="text-[#FF6B35]">Without Spending on Ads</span>
            </h1>
            <p className="text-slate-300 text-lg sm:text-xl font-semibold max-w-2xl mx-auto leading-relaxed mt-4">
              A free 60-minute live webinar for business owners who are tired of being invisible on Google and want real customers — not just website traffic.
            </p>
          </div>

          {/* ── Countdown ── */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-1 glass rounded-2xl px-6 py-4 shadow-xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-3">Starts in</span>
              {[
                { val: countdown.d, label: 'Days' },
                { val: countdown.h, label: 'Hrs' },
                { val: countdown.m, label: 'Min' },
                { val: countdown.s, label: 'Sec' },
              ].map(({ val, label }, i) => (
                <div key={label} className="flex items-center">
                  {i > 0 && <span className="text-cyan-500 text-xl font-black px-2">:</span>}
                  <div className="text-center w-10">
                    <div className="text-2xl sm:text-3xl font-black text-white number-glow">{String(val).padStart(2, '0')}</div>
                    <div className="text-[9px] text-cyan-400 font-black tracking-widest uppercase mt-1">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── SPEAKER + FORM — two column ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-16 items-end">

            {/* Speaker photo column */}
            <div className="flex flex-col items-center order-2 lg:order-1">
              <div className="relative w-full max-w-sm lg:max-w-none flex flex-col items-center">
                {/* Glow platform behind photo */}
                <div className="absolute bottom-0 w-72 h-32 bg-cyan-500/15 rounded-full blur-3xl z-0" />
                <div className="absolute bottom-0 w-48 h-20 bg-indigo-500/20 rounded-full blur-2xl z-0" />
                {/* Photo */}
                <img
                  src="/hero-image.png"
                  alt="Rahul Medhe"
                  className="photo-glow relative z-10 w-full max-w-[340px] lg:max-w-[420px] object-contain object-bottom"
                  style={{ maxHeight: '540px' }}
                />
                {/* Fade at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-24 z-20 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, #0a0f1a 0%, transparent 100%)' }} />
              </div>

              {/* Name + credential — below photo */}
              <div className="relative z-30 -mt-4 text-center pb-8 lg:pb-0">
                <p className="text-base text-slate-300 font-semibold tracking-wide">— By</p>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-0.5">Rahul Medhe</h2>
                <div className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-full"
                  style={{ background: 'linear-gradient(135deg,rgba(6,182,212,0.15),rgba(99,102,241,0.15))', border: '1px solid rgba(6,182,212,0.3)' }}>
                  <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-black text-white">5+ Years in Digital Entrepreneurship</span>
                </div>
              </div>
            </div>

            {/* Registration form */}
            <div className="order-1 lg:order-2 pb-8 lg:pb-10" ref={formRef}>
              <div className="rounded-3xl overflow-hidden shadow-2xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(24px)' }}>

                {/* Form header */}
                <div className="px-6 pt-6 pb-5 text-center"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-cyan-300 mb-2">
                    <span className="live-dot w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                    Reserve Your Free Seat
                  </div>
                  <p className="text-white text-xl font-black">Join 500+ Business Owners</p>
                  <p className="text-slate-400 text-sm font-semibold mt-1">Seats are filling fast. Register now — it's 100% free.</p>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-4">
                  {[
                    { id: 'name', label: 'Your Full Name', type: 'text', placeholder: 'Rahul Sharma' },
                    { id: 'whatsapp', label: 'WhatsApp Number', type: 'tel', placeholder: '9876543210' },
                    { id: 'company', label: 'Business / Company Name', type: 'text', placeholder: 'My Business Name' },
                  ].map(f => (
                    <div key={f.id}>
                      <label htmlFor={f.id} className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                        {f.label} <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        id={f.id}
                        type={f.type}
                        placeholder={f.placeholder}
                        value={(form as Record<string, string>)[f.id]}
                        onChange={e => setForm(prev => ({ ...prev, [f.id]: e.target.value }))}
                        className="w-full rounded-xl px-4 py-3 text-sm font-semibold"
                      />
                    </div>
                  ))}

                  <div>
                    <label htmlFor="pain_point" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      Your Biggest SEO Problem <span className="text-cyan-400">*</span>
                    </label>
                    <textarea
                      id="pain_point"
                      placeholder="e.g. My business doesn't show up on Google Maps..."
                      value={form.pain_point}
                      onChange={e => setForm(prev => ({ ...prev, pain_point: e.target.value }))}
                      rows={2}
                      className="w-full rounded-xl px-4 py-3 text-sm font-semibold resize-none"
                    />
                  </div>

                  {error && (
                    <div className="text-red-300 text-xs font-bold bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                      ⚠ {error}
                    </div>
                  )}

                  <button type="submit" disabled={submitting}
                    className="cta-btn w-full py-4 text-white font-black text-base rounded-2xl cursor-pointer tracking-wide uppercase">
                    {submitting ? 'Registering...' : '🎟  Claim My Free Seat Now'}
                  </button>

                  <p className="text-center text-[10px] text-slate-500 font-semibold">
                    🔒 We never share your details. No spam, ever.
                  </p>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ── */}
      <Divider />
      <section className="py-8 px-4 sm:px-6 cinema-border-top cinema-border-bottom"
        style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { val: '500+', label: 'Seats Available' },
            { val: '60 Min', label: 'Live Training' },
            { val: '6', label: 'Free Bonuses' },
            { val: '100%', label: 'Free to Join' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-3xl sm:text-4xl font-black text-cyan-400 number-glow">{s.val}</div>
              <div className="text-xs text-slate-400 font-bold tracking-wider mt-1 uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
      <Divider />

      {/* ── IS THIS FOR YOU ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Anim>
            <div className="text-center mb-14">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-500 mb-3 block">Is This For You?</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                If You Said "Yes" to Any of These,<br />
                <span className="text-[#FF6B35]">You Need to Attend</span>
              </h2>
            </div>
          </Anim>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: '📍', text: 'Your business doesn\'t show up on Google Maps or Search.' },
              { icon: '💸', text: 'You\'re spending money on ads but getting zero results.' },
              { icon: '😤', text: 'Your competitors rank above you, and you don\'t know why.' },
              { icon: '📉', text: 'Your website gets visitors but no one calls or enquires.' },
              { icon: '😕', text: 'You have no idea where to start with SEO.' },
              { icon: '🎯', text: 'You want a system that brings customers automatically.' },
            ].map((item, i) => (
              <Anim key={i} delay={i * 60}>
                <div className="flex items-start gap-4 glass rounded-2xl p-5 hover:border-cyan-500/30 transition-all duration-300">
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <p className="text-sm sm:text-base font-semibold text-slate-200 leading-relaxed">{item.text}</p>
                </div>
              </Anim>
            ))}
          </div>
        </div>
      </section>

      <Divider label="What You'll Learn" />

      {/* ── WHAT YOU LEARN ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 cinema-border-top cinema-border-bottom"
        style={{ background: 'linear-gradient(180deg, rgba(6,182,212,0.03) 0%, transparent 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <Anim>
            <div className="text-center mb-14">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-500 mb-3 block">Inside the Webinar</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                6 Things You'll Walk Away With
              </h2>
              <p className="text-slate-400 text-base sm:text-lg font-semibold mt-3 max-w-xl mx-auto">
                No theory. No fluff. Only what you can actually use tomorrow.
              </p>
            </div>
          </Anim>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {LEARNS.map((l, i) => (
              <Anim key={i} delay={i * 70}>
                <div className="relative flex gap-5 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 group"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.06), transparent)' }} />
                  <div className="flex-shrink-0 text-4xl font-black text-white/8 leading-none select-none pt-0.5"
                    style={{ color: 'rgba(6,182,212,0.12)', fontSize: '2.5rem' }}>
                    {l.n}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white mb-1.5">{l.head}</h3>
                    <p className="text-sm text-slate-400 font-semibold leading-relaxed">{l.body}</p>
                  </div>
                </div>
              </Anim>
            ))}
          </div>

          {/* CTA after learns */}
          <Anim delay={200}>
            <div className="text-center mt-12">
              <button onClick={scrollToForm}
                className="cta-btn inline-block px-10 py-4 text-white font-black text-base rounded-2xl cursor-pointer tracking-wide uppercase">
                I Want to Learn This — Register Free
              </button>
            </div>
          </Anim>
        </div>
      </section>

      <Divider label="Your Host" />

      {/* ── ABOUT RAHUL (credibility) ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Anim>
            <div className="rounded-3xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                {/* Photo side */}
                <div className="relative flex items-end justify-center overflow-hidden min-h-[320px]"
                  style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(99,102,241,0.08))' }}>
                  <div className="absolute bottom-0 w-64 h-32 bg-cyan-500/15 rounded-full blur-3xl" />
                  <img
                    src="/hero-image.png"
                    alt="Rahul Medhe"
                    className="relative z-10 h-80 w-auto object-contain object-bottom"
                    style={{ filter: 'drop-shadow(0 -10px 40px rgba(6,182,212,0.2))' }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.02), transparent)' }} />
                </div>

                {/* Text side */}
                <div className="p-8 sm:p-10 flex flex-col justify-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-500 mb-2">Your Host</p>
                  <h2 className="text-3xl font-black text-white mb-1">Rahul Medhe</h2>
                  <p className="text-base font-black text-[#FF6B35] mb-5">5+ Years in Digital Entrepreneurship</p>
                  <div className="flex flex-col gap-3">
                    {[
                      'Helped 50+ local businesses rank on Page 1 of Google',
                      'Founder of Scalify — a digital growth agency',
                      'Trained 1,000+ entrepreneurs across India',
                      'Featured speaker at business events in Maharashtra',
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}>
                          <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </div>
                        <p className="text-sm text-slate-300 font-semibold leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Anim>
        </div>
      </section>

      <Divider label="Exclusive Bonuses" />

      {/* ── BONUSES ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 cinema-border-top"
        style={{ background: 'linear-gradient(180deg, rgba(99,102,241,0.04) 0%, transparent 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <Anim>
            <div className="text-center mb-14">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-500 mb-3 block">Only for Registrants</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                6 Free Bonuses Worth{' '}
                <span className="text-[#FF6B35]">₹13,500+</span>
              </h2>
              <p className="text-slate-400 text-base sm:text-lg font-semibold mt-3">
                You get all of this just for showing up live.
              </p>
            </div>
          </Anim>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BONUSES.map((b, i) => (
              <Anim key={i} delay={i * 60}>
                <div className="h-full flex flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 group"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl font-black leading-none select-none"
                      style={{ color: 'rgba(6,182,212,0.15)', fontVariantNumeric: 'tabular-nums' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-lg"
                      style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', color: '#22d3ee' }}>
                      {b.value} VALUE
                    </span>
                  </div>
                  <h4 className="text-base font-black text-white mb-2">{b.title}</h4>
                  <p className="text-sm text-slate-400 font-semibold leading-relaxed flex-1">{b.desc}</p>
                </div>
              </Anim>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── FINAL CTA ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Anim>
            <div className="text-center rounded-3xl py-14 px-8 relative overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(6,182,212,0.2)' }}>
              {/* Background glow */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.07) 0%, transparent 70%)' }} />

              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-500 mb-4">Don't Miss This</p>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
                  Your Business Deserves to Be on Page 1
                </h2>
                <p className="text-slate-300 text-base sm:text-lg font-semibold mb-8 max-w-xl mx-auto leading-relaxed">
                  Stop losing customers to competitors. This one webinar could change everything. And it's completely free.
                </p>

                <button onClick={scrollToForm}
                  className="cta-btn inline-block px-12 py-5 text-white font-black text-lg rounded-2xl cursor-pointer tracking-wide uppercase shadow-2xl">
                  🎟  Register Free Now
                </button>

                <div className="flex flex-wrap justify-center gap-5 mt-8">
                  {[
                    { icon: '📅', text: '2nd July 2026' },
                    { icon: '🕓', text: '4:00 PM IST' },
                    { icon: '🎁', text: '6 Free Bonuses' },
                    { icon: '💯', text: '100% Free' },
                  ].map(item => (
                    <div key={item.text} className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span className="text-sm font-bold text-slate-300">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Anim>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-4 text-center cinema-border-top"
        style={{ background: 'rgba(255,255,255,0.01)' }}>
        <p className="text-slate-500 text-xs font-bold">© 2026 · Scalify · All Rights Reserved</p>
        <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mt-2">This webinar is 100% free. No hidden charges.</p>
      </footer>

    </main>
  );
}
