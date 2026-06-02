'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const DEMO_WEBSITES = [
  { title: 'Wedding Planner Vadodara', subtitle: 'Wedding Planning', url: 'https://weddingplannervadodara.in/', image: '/screenshots/2.png' },
  { title: 'Waterproofing Vadodara', subtitle: 'Construction Services', url: 'https://waterproofingvadodara.com/', image: '/screenshots/3.png' },
  { title: 'Interior Design Vadodara', subtitle: 'Interior Design', url: 'https://interiordesignvadodara.in/', image: '/screenshots/4.png' },
  { title: 'Solar Installation', subtitle: 'Solar Energy', url: 'https://solarinstallationvadodara.in/', image: '/screenshots/5.png' },
  { title: 'Friends Factory Cafe', subtitle: 'Cafe & Restaurant', url: 'https://friendsfactorycafe.com/', image: '/screenshots/1.png' },
  { title: 'Wow Shaadi', subtitle: 'Wedding Services', url: 'https://wowshaadi.com/', image: '/screenshots/6.png' },
];

const SEARCH_CONSOLE_IMAGES = [
  '/search-console/1.png', '/search-console/2.png',
  '/search-console/3.png', '/search-console/4.png',
  '/search-console/5.png', '/search-console/6.png',
  '/search-console/7.png', '/search-console/8.png',
];


const FAQS = [
  {
    q: 'How long does it take to build a website?',
    a: 'Most websites are ready within 5–7 working days. We handle everything — design, content, SEO setup, and WhatsApp integration. You just review and approve.',
  },
  {
    q: 'What does SEO actually do for my business?',
    a: 'SEO makes your business appear when people search for your service on Google. When someone searches "interior designer in Vadodara" or "wedding planner Baroda", you show up. Most of our clients start seeing real results from Month 2 — calls, WhatsApp enquiries, Google ranking movement. That\'s free, consistent traffic — without paying for ads.',
  },
  {
    q: 'How is this different from a regular web agency?',
    a: 'Most agencies build a site and disappear. We build, optimize, and maintain. Monthly SEO reports, ongoing updates, and direct WhatsApp support — not a ticket system.',
  },
  {
    q: 'Do I need to provide content or photos?',
    a: 'We handle the copy. If you have photos of your work, great — share them. If not, we use professional stock imagery that fits your category.',
  },
  {
    q: 'Can I use my existing domain?',
    a: 'Yes. If you already own a domain (like yourbusiness.com), we connect it. If you don\'t have one, we can help you get one.',
  },
  {
    q: 'Is there a contract or lock-in?',
    a: 'No lock-in contracts. Our SEO plans are annual for best results (SEO takes time), but we\'re straightforward about it upfront.',
  },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-24 px-4 sm:px-6 border-t border-[#27272A]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#71717A] mb-4">FAQ</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] text-white">
            Questions Answered.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] to-[#7C3AED]">No Ambiguity.</span>
          </h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-2xl border border-[#27272A] bg-[#141419] overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-sm sm:text-base font-semibold text-white leading-snug">{faq.q}</span>
                <span className={`flex-shrink-0 w-6 h-6 rounded-full border border-[#27272A] flex items-center justify-center transition-transform ${open === i ? 'rotate-45 border-[#A855F7]/50 text-[#A855F7]' : 'text-[#71717A]'}`}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                    <path d="M4 0h2v10H4zM0 4h10v2H0z" />
                  </svg>
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-[#A1A1AA] leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', service: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function handleServiceChange(s: string) {
    setForm(f => ({ ...f, service: s }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError('Please enter your name.'); return; }
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) { setError('Please enter a valid phone number.'); return; }
    if (!form.service) { setError('Please select a service.'); return; }
    if (!form.message.trim()) { setError('Please describe your requirements.'); return; }
    setError('');

    const lines = [
      `*Scalify Vadodara — New Enquiry*`,
      ``,
      `*Name* — ${form.name}`,
      `*Phone* — +91 ${form.phone}`,
      `*Service* — ${form.service}`,
      `*Requirements* — ${form.message}`,
    ];

    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', { content_name: 'Vadodara Enquiry', content_category: form.service });
    }
    setSubmitted(true);
    window.open(`https://wa.me/916353583148?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-white text-xl font-bold mb-2">Opening WhatsApp…</h3>
        <p className="text-[#71717A] text-sm mb-6">Your details are pre-filled. Just hit send.</p>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', service: '', message: '' }); }}
          className="text-sm text-[#A855F7] hover:underline"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Name + Phone in one row */}
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          required
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="Your name *"
          className="w-full bg-[#0A0A0F] border border-[#27272A] rounded-lg px-3 py-2.5 text-white placeholder-[#3F3F46] focus:outline-none focus:border-[#A855F7] transition-colors text-sm"
        />
        <div className="flex rounded-lg border border-[#27272A] bg-[#0A0A0F] overflow-hidden focus-within:border-[#A855F7] transition-colors">
          <span className="flex items-center px-2.5 text-[#71717A] text-xs border-r border-[#27272A] select-none">+91</span>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
            placeholder="WhatsApp no. *"
            className="flex-1 py-2.5 px-2 bg-transparent text-sm text-white placeholder-[#3F3F46] focus:outline-none"
          />
        </div>
      </div>

      {/* Service toggle */}
      <div className="grid grid-cols-3 gap-1.5">
        {(['WEBSITE', 'SEO', 'WEBSITE + SEO'] as const).map(s => (
          <button
            key={s}
            type="button"
            onClick={() => handleServiceChange(s)}
            className={`py-2 px-1 rounded-lg text-[11px] font-bold border transition-all ${form.service === s
              ? 'bg-gradient-to-r from-[#7C3AED] to-[#A855F7] border-[#A855F7] text-white'
              : 'bg-[#0A0A0F] border-[#27272A] text-[#71717A] hover:border-[#A855F7]/50 hover:text-white'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Requirements */}
      <textarea
        required
        rows={3}
        value={form.message}
        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
        placeholder="Your requirements — e.g. new website for my salon, SEO for my clinic... *"
        className="w-full bg-[#0A0A0F] border border-[#27272A] rounded-lg px-3 py-2.5 text-white placeholder-[#3F3F46] focus:outline-none focus:border-[#A855F7] transition-colors text-sm resize-none"
      />

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Talk to Us on WhatsApp
      </button>
    </form>
  );
}

export default function VadodaraPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white font-['Poppins',sans-serif]">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#27272A] sticky top-0 z-50 bg-[#0A0A0F]/90 backdrop-blur-xl">
        <Link href="/" className="text-white font-bold text-xl tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] to-[#7C3AED]">Scalify</span>
        </Link>
        <a
          href="#contact"
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white text-sm font-semibold hover:opacity-90 transition"
        >
          Get a Quote
        </a>
      </nav>

      {/* Hero */}
      <section className="pt-16 pb-24 px-4 sm:px-6 relative overflow-hidden">
        {/* bg glow */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[#7C3AED]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start">

          {/* Left — on mobile shows AFTER form (order-2), on desktop shows first (order-1) */}
          <div className="pt-2 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full border border-[#A855F7]/30 bg-[#A855F7]/10 text-[#A855F7] text-[11px] font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-pulse" />
              Vadodara · Website & SEO Services
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold leading-[0.95] tracking-tight mb-4">
              Your Customers<br />
              Are Searching.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] to-[#7C3AED]">
                Are You Showing Up?
              </span>
            </h1>

            <p className="text-sm text-[#71717A] leading-relaxed mb-6 max-w-md">
              We build professional websites and do SEO for local businesses in Vadodara.
              No templates. No shortcuts. Real results on Google.
            </p>

            {/* Trust strip */}
            <div className="flex flex-col gap-2.5">
              {['100+ businesses served across Vadodara', 'Real Google rankings — not promises', 'Every lead goes directly to your WhatsApp'].map(t => (
                <span key={t} className="flex items-center gap-2.5 text-sm text-[#71717A]">
                  <span className="w-4 h-4 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center flex-shrink-0">
                    <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Form: shows FIRST on mobile (order-1), second on desktop (order-2) */}
          <div className="bg-[#141419] border border-[#27272A] rounded-2xl p-5 lg:sticky lg:top-24 order-1 lg:order-2">
            <h3 className="text-white text-base font-bold mb-0.5">Get a Free Quote</h3>
            <p className="text-[#71717A] text-xs mb-4">We'll respond on WhatsApp within a few hours.</p>
            <ContactForm />
          </div>

        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 px-4 sm:px-6 border-t border-[#27272A]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#71717A] mb-4">What We Do</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]">
              Two things.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] to-[#7C3AED]">Done exceptionally well.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                label: 'WEBSITE',
                title: 'Professional Website',
                desc: 'Built from scratch. Mobile-first. Fast loading. Custom design that represents your business properly — not a ₹500 template.',
                bullets: ['Custom design', 'Mobile responsive', 'WhatsApp integration', 'SSL & hosting included', 'SEO-ready structure'],
                gradient: 'from-[#7C3AED] to-[#6366F1]',
              },
              {
                label: 'SEO',
                title: 'Search Engine Optimization',
                desc: 'Get found when people search for your service in Vadodara. We do the technical work so Google recommends you — consistently.',
                bullets: ['Keyword targeting', 'Google Search Console', 'Google Business Profile optimization', 'On-page optimization', 'Monthly reports', 'Local SEO focus'],
                gradient: 'from-[#A855F7] to-[#7C3AED]',
                featured: true,
              },
              {
                label: 'WEBSITE + SEO',
                title: 'Complete Package',
                desc: 'The full stack. A website built to rank, paired with ongoing SEO that compounds over time. Most businesses start here.',
                bullets: ['Everything in Website', 'Everything in SEO', 'Best ROI', 'Priority support', 'Unified strategy'],
                gradient: 'from-[#6366F1] to-[#A855F7]',
              },
            ].map(s => (
              <div key={s.label} className={`rounded-2xl border p-7 flex flex-col ${s.featured ? 'border-[#A855F7]/50 bg-gradient-to-b from-[#A855F7]/10 to-[#141419]' : 'border-[#27272A] bg-[#141419]'}`}>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-white bg-gradient-to-r ${s.gradient} mb-5 self-start`}>
                  {s.label}
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{s.title}</h3>
                <p className="text-[#71717A] text-sm leading-relaxed mb-6 flex-1">{s.desc}</p>
                <ul className="space-y-2.5">
                  {s.bullets.map(b => (
                    <li key={b} className="flex items-center gap-2.5 text-[#A1A1AA] text-sm">
                      <span className={`w-4 h-4 rounded-full bg-gradient-to-br ${s.gradient} flex items-center justify-center flex-shrink-0`}>
                        <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="py-24 px-4 sm:px-6 border-t border-[#27272A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#71717A] mb-4">Portfolio</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]">
              Built. Live. Ranking.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] to-[#7C3AED]">In Vadodara.</span>
            </h2>
            <p className="mt-4 text-[#71717A] text-lg max-w-xl mx-auto">Real websites for real businesses. Click any to see them live.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DEMO_WEBSITES.map((demo, idx) => (
              <a
                key={idx}
                href={demo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-2xl overflow-hidden border border-[#27272A] hover:border-[#A855F7]/50 transition-all duration-300 h-64 sm:h-72"
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
                    <p className="text-[#A855F7] text-sm">{demo.subtitle}</p>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40">
                  <div className="text-center">
                    <svg className="w-10 h-10 text-[#A855F7] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <p className="text-white text-sm font-semibold">View website</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-24 px-4 sm:px-6 border-t border-[#27272A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#71717A] mb-4">Proof</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]">
              Real Results.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] to-[#7C3AED]">From Real Businesses.</span>
            </h2>
            <p className="mt-4 text-[#71717A] text-lg max-w-2xl mx-auto">
              Actual Google Search Console screenshots from businesses using our service. This is what proper SEO looks like.
            </p>
          </div>

          <div className="hidden md:grid grid-cols-2 gap-4">
            {SEARCH_CONSOLE_IMAGES.map((image, index) => (
              <div key={index} className="relative bg-[#141419] border border-[#27272A] rounded-2xl overflow-hidden shadow-xl shadow-black/40">
                <div className="relative h-64 w-full bg-black/50">
                  <Image src={image} alt={`Result ${index + 1}`} fill className="object-contain" priority={index < 2} />
                </div>
                <div className="px-4 py-2 text-center border-t border-[#27272A]">
                  <p className="text-xs font-semibold text-[#71717A]">Member Result {index + 1}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="md:hidden space-y-4">
            {SEARCH_CONSOLE_IMAGES.map((image, index) => (
              <div key={index} className="relative bg-[#141419] border border-[#27272A] rounded-2xl overflow-hidden shadow-xl shadow-black/40">
                <div className="relative h-64 w-full bg-black/50">
                  <Image src={image} alt={`Result ${index + 1}`} fill className="object-contain" />
                </div>
                <div className="p-3 text-center">
                  <p className="text-xs font-semibold text-[#71717A]">Member Result {index + 1}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Avg. Clicks', value: '380–450' },
              { label: 'Impressions', value: '28.9K–74.3K' },
              { label: 'Avg. CTR', value: '0.9%–3.1%' },
              { label: 'Avg. Position', value: '6.7–17.2' },
            ].map(item => (
              <div key={item.label} className="rounded-2xl border border-[#27272A] bg-[#141419] p-6 text-center hover:border-[#A855F7]/30 transition">
                <div className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] to-[#7C3AED] mb-2">{item.value}</div>
                <div className="text-[#71717A] text-sm font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 border-t border-[#27272A]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#71717A] mb-4">Client Stories</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]">
              They Were Invisible.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] to-[#7C3AED]">Now They're Not.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                name: 'Nirav S.',
                biz: 'Interior Designer, Vadodara',
                quote: 'Within 3 months of the website going live, I started getting calls from people who found me on Google. Before this, everything was word of mouth.',
              },
              {
                name: 'Priya M.',
                biz: 'Wedding Planner, Baroda',
                quote: 'The SEO work they did was the real deal. My site now shows up for multiple wedding-related searches in Vadodara. Enquiries have doubled.',
              },
              {
                name: 'Karan T.',
                biz: 'Construction Business, Vadodara',
                quote: 'I was skeptical about spending on a website. Three months later it has already paid for itself many times over. Should have done this years ago.',
              },
            ].map(t => (
              <div key={t.name} className="p-7 rounded-2xl border border-[#27272A] bg-[#141419]">
                <div className="text-5xl text-[#27272A] font-serif leading-none mb-5 select-none">&ldquo;</div>
                <p className="text-[#A1A1AA] text-sm leading-relaxed mb-6">{t.quote}</p>
                <div className="flex items-center gap-3 pt-5 border-t border-[#27272A]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white text-xs font-bold select-none">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{t.name}</div>
                    <div className="text-[#71717A] text-xs">{t.biz}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-24 px-4 sm:px-6 border-t border-[#27272A]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">

            {/* Left */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#71717A] mb-5">Get In Touch</p>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] mb-6">
                Let's Talk<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] to-[#7C3AED]">About Your Business.</span>
              </h2>
              <p className="text-[#A1A1AA] text-base leading-relaxed mb-10">
                Tell us what you need. We'll give you a clear proposal — no jargon, no pushy sales. Just honest advice on what will work for your business.
              </p>

              <div className="space-y-5">
                {[
                  { icon: '🌐', title: 'Website', desc: 'Custom-built, mobile-first, ready to convert visitors into customers.' },
                  { icon: '🔍', title: 'SEO', desc: 'Rank on Google for searches your customers are already making.' },
                  { icon: '📦', title: 'Website + SEO', desc: 'The complete package. Built to rank from day one.' },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl border border-[#27272A] bg-[#141419]">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-white font-semibold text-sm mb-0.5">{item.title}</p>
                      <p className="text-[#71717A] text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Form */}
            <div className="bg-[#141419] border border-[#27272A] rounded-2xl p-8">
              <h3 className="text-white text-xl font-bold mb-1">Request a Free Quote</h3>
              <p className="text-[#71717A] text-sm mb-6">We'll respond on WhatsApp within a few hours.</p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* Final CTA */}
      <section className="py-28 px-4 sm:px-6 border-t border-[#27272A] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[300px] bg-[#7C3AED]/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-extrabold leading-[0.95] tracking-tight mb-6">
            Your competitor<br />is already online.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] to-[#7C3AED]">Are you?</span>
          </h2>
          <p className="text-[#A1A1AA] text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Every day without a website or SEO is a day your customers are going to someone else. Let's fix that.
          </p>
          <a
            href="#contact"
            className="inline-block px-12 py-5 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white text-lg font-extrabold hover:opacity-90 transition shadow-xl shadow-[#7C3AED]/25"
          >
            Get a Free Quote Today
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6 border-t border-[#27272A]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="text-white font-bold text-lg tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] to-[#7C3AED]">Scalify</span>
          </Link>
          <div className="flex gap-6 text-sm text-[#71717A]">
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
          </div>
          <p className="text-[#3F3F46] text-sm">© 2026 Scalify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
