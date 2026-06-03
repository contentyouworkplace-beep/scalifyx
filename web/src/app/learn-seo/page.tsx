'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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
    q: 'Is Rs. 4,999 a one-time payment?',
    a: 'Yes. One payment of Rs. 4,999 covers the full 4-hour session + 1 year of WhatsApp support. No monthly fees, no hidden costs.',
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

const SLOTS = [
  { key: 'morning', label: '10 AM – 2 PM' },
  { key: 'afternoon', label: '3 PM – 7 PM' },
  { key: 'evening', label: '7 PM – 11 PM' },
];

function dateStr(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Returns fake booked slot keys for a date (frontend only, for trust/social proof)
function getFakeBookedSlots(date: Date): string[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const diffDays = Math.round((d.getTime() - today.getTime()) / 86400000);
  const dow = d.getDay(); // 0=Sun, 6=Sat

  if (diffDays === 0) return ['morning', 'afternoon', 'evening']; // today = full
  if (dow === 0) return ['morning', 'afternoon', 'evening'];      // every Sunday = full
  if (dow === 6) return ['evening'];                               // every Saturday = evening booked
  if (diffDays === 2) return ['morning'];
  if (diffDays === 3) return ['morning', 'evening'];
  if (diffDays === 5) return ['morning'];
  return [];
}

function getCalendarDays() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days: Date[] = [];
  // today + next 14 days (2 weeks)
  for (let i = 0; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

function getAvailabilityStyle(totalBooked: number) {
  if (totalBooked >= 3) return { dot: 'bg-red-500', text: 'text-red-500', label: 'Full', bg: 'bg-red-50 border-red-200' };
  if (totalBooked === 2) return { dot: 'bg-orange-500', text: 'text-orange-500', label: '2 Booked', bg: 'bg-orange-50 border-orange-200' };
  if (totalBooked === 1) return { dot: 'bg-amber-400', text: 'text-amber-600', label: '1 Booked', bg: 'bg-amber-50 border-amber-200' };
  return { dot: 'bg-green-500', text: 'text-green-600', label: 'Available', bg: 'bg-green-50 border-green-200' };
}

function BookingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({ name: '', company: '', phone: '', bizType: '', website: '' });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [realBookedSlots, setRealBookedSlots] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);

  const calendarDays = getCalendarDays();

  const fetchRealBookedSlots = useCallback(async (date: string) => {
    try {
      const res = await fetch(`/api/seo-course/bookings?date=${date}`);
      const data = await res.json();
      setRealBookedSlots(data.bookedSlots || []);
    } catch { setRealBookedSlots([]); }
  }, []);

  useEffect(() => {
    if (selectedDate) fetchRealBookedSlots(selectedDate);
  }, [selectedDate, fetchRealBookedSlots]);

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError('Please enter your name.'); return; }
    if (!form.company.trim()) { setError('Please enter your business name.'); return; }
    if (form.phone.replace(/\D/g, '').length < 10) { setError('Please enter a valid WhatsApp number.'); return; }
    if (!form.bizType) { setError('Please select your business type.'); return; }
    setError('');
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSlotSelect(date: string, slot: string) {
    setSelectedDate(date);
    setSelectedSlot(slot);
  }

  async function handleProceedToPayment() {
    if (!selectedDate || !selectedSlot) { setError('Please select a date and time slot.'); return; }
    setError('');
    setPaying(true);

    try {
      const res = await fetch('/api/seo-course/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, date: selectedDate, slot: selectedSlot }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong. Please try again.'); setPaying(false); return; }

      const { orderId, bookingId, keyId, amount } = data;

      const rzp = new (window as any).Razorpay({
        key: keyId,
        amount,
        currency: 'INR',
        name: 'Scalify SEO Masterclass',
        description: 'Seat Booking — Rs. 99',
        order_id: orderId,
        prefill: { name: form.name, contact: `+91${form.phone}` },
        theme: { color: '#16A34A' },
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/seo-course/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            router.push(`/learn-seo/success?name=${encodeURIComponent(form.name)}&date=${selectedDate}&slot=${selectedSlot}`);
          } else {
            setError('Payment verified but booking failed. Please WhatsApp us at +91 6353583148.');
            setPaying(false);
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      });
      rzp.open();
    } catch {
      setError('Something went wrong. Please try again.');
      setPaying(false);
    }
  }

  // Step indicator
  const steps = ['Your Details', 'Pick a Slot', 'Pay Rs. 99'];

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-5">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${step > i + 1 ? 'bg-[#16A34A] text-white' : step === i + 1 ? 'bg-[#16A34A] text-white' : 'bg-[#E5E7EB] text-[#9CA3AF]'}`}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-semibold ${step === i + 1 ? 'text-[#16A34A]' : 'text-[#9CA3AF]'}`}>{s}</span>
            {i < steps.length - 1 && <div className="flex-1 h-px bg-[#E5E7EB]" />}
          </div>
        ))}
      </div>

      {/* Step 1 — Form */}
      {step === 1 && (
        <form onSubmit={handleFormSubmit} className="space-y-3">
          <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name *" className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#0F172A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#16A34A] transition-colors text-sm" />
          <input type="text" required value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Company / Business name *" className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#0F172A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#16A34A] transition-colors text-sm" />
          <div className="flex rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] overflow-hidden focus-within:border-[#16A34A] transition-colors">
            <span className="flex items-center px-3 text-[#9CA3AF] text-xs border-r border-[#E5E7EB] select-none">+91</span>
            <input type="tel" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))} placeholder="WhatsApp number *" className="flex-1 py-3 px-3 bg-transparent text-sm text-[#0F172A] placeholder-[#9CA3AF] focus:outline-none" />
          </div>
          <select required value={form.bizType} onChange={e => setForm(f => ({ ...f, bizType: e.target.value }))} className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#16A34A] transition-colors appearance-none" style={{ color: form.bizType ? '#0F172A' : '#9CA3AF' }}>
            <option value="" disabled>I am a... *</option>
            <option value="Small Business Owner">Small Business Owner</option>
            <option value="Freelancer">Freelancer</option>
            <option value="Agency">Agency / Marketing Team</option>
            <option value="Other">Other</option>
          </select>
          <input type="text" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="Your website URL (optional)" className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#0F172A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#16A34A] transition-colors text-sm" />
          {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">{error}</div>}
          <button type="submit" className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:opacity-90 transition text-sm shadow-lg shadow-green-100">
            Next — Pick Your Slot →
          </button>
          <p className="text-center text-xs text-[#9CA3AF]">Pay only Rs. 99 now · Rs. 4,900 at start of session</p>
        </form>
      )}

      {/* Step 2 — Calendar Grid */}
      {step === 2 && (
        <div>
          <p className="text-xs text-[#9CA3AF] mb-3">Pick a date — then choose your time slot.</p>

          {/* Legend */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {[
              { dot: 'bg-green-500', label: 'Available' },
              { dot: 'bg-amber-400', label: '1 Booked' },
              { dot: 'bg-orange-500', label: '2 Booked' },
              { dot: 'bg-red-500', label: 'Full' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${l.dot}`} />
                <span className="text-[10px] text-[#6B7280] font-medium">{l.label}</span>
              </div>
            ))}
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-[#9CA3AF] py-1">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          {(() => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Build weeks — start from this week's Sunday
            const startDay = new Date(today);
            startDay.setDate(today.getDate() - today.getDay());

            const cells: (Date | null)[] = [];
            for (let i = 0; i < 28; i++) {
              const d = new Date(startDay);
              d.setDate(startDay.getDate() + i);
              cells.push(d);
            }

            const weeks: (Date | null)[][] = [];
            for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

            return (
              <div className="space-y-1 mb-4">
                {weeks.map((week, wi) => (
                  <div key={wi} className="grid grid-cols-7 gap-1">
                    {week.map((day, di) => {
                      if (!day) return <div key={di} />;
                      const ds = dateStr(day);
                      const isPast = day < today;
                      const isToday = ds === dateStr(today);
                      const isFuture = day > today;
                      const fakeBooked = getFakeBookedSlots(day);
                      const allBooked = Array.from(new Set([...fakeBooked, ...(ds === selectedDate ? realBookedSlots : [])]));
                      const totalBooked = allBooked.length;
                      const style = getAvailabilityStyle(totalBooked);
                      const isSelected = selectedDate === ds;
                      const isDisabled = isPast || isToday || totalBooked >= 3;

                      return (
                        <button
                          key={ds}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => { setSelectedDate(ds); setSelectedSlot(''); }}
                          className={`relative flex flex-col items-center py-2 rounded-xl border text-xs font-bold transition-all
                            ${isSelected ? 'border-[#16A34A] bg-[#16A34A] text-white shadow-md' :
                              isPast ? 'border-[#F3F4F6] bg-[#F9FAFB] text-[#D1D5DB] cursor-not-allowed' :
                              isToday ? 'border-red-200 bg-red-50 text-red-400 cursor-not-allowed' :
                              totalBooked >= 3 ? 'border-red-200 bg-red-50 text-red-400 cursor-not-allowed' :
                              `border-[#E5E7EB] bg-white hover:border-[#16A34A] text-[#0F172A] ${style.bg}`}
                          `}
                        >
                          <span>{day.getDate()}</span>
                          {(isToday || isFuture) && !isSelected && (
                            <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isPast ? 'bg-transparent' : style.dot}`} />
                          )}
                          {isToday && <span className="text-[8px] text-red-400 leading-none font-bold">Full</span>}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Slots for selected date */}
          {selectedDate && (() => {
            const selDay = new Date(selectedDate);
            const fakeBooked = getFakeBookedSlots(selDay);
            const allBooked = Array.from(new Set([...fakeBooked, ...realBookedSlots]));

            return (
              <div className="mb-4">
                <p className="text-xs font-bold text-[#0F172A] mb-2">
                  {selDay.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {SLOTS.map(slot => {
                    const booked = allBooked.includes(slot.key);
                    const picked = selectedSlot === slot.key;
                    return (
                      <button
                        key={slot.key}
                        type="button"
                        disabled={booked}
                        onClick={() => setSelectedSlot(slot.key)}
                        className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all flex items-center justify-between
                          ${booked ? 'bg-[#FEF2F2] border-red-200 text-red-400 cursor-not-allowed' :
                            picked ? 'bg-[#16A34A] border-[#16A34A] text-white' :
                            'bg-white border-[#E5E7EB] text-[#374151] hover:border-[#16A34A]'}`}
                      >
                        <span>{slot.label}</span>
                        {booked && <span className="text-xs font-bold text-red-400">Booked</span>}
                        {picked && <span className="text-xs font-bold text-white">✓ Selected</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {!selectedDate && (
            <p className="text-xs text-[#9CA3AF] text-center mb-4">← Select a date above to see available slots</p>
          )}

          {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600 mb-3">{error}</div>}

          <div className="flex gap-2">
            <button type="button" onClick={() => { setStep(1); setError(''); }} className="flex-1 py-3 rounded-xl border border-[#E5E7EB] text-[#6B7280] font-semibold text-sm hover:bg-[#F9FAFB] transition">
              ← Back
            </button>
            <button
              type="button"
              disabled={!selectedDate || !selectedSlot || paying}
              onClick={handleProceedToPayment}
              className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:opacity-90 transition text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {paying ? 'Opening Payment...' : 'Pay Rs. 99 & Confirm →'}
            </button>
          </div>
          <p className="text-center text-xs text-[#9CA3AF] mt-2">Secure payment via Razorpay</p>
        </div>
      )}
    </div>
  );
}

export default function LearnSEOPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#0F172A] font-['Poppins',sans-serif]">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] sticky top-0 z-50 bg-[#FAFAF7]/95 backdrop-blur-xl">
        <Link href="/" className="font-bold text-xl tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#0EA5E9]">Scalify</span>
        </Link>
        <a
          href="#enrol"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#15803D] text-white text-sm font-semibold hover:opacity-90 transition shadow-md shadow-green-100"
        >
          Pay Rs. 99 Now · Rs. 4,900 After Session
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
                <div className="text-3xl font-extrabold text-[#16A34A]">Rs. 4,999</div>
                <div className="text-xs text-[#9CA3AF] mt-0.5">Rs. 99 now · Rs. 4,900 after session</div>
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

          {/* Right — Booking Flow */}
          <div id="enrol" className="bg-white border border-[#E5E7EB] rounded-2xl p-6 lg:sticky lg:top-24 shadow-xl shadow-gray-100">
            <h3 className="text-[#0F172A] text-lg font-bold mb-0.5">Book Your Seat</h3>
            <p className="text-[#9CA3AF] text-xs mb-5">Pay Rs. 99 now to confirm · Rs. 4,900 at start of session</p>
            <BookingFlow />
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
            <p className="mt-4 text-[#6B7280] max-w-xl mx-auto text-base">Rs. 4,999 — one time. Here's exactly what you walk away with.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: '🎙️',
                title: '4 Hour Live One-on-One Masterclass',
                desc: 'Just you and the trainer. No batch, no crowd. Full attention on your questions and your business. 🗣️ Language: Hindi + Hinglish — easy to follow, no jargon.',
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
              Pay Rs. 99 Now · Rs. 4,900 After Session
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
            <h3 className="text-2xl font-extrabold text-[#0F172A] mb-6">Rs. 4,999 — everything included</h3>
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
              Pay Rs. 99 Now · Rs. 4,900 After Session
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
            4 hours. Rs. 4,999. 1 year of support. Everything you need to start ranking your business on Google — taught with your business in mind.
          </p>
          <a
            href="#enrol"
            className="inline-block px-12 py-5 rounded-2xl bg-gradient-to-r from-[#16A34A] to-[#15803D] text-white text-lg font-extrabold hover:opacity-90 transition shadow-2xl shadow-green-100"
          >
            Pay Rs. 99 Now · Rs. 4,900 After Session
          </a>
          <p className="mt-4 text-sm text-[#9CA3AF]">Pay just Rs. 99 now — Rs. 4,900 remaining at the start of your session.</p>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/916353583148?text=Hi%2C%20I%27m%20interested%20in%20the%20SEO%20Masterclass.%20Can%20you%20help%20me%3F"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-2xl hover:bg-[#20BA5A] active:scale-95 transition-all group"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="text-sm font-bold">Still deciding? WhatsApp us</span>
      </a>

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
