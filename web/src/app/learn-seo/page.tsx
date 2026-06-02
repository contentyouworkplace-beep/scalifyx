'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const WHY_LEARN_SEO = [
  {
    icon: '💸',
    title: 'Agencies & Freelancers Are Burning Your Budget',
    desc: 'You pay Rs. 5,000–15,000/month to someone you can\'t verify. No transparency, no results, no idea what they\'re even doing. When you know SEO yourself, you hold them accountable — or do it better yourself.',
  },
  {
    icon: '🔍',
    title: 'Google Is the New Word of Mouth',
    desc: 'When someone needs a service, they don\'t ask a friend first — they Google it. If you\'re not showing up, that customer is going to your competitor. Every day without SEO is a day you\'re invisible.',
  },
  {
    icon: '📊',
    title: 'See What\'s Actually Trending in Your Industry',
    desc: 'SEO shows you exactly what your customers are searching for — right now. New services to offer, questions to answer, gaps your competitors are missing. It\'s free market research hiding in plain sight.',
  },
  {
    icon: '⏹️',
    title: 'Paid Ads Stop the Moment You Stop Paying',
    desc: 'Google Ads, Meta Ads — the moment your budget runs out, traffic stops. SEO builds an asset. A page that ranks today keeps bringing customers for months, sometimes years — without spending another rupee.',
  },
  {
    icon: '🧠',
    title: 'Only You Know Your Business Best',
    desc: 'No agency or freelancer will ever understand your business the way you do. You know your customers, your services, your edge. When you learn SEO yourself, you execute on your vision — not someone else\'s guess at it.',
  },
  {
    icon: '⚡',
    title: 'You Can\'t Afford to Stay Dependent',
    desc: 'Every time you need a change — a new page, updated content, a new city landing page — you\'re waiting on a freelancer or paying extra. When you understand SEO, you move fast, stay in control, and stop being at someone else\'s mercy.',
  },
];

const MODULES = [
  {
    number: '01',
    title: 'SEO Foundation & How Google Works',
    topics: [
      'How search engines crawl & rank pages',
      'Site structure & page hierarchy (H1–H3)',
      'Speed optimization — images, CSS, lazy loading',
      'HTTPS, SSL, and why it matters for ranking',
    ],
  },
  {
    number: '02',
    title: 'Technical SEO Setup',
    topics: [
      'Google Search Console — setup & verification',
      'Google Analytics GA4 — install & track',
      'XML Sitemap — create & submit',
      'Robots.txt, canonical tags, crawl error fixes',
      'Core Web Vitals — LCP, CLS, INP explained simply',
    ],
  },
  {
    number: '03',
    title: 'Keyword Research for Your Business',
    topics: [
      'Finding the right keywords for your industry',
      'Search intent — Informational vs Transactional',
      'Keyword clustering — one cluster, one page',
      'Long-tail keyword strategy for faster ranking',
      'Free tools vs paid tools — what actually works',
    ],
  },
  {
    number: '04',
    title: 'On-Page SEO — Optimise Every Page',
    topics: [
      'Title tags & meta descriptions that get clicks',
      'URL structure — clean, short, keyword-first',
      'Image alt text, compression, internal linking',
      'Schema markup — LocalBusiness, FAQ, Breadcrumbs',
      'Content depth — how much to write & why',
    ],
  },
  {
    number: '05',
    title: 'Local SEO & Google Business Profile',
    topics: [
      'Google Business Profile — setup & full optimisation',
      'NAP consistency — Name, Address, Phone everywhere',
      'Local citations — JustDial, Sulekha, IndiaMart',
      'City & area landing pages strategy',
      'Getting reviews & managing your local reputation',
    ],
  },
  {
    number: '06',
    title: 'Content Strategy & Link Building',
    topics: [
      'Pillar pages vs blog articles — what to write',
      'FAQ sections that rank on Google',
      'Guest posting & backlink basics',
      'Competitor backlink gap analysis',
    ],
  },
  {
    number: '07',
    title: 'Tracking, Reporting & AI Tools',
    topics: [
      'Search Console weekly review — what to check',
      'Rank tracking setup — free tools',
      'GA4 organic traffic & conversion reading',
      'Using AI tools to speed up SEO tasks',
      'Monthly SEO task priority review',
    ],
  },
];

const FAQS = [
  {
    q: 'Is this a recorded course or live?',
    a: 'Live — one-on-one with the instructor over a video call. You can ask questions throughout, pause when needed, and get answers specific to your business.',
  },
  {
    q: 'What do I need before the session?',
    a: 'Just a laptop and your website URL. If you don\'t have a website yet, that\'s okay too — we\'ll cover what you\'ll need when you\'re ready.',
  },
  {
    q: 'Will examples be from my industry?',
    a: 'Yes. Before the session we\'ll ask about your business — what you do, who your customers are, which city you\'re in. Every example, keyword, and strategy during the class is explained in the context of YOUR business.',
  },
  {
    q: 'I\'m not technical. Is this too advanced for me?',
    a: 'Not at all. This is designed for business owners and freelancers who want to learn SEO practically — no coding, no jargon. If you can use WhatsApp, you can follow this course.',
  },
  {
    q: 'What does the 1 year support mean?',
    a: 'After the session, you can WhatsApp us anytime you\'re stuck — whether it\'s a Google Search Console question, a keyword doubt, or something you forgot from the session. We\'ll reply.',
  },
  {
    q: 'Is Rs. 5,000 a one-time payment?',
    a: 'Yes. One payment of Rs. 5,000 covers the full 4-hour session + 1 year of WhatsApp support. No monthly fees, no hidden costs.',
  },
  {
    q: 'Can I do this for my client\'s business?',
    a: 'Absolutely. Many freelancers and agency owners take this to level up their SEO skills and deliver better results for clients.',
  },
];

const SEARCH_CONSOLE_IMAGES = [
  '/search-console/1.png', '/search-console/2.png',
  '/search-console/3.png', '/search-console/4.png',
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-24 px-4 sm:px-6 border-t border-[#E5E7EB]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9CA3AF] mb-4">FAQ</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] text-[#0F172A]">
            Questions Answered.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#0EA5E9]">No Ambiguity.</span>
          </h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden shadow-sm">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-sm sm:text-base font-semibold text-[#0F172A] leading-snug">{faq.q}</span>
                <span className={`flex-shrink-0 w-6 h-6 rounded-full border border-[#E5E7EB] flex items-center justify-center transition-transform ${open === i ? 'rotate-45 border-[#16A34A]/50 text-[#16A34A]' : 'text-[#9CA3AF]'}`}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                    <path d="M4 0h2v10H4zM0 4h10v2H0z" />
                  </svg>
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-[#6B7280] leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EnrolForm() {
  const [form, setForm] = useState({ name: '', company: '', phone: '', bizType: '', website: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError('Please enter your name.'); return; }
    if (!form.company.trim()) { setError('Please enter your company / business name.'); return; }
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) { setError('Please enter a valid WhatsApp number.'); return; }
    if (!form.bizType) { setError('Please select your business type.'); return; }
    setError('');

    const lines = [
      `*SEO Masterclass — New Enrolment Enquiry*`,
      ``,
      `*Name* — ${form.name}`,
      `*Business* — ${form.company}`,
      `*Phone* — +91 ${form.phone}`,
      `*Business Type* — ${form.bizType}`,
      form.website ? `*Website* — ${form.website}` : `*Website* — Not yet`,
    ];

    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', { content_name: 'SEO Course Enrolment', content_category: form.bizType });
    }

    setSubmitted(true);
    window.open(`https://wa.me/916353583148?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-[#0F172A] text-xl font-bold mb-2">Opening WhatsApp…</h3>
        <p className="text-[#6B7280] text-sm mb-6">Your details are pre-filled. Just hit send and we'll confirm your slot.</p>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: '', company: '', phone: '', bizType: '', website: '' }); }}
          className="text-sm text-[#16A34A] hover:underline"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        required
        value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        placeholder="Your name *"
        className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#0F172A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#16A34A] transition-colors text-sm"
      />

      <input
        type="text"
        required
        value={form.company}
        onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
        placeholder="Company / Business name *"
        className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#0F172A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#16A34A] transition-colors text-sm"
      />

      <div className="flex rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] overflow-hidden focus-within:border-[#16A34A] transition-colors">
        <span className="flex items-center px-3 text-[#9CA3AF] text-xs border-r border-[#E5E7EB] select-none">+91</span>
        <input
          type="tel"
          required
          value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
          placeholder="WhatsApp number *"
          className="flex-1 py-3 px-3 bg-transparent text-sm text-[#0F172A] placeholder-[#9CA3AF] focus:outline-none"
        />
      </div>

      <select
        required
        value={form.bizType}
        onChange={e => setForm(f => ({ ...f, bizType: e.target.value }))}
        className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#16A34A] transition-colors appearance-none"
        style={{ color: form.bizType ? '#0F172A' : '#9CA3AF' }}
      >
        <option value="" disabled>I am a... *</option>
        <option value="Small Business Owner">Small Business Owner</option>
        <option value="Freelancer">Freelancer</option>
        <option value="Agency">Agency / Marketing Team</option>
        <option value="Other">Other</option>
      </select>

      <input
        type="url"
        value={form.website}
        onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
        placeholder="Your website URL (optional)"
        className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#0F172A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#16A34A] transition-colors text-sm"
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-green-200"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Book Your Seat on WhatsApp
      </button>

      <p className="text-center text-xs text-[#9CA3AF]">Rs. 5,000 · One-time · 1 year support included</p>
    </form>
  );
}

export default function LearnSEOPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#0F172A] font-['Poppins',sans-serif]">

      {/* Top Bar */}
      <div className="w-full bg-gradient-to-r from-[#16A34A] to-[#15803D] text-white text-center py-2.5 px-4 text-xs sm:text-sm font-semibold">
        🛡️ Not happy after 4 hours? We refund you instantly — right in the session. No questions asked.
      </div>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] sticky top-0 z-50 bg-[#FAFAF7]/95 backdrop-blur-xl">
        <Link href="/" className="font-bold text-xl tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#0EA5E9]">Scalify</span>
        </Link>
        <a
          href="#enrol"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#15803D] text-white text-sm font-semibold hover:opacity-90 transition shadow-md shadow-green-100"
        >
          Book Your Seat
        </a>
      </nav>

      {/* Hero */}
      <section className="pt-16 pb-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-[#16A34A]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-[#0EA5E9]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">

          {/* Left */}
          <div className="pt-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-[#16A34A]/30 bg-[#16A34A]/8 text-[#16A34A] text-xs font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              Live · One-on-One · 5+ Years Expert
            </div>

            <h1 className="text-5xl sm:text-6xl font-extrabold leading-[0.95] tracking-tight mb-6 text-[#0F172A]">
              Learn SEO<br />
              Built Around<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#0EA5E9]">
                Your Business.
              </span>
            </h1>

            <p className="text-base text-[#6B7280] leading-relaxed mb-8 max-w-md">
              A 4-hour live masterclass taught with your business as the context — not generic theory. Every keyword, every strategy, every example is relevant to what <em>you</em> do.
            </p>

            <div className="flex flex-col gap-3 mb-8">
              {[
                'Taught by an expert with 5+ years in digital marketing & SEO',
                'Local SEO + Google Business Profile covered in depth',
                'Your business type, your city, your keywords — throughout',
                '1 year WhatsApp support after the session',
              ].map(t => (
                <span key={t} className="flex items-center gap-2.5 text-sm text-[#374151]">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[#16A34A] to-[#0EA5E9] flex items-center justify-center flex-shrink-0">
                    <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {t}
                </span>
              ))}
            </div>

            {/* Price pill */}
            <div className="inline-flex items-center gap-4 bg-white border border-[#E5E7EB] rounded-2xl px-6 py-4 shadow-sm">
              <div>
                <div className="text-3xl font-extrabold text-[#16A34A]">Rs. 5,000</div>
                <div className="text-xs text-[#9CA3AF] mt-0.5">One-time · No hidden fees</div>
              </div>
              <div className="w-px h-10 bg-[#E5E7EB]" />
              <div>
                <div className="text-sm font-bold text-[#0F172A]">4 Hours</div>
                <div className="text-xs text-[#9CA3AF]">Live session</div>
              </div>
              <div className="w-px h-10 bg-[#E5E7EB]" />
              <div>
                <div className="text-sm font-bold text-[#0F172A]">1 Year</div>
                <div className="text-xs text-[#9CA3AF]">WhatsApp support</div>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div id="enrol" className="bg-white border border-[#E5E7EB] rounded-2xl p-6 lg:sticky lg:top-24 shadow-xl shadow-gray-100">
            <h3 className="text-[#0F172A] text-lg font-bold mb-0.5">Book Your Seat</h3>
            <p className="text-[#9CA3AF] text-xs mb-5">We'll confirm your slot on WhatsApp within a few hours.</p>
            <EnrolForm />
          </div>

        </div>
      </section>

      {/* Why Learning SEO Is Necessary */}
      <section className="py-24 px-4 sm:px-6 border-t border-[#E5E7EB] bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9CA3AF] mb-4">Why Now</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] text-[#0F172A]">
              Why Every Business Owner<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#0EA5E9]">Needs to Learn SEO Today.</span>
            </h2>
            <p className="mt-4 text-[#6B7280] max-w-xl mx-auto text-base">Not tomorrow. Not when the agency delivers. Now — because every day you don't understand SEO, someone else is taking your customers.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {WHY_LEARN_SEO.map((item, i) => (
              <div key={i} className="flex gap-5 p-6 rounded-2xl border border-[#E5E7EB] bg-[#FAFAF7]">
                <div className="text-3xl flex-shrink-0 mt-0.5">{item.icon}</div>
                <div>
                  <h3 className="text-[#0F172A] font-bold text-base mb-2">{item.title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why This Is Different */}
      <section className="py-24 px-4 sm:px-6 border-t border-[#E5E7EB] bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9CA3AF] mb-4">Why This Works</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] text-[#0F172A]">
              Not a generic course.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#0EA5E9]">Built for your business.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: '🎯',
                title: 'Your Business as Context',
                desc: 'Before the session, we learn about your industry, your city, and your customers. Every example during the masterclass is relevant to what you actually do — not some random demo business.',
              },
              {
                icon: '👨‍💼',
                title: '5+ Years of Real SEO Experience',
                desc: 'Not a course reseller. Not a YouTuber. An expert who has ranked local businesses on Google across multiple industries — and knows what actually works in the Indian market.',
              },
              {
                icon: '💬',
                title: '1 Year WhatsApp Support',
                desc: 'The learning doesn\'t stop after 4 hours. Stuck on Search Console? Unsure about a keyword? Just WhatsApp us. For a full year after your session.',
              },
            ].map(c => (
              <div key={c.title} className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAF7] p-7">
                <div className="text-3xl mb-5">{c.icon}</div>
                <h3 className="text-[#0F172A] font-bold text-lg mb-3">{c.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Will Get */}
      <section className="py-24 px-4 sm:px-6 border-t border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9CA3AF] mb-4">What You Get</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] text-[#0F172A]">
              Everything Included.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#0EA5E9]">Nothing Hidden.</span>
            </h2>
            <p className="mt-4 text-[#6B7280] max-w-xl mx-auto text-base">Rs. 5,000 — one time. Here's exactly what you walk away with.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: '🎙️',
                title: '4 Hour Live One-on-One Masterclass',
                desc: 'Just you and the trainer. No batch, no crowd. Full attention on your questions and your business.',
              },
              {
                icon: '🎬',
                title: 'Full Recording Yours to Keep',
                desc: 'Can\'t remember something? Rewatch anytime. The complete 4-hour session recording is yours forever.',
              },
              {
                icon: '📖',
                title: 'Complete SEO Playbook',
                desc: 'A structured document covering every strategy taught in the session. Your go-to reference after the class.',
              },
              {
                icon: '✅',
                title: '50+ Step SEO Checklist',
                desc: 'The exact checklist Scalify uses to rank local business websites. Tick it off one by one for your own site.',
              },
              {
                icon: '💬',
                title: '1 Year WhatsApp Support',
                desc: 'Stuck at any step after the session? Just message. We reply. For a full year — no extra charge.',
              },
              {
                icon: '🎯',
                title: 'Taught with Your Business in Mind',
                desc: 'Before the session, we learn about your industry and city. Every example and strategy is relevant to what you actually do.',
              },
              {
                icon: '🛡️',
                title: '100% Refund Guarantee',
                desc: 'Not happy after 4 hours? We refund you instantly — right in the session. No questions asked.',
              },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl border border-[#E5E7EB] bg-white p-7 shadow-sm hover:shadow-md hover:border-[#16A34A]/30 transition-all">
                <div className="text-4xl mb-5">{item.icon}</div>
                <h3 className="text-[#0F172A] font-bold text-base mb-2">{item.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="#enrol"
              className="inline-block px-10 py-4 rounded-2xl bg-gradient-to-r from-[#16A34A] to-[#15803D] text-white text-base font-bold hover:opacity-90 transition shadow-lg shadow-green-100"
            >
              Book Your Seat — Rs. 5,000
            </a>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-24 px-4 sm:px-6 border-t border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9CA3AF] mb-4">Who This Is For</p>
            <h2 className="text-4xl font-extrabold tracking-tight leading-[1.05] text-[#0F172A] mb-8">
              You built the website.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#0EA5E9]">Now get it found.</span>
            </h2>
            <div className="space-y-4">
              {[
                { icon: '🏪', label: 'Small business owner doing your own marketing' },
                { icon: '💼', label: 'Freelancer managing SEO for clients' },
                { icon: '🌐', label: 'You have a website but aren\'t ranking on Google' },
                { icon: '🤖', label: 'You use AI tools but aren\'t sure if it\'s working' },
                { icon: '📍', label: 'Local business wanting to show up on Google Maps' },
                { icon: '📈', label: 'Tired of paying for ads — want organic traffic' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 p-4 rounded-xl border border-[#E5E7EB] bg-white">
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <span className="text-sm font-medium text-[#374151]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9CA3AF] mb-4">What You Walk Away With</p>
            <h3 className="text-2xl font-extrabold text-[#0F172A] mb-6">Rs. 5,000 covers everything</h3>
            <div className="space-y-4">
              {[
                '4-hour live one-on-one session',
                'Taught with your business type as context',
                '50+ step SEO checklist (the full Scalify task list)',
                'Local SEO & Google Profile strategy',
                'AI tools for SEO — what to use & how',
                '1 year WhatsApp support — ask anything, anytime',
              ].map(item => (
                <div key={item} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[#16A34A] to-[#0EA5E9] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-sm text-[#374151]">{item}</span>
                </div>
              ))}
            </div>
            <a
              href="#enrol"
              className="mt-8 w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:opacity-90 transition flex items-center justify-center text-sm shadow-lg shadow-green-100"
            >
              Book Your Seat — Rs. 5,000
            </a>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="py-24 px-4 sm:px-6 border-t border-[#E5E7EB] bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9CA3AF] mb-4">Course Curriculum</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] text-[#0F172A]">
              7 Modules.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#0EA5E9]">50+ Steps. Zero Fluff.</span>
            </h2>
            <p className="mt-4 text-[#6B7280] max-w-xl mx-auto text-base">The same checklist Scalify uses to rank local business websites — now taught live, explained in the context of your business.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {MODULES.map(mod => (
              <div key={mod.number} className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAF7] p-7">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-xs font-extrabold text-[#16A34A] bg-[#16A34A]/10 border border-[#16A34A]/20 rounded-lg px-2.5 py-1 tracking-widest">{mod.number}</span>
                  <h3 className="text-[#0F172A] font-bold text-base leading-snug">{mod.title}</h3>
                </div>
                <ul className="space-y-2.5">
                  {mod.topics.map(t => (
                    <li key={t} className="flex items-start gap-2.5 text-sm text-[#6B7280]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] flex-shrink-0 mt-1.5" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results from real clients */}
      <section className="py-24 px-4 sm:px-6 border-t border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9CA3AF] mb-4">Proof It Works</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] text-[#0F172A]">
              This Is What<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#0EA5E9]">SEO Looks Like.</span>
            </h2>
            <p className="mt-4 text-[#6B7280] text-base max-w-2xl mx-auto">
              Real Google Search Console results from businesses that used this exact SEO framework. This is what you'll learn to do for your own business.
            </p>
          </div>

          <div className="hidden md:grid grid-cols-2 gap-4">
            {SEARCH_CONSOLE_IMAGES.map((image, index) => (
              <div key={index} className="relative bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-md">
                <div className="relative h-64 w-full bg-[#F9FAFB]">
                  <Image src={image} alt={`Result ${index + 1}`} fill className="object-contain" priority={index < 2} />
                </div>
                <div className="px-4 py-2.5 text-center border-t border-[#E5E7EB]">
                  <p className="text-xs font-semibold text-[#9CA3AF]">Business Result {index + 1}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="md:hidden space-y-4">
            {SEARCH_CONSOLE_IMAGES.map((image, index) => (
              <div key={index} className="relative bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
                <div className="relative h-64 w-full bg-[#F9FAFB]">
                  <Image src={image} alt={`Result ${index + 1}`} fill className="object-contain" />
                </div>
                <div className="p-3 text-center">
                  <p className="text-xs font-semibold text-[#9CA3AF]">Business Result {index + 1}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Avg. Monthly Clicks', value: '380–450' },
              { label: 'Monthly Impressions', value: '28.9K–74.3K' },
              { label: 'Avg. CTR', value: '0.9%–3.1%' },
              { label: 'Avg. Position', value: '6.7–17.2' },
            ].map(item => (
              <div key={item.label} className="rounded-2xl border border-[#E5E7EB] bg-white p-6 text-center shadow-sm">
                <div className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#0EA5E9] mb-2">{item.value}</div>
                <div className="text-[#9CA3AF] text-xs font-medium">{item.label}</div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-[#9CA3AF] mt-6">Results from businesses using the Scalify SEO framework. Individual results vary by industry and consistency.</p>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* Final CTA */}
      <section className="py-28 px-4 sm:px-6 border-t border-[#E5E7EB] bg-white relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[300px] bg-[#16A34A]/5 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-extrabold leading-[0.95] tracking-tight mb-6 text-[#0F172A]">
            Your competitor<br />is learning SEO.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#0EA5E9]">Are you?</span>
          </h2>
          <p className="text-[#6B7280] text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            4 hours. Rs. 5,000. 1 year of support. Everything you need to start ranking your business on Google — taught with your business in mind.
          </p>
          <a
            href="#enrol"
            className="inline-block px-12 py-5 rounded-2xl bg-gradient-to-r from-[#16A34A] to-[#15803D] text-white text-lg font-extrabold hover:opacity-90 transition shadow-2xl shadow-green-100"
          >
            Book Your Seat — Rs. 5,000
          </a>
          <p className="mt-4 text-sm text-[#9CA3AF]">Limited slots. We confirm within a few hours on WhatsApp.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6 border-t border-[#E5E7EB] bg-[#FAFAF7]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="font-bold text-lg tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#0EA5E9]">Scalify</span>
          </Link>
          <div className="flex gap-6 text-sm text-[#9CA3AF]">
            <Link href="/terms" className="hover:text-[#0F172A] transition">Terms</Link>
            <Link href="/privacy" className="hover:text-[#0F172A] transition">Privacy</Link>
            <Link href="/contact" className="hover:text-[#0F172A] transition">Contact</Link>
          </div>
          <p className="text-[#D1D5DB] text-sm">© 2026 Scalify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
