'use client';

import { useState } from 'react';
import Link from 'next/link';

const BUSINESSES = [
  { emoji: '🍽️', label: 'Restaurants & Dhabas' },
  { emoji: '☕', label: 'Cafes & Juice Bars' },
  { emoji: '👗', label: 'Clothing & Fabric Stores' },
  { emoji: '💇', label: 'Salons & Beauty Parlours' },
  { emoji: '🧁', label: 'Bakeries & Sweet Shops' },
  { emoji: '💍', label: 'Jewellery Shops' },
  { emoji: '🏋️', label: 'Gyms & Fitness Centres' },
  { emoji: '🏥', label: 'Medical Clinics & Pharmacies' },
  { emoji: '🔧', label: 'Auto / Car Service Centres' },
  { emoji: '🏪', label: 'Kirana & Grocery Stores' },
];

const STEPS = [
  { num: '1', title: 'Fill the Form', desc: 'Tell us your name, shop name & WhatsApp number below.' },
  { num: '2', title: 'We Call You', desc: 'Our team contacts you within 24 hours to understand your business.' },
  { num: '3', title: 'Video Goes Live', desc: 'We create & post your FREE promo video on social media.' },
  { num: '4', title: 'Customers Find You', desc: 'Real Vadodara people discover your shop online.' },
];

export default function ViralVadodaraPage() {
  const [form, setForm] = useState({ person_name: '', company_name: '', whatsapp: '', website: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.person_name.trim() || !form.company_name.trim() || !form.whatsapp.trim()) {
      setError('Please fill in your name, shop name and WhatsApp number.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/viral-vadodara', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }
      const lines = [
        `🎬 *Free Influencer Video — Vadodara*`,
        ``,
        `*Name:* ${form.person_name}`,
        `*Shop / Company:* ${form.company_name}`,
        `*WhatsApp:* ${form.whatsapp}`,
        ...(form.website ? [`*Website:* ${form.website}`] : []),
      ];
      window.location.href = `https://wa.me/916353583148?text=${encodeURIComponent(lines.join('\n'))}`;
    } catch {
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: '#FFFFFF', minHeight: '100vh', color: '#1A1A2E' }}>
      <style>{`
        .vv-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .vv-grid-4 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .vv-chips { display: flex; flex-wrap: wrap; gap: 10px; }
        @media (min-width: 640px) {
          .vv-grid-4 { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: 18, color: '#7C3AED', textDecoration: 'none' }}>ScalifyX</Link>
        <a href="#claim-form" style={{ background: '#F97316', color: '#fff', fontWeight: 700, fontSize: 13, padding: '8px 18px', borderRadius: 10, textDecoration: 'none' }}>Claim Free Video</a>
      </nav>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #F97316 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: '#FACC15', color: '#1A1A2E', fontWeight: 800, fontSize: 11, padding: '5px 16px', borderRadius: 999, marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1.5 }}>
          500 Spots Only — 100% Free
        </div>
        <h1 style={{ fontSize: 'clamp(26px, 6vw, 42px)', fontWeight: 900, color: '#fff', lineHeight: 1.25, marginBottom: 16, maxWidth: 600, margin: '0 auto 16px' }}>
          Get a FREE Influencer Video<br />for Your Vadodara Business
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 15, maxWidth: 480, margin: '0 auto 30px', lineHeight: 1.7 }}>
          We are giving away free professional video promotions to 500 local Vadodara businesses. No cost. No catch.
        </p>
        <a href="#claim-form" style={{ display: 'inline-block', background: '#FACC15', color: '#1A1A2E', fontWeight: 800, fontSize: 16, padding: '16px 36px', borderRadius: 14, textDecoration: 'none' }}>
          Claim Your Free Video →
        </a>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 14 }}>Limited to physical Vadodara businesses only</p>
      </div>

      {/* FORM */}
      <div id="claim-form" style={{ background: '#FFF8F0', padding: '60px 20px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div style={{ display: 'inline-block', background: '#FACC15', color: '#1A1A2E', fontWeight: 800, fontSize: 11, padding: '5px 16px', borderRadius: 999, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1.5 }}>
              Free — No Payment Required
            </div>
            <h2 style={{ fontSize: 'clamp(22px, 5vw, 32px)', fontWeight: 900, color: '#1A1A2E', lineHeight: 1.3 }}>Claim Your Free Video Now</h2>
            <p style={{ color: '#6B7280', fontSize: 14, marginTop: 8 }}>Fill below — we will contact you on WhatsApp</p>
          </div>
          <div style={{ background: '#fff', borderRadius: 20, padding: '30px 24px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1A1A2E', marginBottom: 6 }}>Your Name *</label>
                <input
                  name="person_name"
                  value={form.person_name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Patel"
                  style={{ width: '100%', background: '#FFF8F0', border: '1.5px solid #E5E7EB', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#1A1A2E', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1A1A2E', marginBottom: 6 }}>Shop / Company Name *</label>
                <input
                  name="company_name"
                  value={form.company_name}
                  onChange={handleChange}
                  placeholder="e.g. Patel Sweets & Bakery"
                  style={{ width: '100%', background: '#FFF8F0', border: '1.5px solid #E5E7EB', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#1A1A2E', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1A1A2E', marginBottom: 6 }}>WhatsApp Number *</label>
                <div style={{ display: 'flex', alignItems: 'center', background: '#FFF8F0', border: '1.5px solid #E5E7EB', borderRadius: 10, overflow: 'hidden' }}>
                  <span style={{ padding: '12px 12px 12px 14px', fontSize: 14, color: '#6B7280', fontWeight: 600, borderRight: '1.5px solid #E5E7EB', whiteSpace: 'nowrap' }}>+91</span>
                  <input
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handleChange}
                    placeholder="9876543210"
                    type="tel"
                    maxLength={10}
                    style={{ flex: 1, background: 'transparent', border: 'none', padding: '12px 14px', fontSize: 14, color: '#1A1A2E', fontFamily: 'inherit', outline: 'none' }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: 22 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1A1A2E', marginBottom: 6 }}>Website <span style={{ color: '#6B7280', fontWeight: 400 }}>(optional)</span></label>
                <input
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="www.yourshop.com"
                  style={{ width: '100%', background: '#FFF8F0', border: '1.5px solid #E5E7EB', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#1A1A2E', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              {error && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#DC2626', marginBottom: 16 }}>
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', background: loading ? '#ccc' : '#F97316', color: '#fff', fontWeight: 800, fontSize: 16, padding: '15px', borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' }}
              >
                {loading ? 'Submitting...' : 'Yes, I Want My Free Video 🎬'}
              </button>
              <p style={{ textAlign: 'center', fontSize: 11, color: '#9CA3AF', marginTop: 12 }}>
                By submitting, you agree to be contacted on WhatsApp by the ScalifyX team.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* WHY VADODARA */}
      <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #F97316 100%)', padding: '60px 20px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontWeight: 800, fontSize: 11, color: '#FACC15', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Our Mission</p>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 900, color: '#fff', marginBottom: 20, lineHeight: 1.3 }}>Why Are We Doing This for Vadodara?</h2>
          <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
            Vadodara has thousands of amazing local businesses — restaurants, salons, jewellery shops, gyms — but most of them are invisible online. Customers are searching on Instagram and Google every day, but these shops have no videos, no reels, no online presence.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
            We are a digital marketing team from Vadodara and we want to change that. Our goal is simple — help 500 local Vadodara businesses get their first professional video so they can start attracting more customers online.
          </p>
          <p style={{ color: '#FACC15', fontSize: 15, fontWeight: 700, lineHeight: 1.8 }}>
            No cost. No strings attached. Just a free video to get you started.
          </p>
        </div>
      </div>

      {/* WHAT YOU GET */}
      <div style={{ background: '#fff', padding: '60px 20px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <p style={{ fontWeight: 800, fontSize: 11, color: '#F97316', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>What You Get</p>
          <h2 style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 800, color: '#1A1A2E', marginBottom: 30 }}>Everything Included — 100% Free</h2>
          <div className="vv-grid-4">
            {[
              { icon: '🎬', title: 'Professional Promo Video', desc: 'A short-form video made specifically for your business — Reels & Shorts format.' },
              { icon: '📲', title: 'Ready to Post Anywhere', desc: 'Formatted for Instagram, YouTube Shorts, WhatsApp Status — all platforms.' },
              { icon: '📣', title: 'Posted on Our Page', desc: 'We upload your video on our social media pages so our followers discover your shop.' },
              { icon: '🎯', title: 'Ad-Ready Format', desc: 'The video is optimized so you can directly run paid ads on Facebook & Instagram if you want.' },
            ].map(item => (
              <div key={item.title} style={{ background: '#FFF8F0', border: '1.5px solid #E5E7EB', borderRadius: 16, padding: '22px 18px' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1A1A2E', marginBottom: 8 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHAT YOU CAN DO WITH THE VIDEO */}
      <div style={{ background: '#FFF8F0', padding: '60px 20px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <p style={{ fontWeight: 800, fontSize: 11, color: '#F97316', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>Use It Everywhere</p>
          <h2 style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 800, color: '#1A1A2E', marginBottom: 8 }}>What Can You Do With This Video?</h2>
          <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 30, lineHeight: 1.7 }}>Once we hand over your video, it is 100% yours. Use it however you want:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { emoji: '📱', platform: 'Instagram Reel', desc: 'Post it as a Reel on your own Instagram page to reach new customers in Vadodara.' },
              { emoji: '💬', platform: 'WhatsApp Status', desc: 'Put it on your WhatsApp Status so all your contacts see your business every day.' },
              { emoji: '📖', platform: 'Instagram & Facebook Story', desc: 'Add it to your Stories for 24-hour visibility to your followers.' },
              { emoji: '🎯', platform: 'Run Facebook & Instagram Ads', desc: 'Use the video to run targeted paid ads and reach thousands of people in Vadodara.' },
              { emoji: '🌐', platform: 'Your Website or Google Business', desc: 'Embed it on your website or add it to your Google Business profile.' },
              { emoji: '📢', platform: 'We Post It on Our Page Too', desc: 'We will upload your video on our ScalifyX social pages — free extra reach for your shop.' },
            ].map(item => (
              <div key={item.platform} style={{ background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{item.emoji}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#7C3AED', marginBottom: 4 }}>{item.platform}</div>
                  <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHO IS THIS FOR */}
      <div style={{ background: '#fff', padding: '50px 20px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <p style={{ fontWeight: 800, fontSize: 11, color: '#F97316', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>Who Is This For?</p>
          <h2 style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 800, color: '#1A1A2E', marginBottom: 24 }}>Only for shops with a physical location in Vadodara</h2>
          <div className="vv-chips">
            {BUSINESSES.map(b => (
              <div key={b.label} style={{ background: '#FFF8F0', border: '1.5px solid #E5E7EB', borderRadius: 12, padding: '10px 16px', fontSize: 13, fontWeight: 600, color: '#7C3AED', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{b.emoji}</span> {b.label}
              </div>
            ))}
          </div>
          <p style={{ marginTop: 20, fontSize: 13, color: '#6B7280' }}>No freelancers or online-only businesses — physical shops in Vadodara only.</p>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ background: '#FFF8F0', padding: '50px 20px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <p style={{ fontWeight: 800, fontSize: 11, color: '#F97316', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>Simple Process</p>
          <h2 style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 800, color: '#1A1A2E', marginBottom: 30 }}>How It Works</h2>
          <div className="vv-grid-4">
            {STEPS.map(s => (
              <div key={s.num} style={{ background: '#fff', border: '1.5px solid #F97316', borderRadius: 16, padding: '20px 16px' }}>
                <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #7C3AED, #F97316)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: 16, marginBottom: 12 }}>{s.num}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1A1A2E', marginBottom: 6 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: '#1A1A2E', padding: '24px 20px', textAlign: 'center' }}>
        <p style={{ color: '#9CA3AF', fontSize: 13 }}>
          Powered by <Link href="/" style={{ color: '#FACC15', fontWeight: 700, textDecoration: 'none' }}>ScalifyX</Link> · Vadodara's Digital Growth Partner
        </p>
        <p style={{ color: '#6B7280', fontSize: 12, marginTop: 6 }}>rahul@scalifyapp.com</p>
      </div>
    </div>
  );
}
