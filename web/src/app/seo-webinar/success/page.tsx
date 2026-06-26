'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SeoWebinarSuccess() {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0D4A35 0%, #0a3828 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: "'Plus Jakarta Sans', 'Poppins', system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      <div style={{
        maxWidth: 560, width: '100%', textAlign: 'center',
        opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}>
        {/* Checkmark */}
        <div style={{
          width: 96, height: 96, borderRadius: '50%', background: '#FF6B35',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 28px', fontSize: 44,
          boxShadow: '0 16px 48px rgba(255,107,53,0.4)',
          animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.3s both',
        }}>
          🎉
        </div>

        <style>{`
          @keyframes popIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        `}</style>

        <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 16 }}>
          You're Registered!
        </h1>
        <p style={{ fontSize: 18, color: '#a8cfbc', lineHeight: 1.7, marginBottom: 32 }}>
          Your seat is confirmed for the <strong style={{ color: '#FF6B35' }}>Free SEO Webinar</strong> on <strong style={{ color: '#fff' }}>15th July 2026 at 7:00 PM IST</strong>. We'll send details on WhatsApp.
        </p>

        {/* WhatsApp Group CTA */}
        <div style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 24, padding: '32px 28px', marginBottom: 28,
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📲</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 10 }}>Join Our WhatsApp Group</h2>
          <p style={{ color: '#8fbfa8', fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
            Get reminders, pre-webinar resources, and connect with 500+ business owners already growing with SEO.
          </p>
          <a
            href="https://chat.whatsapp.com/DEMO_LINK"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block', background: '#25D366', color: '#fff',
              padding: '16px 40px', borderRadius: 50, fontSize: 16, fontWeight: 700,
              textDecoration: 'none', boxShadow: '0 8px 32px rgba(37,211,102,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = ''; }}
          >
            👉 Join the WhatsApp Group
          </a>
        </div>

        {/* What's next */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          {[
            { icon: '📩', text: 'Check WhatsApp for your confirmation message' },
            { icon: '📅', text: 'Save the date: 15th July 2026, 7:00 PM IST' },
            { icon: '🎁', text: 'Your 6 bonuses will be shared inside the webinar' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
              background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '14px 18px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
              <span style={{ color: '#c8e6d8', fontSize: 15, fontWeight: 500 }}>{item.text}</span>
            </div>
          ))}
        </div>

        <p style={{ color: '#3d6e55', fontSize: 13 }}>© 2026 · SEO Webinar · All Rights Reserved</p>
      </div>
    </main>
  );
}
