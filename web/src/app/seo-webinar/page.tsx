'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const COLORS = {
  primary: '#0D4A35',
  primaryLight: '#155c42',
  accent: '#FF6B35',
  accentDark: '#e5561f',
  bg: '#FAFAF8',
  text: '#1C1C1C',
  muted: '#5a6a62',
  card: '#ffffff',
  border: '#e2ede8',
};

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
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
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
        transform: visible ? 'translateY(0)' : 'translateY(36px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const WEBINAR_DATE = new Date('2026-07-15T19:00:00+05:30');

const LEARNS = [
  { icon: '🔍', text: 'Why your competitors rank higher — and exactly how to beat them' },
  { icon: '🚀', text: 'The 3-step SEO framework that works for any business in India' },
  { icon: '🎯', text: 'How to pick keywords your ideal customers are actually searching' },
  { icon: '📈', text: 'What Google looks for in 2025 (most businesses get this wrong)' },
  { icon: '💰', text: 'How to turn website visitors into paying customers' },
  { icon: '🔧', text: 'Live website audit — see real mistakes fixed in real time' },
];

const BONUSES = [
  { num: '01', title: 'SEO Checklist PDF', desc: '47-point checklist to audit your website today', value: '₹2,000' },
  { num: '02', title: 'Keyword Research Template', desc: 'Ready-to-use Google Sheets template', value: '₹1,500' },
  { num: '03', title: 'Competitor Analysis Guide', desc: 'Spy on what\'s working for your rivals', value: '₹1,500' },
  { num: '04', title: 'Local SEO Blueprint', desc: 'Dominate your city on Google Maps & Search', value: '₹2,500' },
  { num: '05', title: 'Content Calendar Template', desc: '90 days of content ideas pre-planned', value: '₹1,000' },
  { num: '06', title: '1-on-1 Strategy Session', desc: '15-minute free call with me after the webinar', value: '₹5,000' },
];

const FOR_WHOM = [
  'Business owners tired of relying only on referrals',
  'Entrepreneurs who tried SEO but saw zero results',
  'Local businesses who want to dominate their city on Google',
  'Anyone spending on ads who wants organic leads instead',
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
    <main style={{ background: COLORS.bg, color: COLORS.text, fontFamily: "'Plus Jakarta Sans', 'Poppins', system-ui, sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #FF6B35; color: #fff; }
        .btn-primary {
          background: #FF6B35; color: #fff; border: none; border-radius: 50px;
          padding: 16px 40px; font-size: 17px; font-weight: 700; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
          box-shadow: 0 4px 24px rgba(255,107,53,0.35);
          display: inline-block; text-align: center; text-decoration: none;
          font-family: inherit; letter-spacing: 0.01em;
        }
        .btn-primary:hover { background: #e5561f; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(255,107,53,0.45); }
        .btn-primary:active { transform: translateY(0); }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { box-shadow: 0 4px 24px rgba(255,107,53,0.35); } 50% { box-shadow: 0 8px 40px rgba(255,107,53,0.6); } }
        .float { animation: float 4s ease-in-out infinite; }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .stripe-bg {
          background: linear-gradient(135deg, #0D4A35 0%, #155c42 50%, #0a3828 100%);
        }
        input, textarea {
          width: 100%; padding: 14px 18px; border: 1.5px solid #d0ddd8;
          border-radius: 12px; font-size: 16px; font-family: inherit;
          background: #fff; color: #1C1C1C; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        input:focus, textarea:focus { border-color: #0D4A35; box-shadow: 0 0 0 3px rgba(13,74,53,0.12); }
        textarea { resize: vertical; min-height: 100px; }
        label { display: block; font-size: 14px; font-weight: 600; color: #0D4A35; margin-bottom: 6px; letter-spacing: 0.02em; }
        .badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,107,53,0.1); color: #e5561f;
          border: 1px solid rgba(255,107,53,0.25); border-radius: 50px;
          padding: 5px 14px; font-size: 13px; font-weight: 600;
        }
        .badge-green {
          background: rgba(13,74,53,0.08); color: #0D4A35;
          border: 1px solid rgba(13,74,53,0.2);
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-line {
          background: linear-gradient(90deg, #e2ede8 25%, #f0f6f3 50%, #e2ede8 75%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
          border-radius: 4px; height: 3px;
        }
        @media (max-width: 768px) {
          .hero-grid { flex-direction: column !important; }
          .learn-grid { grid-template-columns: 1fr !important; }
          .bonus-grid { grid-template-columns: 1fr !important; }
          .form-card { padding: 28px 20px !important; }
          .stat-row { flex-wrap: wrap !important; gap: 16px !important; }
        }
      `}</style>

      {/* HERO */}
      <section className="stripe-bg" style={{ padding: '80px 20px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle at 20% 50%, #FF6B35 0%, transparent 50%), radial-gradient(circle at 80% 20%, #fff 0%, transparent 40%)' }} />
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span className="badge" style={{ background: 'rgba(255,107,53,0.18)', color: '#ffb494', borderColor: 'rgba(255,107,53,0.3)' }}>🎙 Free Live Webinar</span>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.08)', color: '#a8cfbc', borderColor: 'rgba(255,255,255,0.15)' }}>⏱ 60 Minutes</span>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.08)', color: '#a8cfbc', borderColor: 'rgba(255,255,255,0.15)' }}>🎁 6 Free Bonuses</span>
          </div>

          <h1 style={{ fontSize: 'clamp(32px, 6vw, 60px)', fontWeight: 900, color: '#fff', lineHeight: 1.12, marginBottom: 24, letterSpacing: '-0.02em' }}>
            Rank <span style={{ color: '#FF6B35', display: 'inline-block' }} className="float">#1 on Google</span><br />
            Without Spending on Ads
          </h1>

          <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', color: '#a8cfbc', maxWidth: 640, margin: '0 auto 36px', lineHeight: 1.7 }}>
            A free 60-minute live webinar for business owners who want more customers from Google — organically. No paid ads. No guesswork. Just results.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 40 }}>
            <button className="btn-primary pulse" onClick={scrollToForm} style={{ fontSize: 18, padding: '18px 48px' }}>
              Reserve My Free Seat →
            </button>
          </div>

          {/* Countdown */}
          <div style={{ display: 'inline-flex', gap: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 20, padding: '18px 28px', border: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { val: countdown.d, label: 'Days' },
              { val: countdown.h, label: 'Hours' },
              { val: countdown.m, label: 'Minutes' },
              { val: countdown.s, label: 'Seconds' },
            ].map(({ val, label }, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {i > 0 && <span style={{ color: '#FF6B35', fontSize: 24, fontWeight: 700 }}>:</span>}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', lineHeight: 1, minWidth: 52 }}>{String(val).padStart(2, '0')}</div>
                  <div style={{ fontSize: 11, color: '#6ea88a', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ color: '#6ea88a', fontSize: 13, marginTop: 12, fontWeight: 500 }}>📅 15th July 2026 · 7:00 PM IST</p>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: '#fff', borderBottom: `1px solid ${COLORS.border}`, padding: '20px' }}>
        <div className="stat-row" style={{ maxWidth: 860, margin: '0 auto', display: 'flex', justifyContent: 'space-around', gap: 24, flexWrap: 'wrap' }}>
          {[
            { val: '500+', label: 'Seats Available' },
            { val: '60 Min', label: 'Live Training' },
            { val: '6', label: 'Free Bonuses' },
            { val: '100%', label: 'Free to Attend' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: COLORS.primary }}>{s.val}</div>
              <div style={{ fontSize: 13, color: COLORS.muted, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* VIDEO SECTION */}
      <section style={{ padding: '72px 20px', background: COLORS.bg }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <AnimSection>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <span className="badge badge-green" style={{ marginBottom: 12 }}>Watch This First</span>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: COLORS.primary, marginTop: 12 }}>See What You'll Gain in 60 Minutes</h2>
            </div>
            <div style={{
              position: 'relative', width: '100%', borderRadius: 20, overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(13,74,53,0.18)', border: `2px solid ${COLORS.border}`,
              background: '#0d2a1f', aspectRatio: '16/9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                <div style={{ fontSize: 64, marginBottom: 12 }}>▶</div>
                <p style={{ fontSize: 15, letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>Add Your Video Here</p>
                <p style={{ fontSize: 13, marginTop: 6, opacity: 0.5 }}>Landscape 16:9 · MP4 or YouTube embed</p>
              </div>
              {/* Replace the div above with: <video src="/your-video.mp4" controls style={{ width:'100%',display:'block' }} /> */}
              {/* Or: <iframe src="https://www.youtube.com/embed/YOUR_ID" style={{ width:'100%',height:'100%',border:'none',position:'absolute',top:0,left:0 }} allowFullScreen /> */}
            </div>
          </AnimSection>
        </div>
      </section>

      {/* WHAT YOU'LL LEARN */}
      <section style={{ padding: '72px 20px', background: '#fff' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <AnimSection>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span className="badge badge-green" style={{ marginBottom: 12 }}>Inside The Webinar</span>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: COLORS.primary, marginTop: 12 }}>What You'll Learn in 60 Minutes</h2>
              <p style={{ color: COLORS.muted, fontSize: 17, marginTop: 12, maxWidth: 520, margin: '12px auto 0' }}>No fluff. No theory. Just a proven framework you can apply immediately.</p>
            </div>
          </AnimSection>
          <div className="learn-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {LEARNS.map((l, i) => (
              <AnimSection key={i} delay={i * 80}>
                <div style={{
                  display: 'flex', gap: 16, alignItems: 'flex-start',
                  background: '#f7faf9', border: `1.5px solid ${COLORS.border}`,
                  borderRadius: 16, padding: '20px 22px',
                  transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = COLORS.accent; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(13,74,53,0.1)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = COLORS.border; (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}
                >
                  <div style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{l.icon}</div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, lineHeight: 1.5 }}>{l.text}</p>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* 6 BONUSES */}
      <section style={{ padding: '72px 20px', background: COLORS.bg }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <AnimSection>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span className="badge" style={{ marginBottom: 12 }}>🎁 Exclusive Bonuses</span>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: COLORS.primary, marginTop: 12 }}>6 Bonuses — All Yours For Free</h2>
              <p style={{ color: COLORS.muted, fontSize: 17, marginTop: 12 }}>Worth <strong style={{ color: COLORS.accent }}>₹13,500+</strong> — Revealed inside the webinar</p>
            </div>
          </AnimSection>
          <div className="bonus-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
            {BONUSES.map((b, i) => (
              <AnimSection key={i} delay={i * 70}>
                <div style={{
                  background: '#fff', border: `1.5px solid ${COLORS.border}`, borderRadius: 20,
                  padding: '24px 22px', position: 'relative', overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(13,74,53,0.12)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}
                >
                  <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)', borderRadius: 8, padding: '3px 10px', fontSize: 12, fontWeight: 700, color: COLORS.accent }}>
                    Value {b.value}
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: 'rgba(13,74,53,0.08)', marginBottom: 8, lineHeight: 1 }}>{b.num}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.primary, marginBottom: 6 }}>{b.title}</div>
                  <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.5 }}>{b.desc}</div>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section style={{ padding: '72px 20px', background: '#fff' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <AnimSection>
            <span className="badge badge-green" style={{ marginBottom: 12 }}>Is This For You?</span>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: COLORS.primary, margin: '12px 0 36px' }}>This Webinar Is Perfect For You If…</h2>
          </AnimSection>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {FOR_WHOM.map((item, i) => (
              <AnimSection key={i} delay={i * 100}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left',
                  background: '#f7faf9', border: `1.5px solid ${COLORS.border}`,
                  borderRadius: 14, padding: '18px 22px',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', background: COLORS.primary,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 14, fontWeight: 700, flexShrink: 0,
                  }}>✓</div>
                  <p style={{ fontSize: 16, fontWeight: 500, color: COLORS.text }}>{item}</p>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* REGISTRATION FORM */}
      <section style={{ padding: '80px 20px', background: 'linear-gradient(135deg, #0D4A35 0%, #0a3828 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,107,53,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 580, margin: '0 auto', position: 'relative' }} ref={formRef}>
          <AnimSection>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <span className="badge" style={{ background: 'rgba(255,107,53,0.15)', color: '#ffb494', borderColor: 'rgba(255,107,53,0.3)', marginBottom: 12 }}>🔥 Limited Seats</span>
              <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 900, color: '#fff', marginTop: 12, lineHeight: 1.2 }}>Reserve Your Free Seat Now</h2>
              <p style={{ color: '#a8cfbc', marginTop: 12, fontSize: 16 }}>Fill in your details below — it takes 30 seconds</p>
            </div>
          </AnimSection>

          <AnimSection delay={100}>
            <div className="form-card" style={{
              background: '#fff', borderRadius: 24, padding: '40px 36px',
              boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
            }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label htmlFor="name">Your Full Name *</label>
                  <input id="name" type="text" placeholder="Rahul Sharma" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label htmlFor="whatsapp">WhatsApp Number *</label>
                  <input id="whatsapp" type="tel" placeholder="9876543210" value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} />
                </div>
                <div>
                  <label htmlFor="company">Company / Business Name *</label>
                  <input id="company" type="text" placeholder="My Business Pvt Ltd" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
                </div>
                <div>
                  <label htmlFor="pain_point">What is your #1 pain point in getting organic Google customers? *</label>
                  <textarea id="pain_point" placeholder="e.g. My website doesn't appear on the first page even for my business name..." value={form.pain_point} onChange={e => setForm(f => ({ ...f, pain_point: e.target.value }))} />
                </div>
                {error && <p style={{ color: '#c0392b', fontSize: 14, fontWeight: 500, background: '#fef0ef', borderRadius: 8, padding: '10px 14px' }}>{error}</p>}
                <button type="submit" className="btn-primary" disabled={submitting} style={{ fontSize: 18, padding: '18px', marginTop: 4, opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? 'Registering...' : '🎟 Register For Free →'}
                </button>
                <p style={{ textAlign: 'center', fontSize: 13, color: COLORS.muted }}>🔒 Your details are 100% safe. No spam, ever.</p>
              </form>
            </div>
          </AnimSection>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#091f16', padding: '32px 20px', textAlign: 'center' }}>
        <p style={{ color: '#4d7a62', fontSize: 14 }}>© 2026 · SEO Webinar · All Rights Reserved</p>
        <p style={{ color: '#2e5040', fontSize: 12, marginTop: 8 }}>This webinar is 100% free. No hidden charges.</p>
      </footer>
    </main>
  );
}
