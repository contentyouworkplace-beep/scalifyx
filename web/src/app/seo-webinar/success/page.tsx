'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SeoWebinarSuccess() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setTimeout(() => setShow(true), 100);
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', { content_name: 'SEO Webinar Registration' });
    }
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans flex items-center justify-center py-16 px-4 selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        
        .glow-green {
          box-shadow: 0 8px 30px rgba(37, 211, 102, 0.35);
        }
        .glow-green:hover {
          box-shadow: 0 12px 40px rgba(37, 211, 102, 0.5);
        }
      `}</style>

      {/* Background glow */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full blur-[100px]" />
      </div>

      <div
        className="max-w-xl w-full text-center relative z-10 transition-all duration-700 ease-out transform"
        style={{
          opacity: show ? 1 : 0,
          transform: show ? 'translateY(0)' : 'translateY(24px)',
        }}
      >
        {/* Checkmark Icon */}
        <div className="w-24 h-24 rounded-full bg-[#FF6B35] flex items-center justify-center text-4xl mx-auto mb-8 shadow-xl shadow-orange-500/30 animate-bounce">
          🎉
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
          You're Registered!
        </h1>
        
        <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed font-semibold">
          Your seat is confirmed for the <span className="text-[#FF6B35] font-black">Free SEO Webinar</span> on <span className="text-white font-black">2nd July 2026 at 4:00 PM IST</span>. We'll send details on WhatsApp.
        </p>

        {/* WhatsApp Group CTA Card */}
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl backdrop-blur-md">
          <div className="text-4xl mb-4">📲</div>
          <h2 className="text-xl sm:text-2xl font-black text-white mb-2.5">Join our 1% Group</h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6 font-semibold">
            Get updates on WhatsApp. Get reminders, pre-webinar resources, and connect with 500+ business owners already growing with SEO.
          </p>
          <a
            href="https://chat.whatsapp.com/IG0tgdFUjmc6h6JDEx1YXs?s=cl&p=i&mlu=3"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-base font-black px-8 py-4.5 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 glow-green"
          >
            👉 Join the 1% Group
          </a>
        </div>

        {/* Next Steps List */}
        <div className="flex flex-col gap-3 mb-8">
          {[
            { icon: '📩', text: 'Check WhatsApp for your confirmation message' },
            { icon: '📅', text: 'Save the date: 2nd July 2026, 4:00 PM IST' },
            { icon: '🎁', text: 'Your 6 bonuses will be shared inside the webinar' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl p-4 text-left backdrop-blur-sm"
            >
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <span className="text-slate-300 text-xs sm:text-sm font-bold">{item.text}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-500 font-bold">© 2026 · SEO Webinar · All Rights Reserved</p>
      </div>
    </main>
  );
}
