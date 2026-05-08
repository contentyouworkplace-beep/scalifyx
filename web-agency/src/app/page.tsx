'use client';

import Link from 'next/link';
import Script from 'next/script';
import { Logo } from '@/components/Logo';
import {
  PaletteIcon, SearchIcon, ShieldIcon, HeadsetIcon,
  GlobeIcon, ChartIcon
} from '@/components/Icons';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

function ContactForm() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [projectType, setProjectType] = useState('web-design');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  useEffect(() => {
    if (!loading) return;
    const base = 'Submitting your inquiry';
    let dots = 0;
    setLoadingText(base);
    const interval = setInterval(() => {
      dots = (dots + 1) % 4;
      setLoadingText(base + '.'.repeat(dots));
    }, 400);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!email.trim()) { setError('Please enter your email.'); return; }
    if (!company.trim()) { setError('Please enter your company name.'); return; }

    setLoading(true);

    // Create a temporary password for the inquiry account
    const tempPassword = 'TempPass123!';
    const result = await signUp(email, tempPassword, name, phone || '');

    if (!result.success) {
      if (!result.error?.includes('already exists')) {
        setError(result.error || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }
    }

    // Redirect to inquiry submitted page
    router.replace('/inquiry-submitted');
  };

  return (
    <div id="contact-form" className="rounded-2xl border border-border bg-card p-7 sm:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="h-px w-5 bg-green-500" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-green-400">Get Started Today</span>
        </div>
        <h2 className="text-2xl sm:text-[26px] font-extrabold text-white leading-[1.15]">
          Let's discuss your project.
        </h2>
        <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
          Share details about your project and we'll get back to you within 24 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-xl border border-border bg-inputBg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-green-500/50 focus:outline-none transition"
          placeholder="Your name"
        />
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
          className="w-full rounded-xl border border-border bg-inputBg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-green-500/50 focus:outline-none transition"
          placeholder="Company name"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-xl border border-border bg-inputBg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-green-500/50 focus:outline-none transition"
          placeholder="Email address"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
          className="w-full rounded-xl border border-border bg-inputBg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-green-500/50 focus:outline-none transition"
          placeholder="Phone (optional)"
        />
        <select
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
          className="w-full rounded-xl border border-border bg-inputBg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-green-500/50 focus:outline-none transition"
        >
          <option value="web-design">Web Design & Development</option>
          <option value="ecommerce">E-commerce Solutions</option>
          <option value="branding">Branding & Logo Design</option>
          <option value="marketing">Digital Marketing</option>
          <option value="seo">SEO & Content Marketing</option>
          <option value="other">Other Services</option>
        </select>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-green-500 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-green-400 active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? loadingText : 'Submit Project Inquiry'}
        </button>
      </form>

      <div className="mt-5 pt-5 border-t border-border flex items-center justify-between text-xs text-zinc-700">
        <span>Free consultation</span>
        <span>·</span>
        <span>No obligation</span>
        <span>·</span>
        <span>24hr response</span>
      </div>
    </div>
  );
}

const FAQS = [
  {
    q: 'What services do you offer?',
    a: 'We specialize in web design & development, e-commerce solutions, branding, digital marketing, and SEO. Each project is tailored to your specific business goals and audience.',
  },
  {
    q: 'How much does a project cost?',
    a: 'Project costs vary based on scope and complexity. A consultation call helps us understand your requirements and provide an accurate quote. We work with budgets ranging from ₹50,000 to ₹5,00,000+.',
  },
  {
    q: 'How long does a typical project take?',
    a: 'Most web design projects take 4-8 weeks from discovery to launch. E-commerce platforms may take 8-12 weeks. We provide a detailed timeline during the planning phase.',
  },
  {
    q: 'Do you offer ongoing support after launch?',
    a: 'Yes! We offer maintenance packages including security updates, performance optimization, content updates, and technical support. Many clients stay with us long-term.',
  },
  {
    q: 'Can you help with my existing website?',
    a: 'Absolutely. Whether you need a redesign, migration, performance optimization, or feature updates — we can audit your current site and recommend improvements.',
  },
  {
    q: 'What about SEO?',
    a: 'SEO is built into our web design process. We optimize technical SEO, site structure, page load speed, and content strategy. We also offer dedicated SEO packages for existing sites.',
  },
  {
    q: 'Do you work with specific industries?',
    a: 'We\'ve built successful solutions for restaurants, e-commerce brands, SaaS companies, agencies, nonprofits, and service providers. No industry is off-limits.',
  },
  {
    q: 'How do I get started?',
    a: 'Fill out the project inquiry form above or email us. We\'ll schedule a free consultation to discuss your vision, goals, and timeline. Then we\'ll send you a proposal.',
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
            Frequently Asked<br />
            <span className="text-green-400">Questions.</span>
          </h2>
          <p className="mt-4 text-zinc-500 text-lg">Everything you need to know.</p>
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
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const scrollToForm = () => {
    const target = document.getElementById('contact-form');
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
            <span className="truncate">Professional web design & development for your business</span>
          </p>
        </div>
      </div>

      {/* ── NAV ── */}
      <nav className="fixed top-9 w-full z-50 bg-bg/85 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/"><Logo size={30} /></Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-zinc-500 hover:text-white text-sm transition">Services</a>
            <a href="#process" className="text-zinc-500 hover:text-white text-sm transition">Our Process</a>
            <a href="#faq" className="text-zinc-500 hover:text-white text-sm transition">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-zinc-500 hover:text-white transition px-3 py-2">Login</Link>
            <button
              onClick={scrollToForm}
              className="hidden sm:block text-sm font-semibold px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-400 transition"
            >
              Get Quote
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center gap-2 justify-center mb-6">
            <span className="h-px w-5 bg-green-500" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-green-400">Professional Web Agency</span>
            <span className="h-px w-5 bg-green-500" />
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
            Professional Web Design &<br />
            <span className="text-green-400">Development Solutions</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 mb-8 leading-relaxed">
            Custom websites, e-commerce platforms, and digital solutions built by experienced designers and developers. We create online experiences that convert visitors into customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToForm}
              className="px-8 py-4 rounded-xl bg-green-500 text-white font-bold hover:bg-green-400 transition"
            >
              Get Started
            </button>
            <button
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-xl border border-border text-white font-bold hover:bg-white/5 transition"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-28 px-4 sm:px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center gap-3 justify-center mb-6">
              <span className="h-px w-8 bg-zinc-800" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Our Services</span>
              <span className="h-px w-8 bg-zinc-800" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] mb-4">
              What We Build
            </h2>
            <p className="text-lg text-zinc-400">End-to-end solutions for your digital presence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: PaletteIcon, title: 'Web Design & Development', desc: 'Custom, responsive websites built from scratch with the latest technologies.' },
              { icon: GlobeIcon, title: 'E-commerce Solutions', desc: 'Full-featured online stores with payment integration, inventory, and customer management.' },
              { icon: SearchIcon, title: 'SEO & Content Strategy', desc: 'Technical SEO optimization and content strategy to rank higher and attract organic traffic.' },
              { icon: ChartIcon, title: 'Digital Marketing', desc: 'Paid campaigns, social media strategy, and conversion optimization.' },
              { icon: ShieldIcon, title: 'Branding & Design', desc: 'Logo design, brand identity, and visual design systems.' },
              { icon: HeadsetIcon, title: 'Ongoing Support', desc: 'Maintenance, security updates, and technical support after launch.' },
            ].map((service, i) => {
              const Icon = service.icon;
              return (
                <div key={i} className="rounded-2xl border border-border bg-card p-8 hover:border-green-500/30 transition">
                  <Icon className="w-12 h-12 text-green-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{service.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section id="process" className="py-28 px-4 sm:px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center gap-3 justify-center mb-6">
              <span className="h-px w-8 bg-zinc-800" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Our Process</span>
              <span className="h-px w-8 bg-zinc-800" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] mb-4">
              How We Work
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Discovery', desc: 'We learn about your business, goals, and target audience.' },
              { step: '2', title: 'Strategy', desc: 'We create a detailed plan including design mockups and technical approach.' },
              { step: '3', title: 'Development', desc: 'Our team builds your website or application with best practices.' },
              { step: '4', title: 'Launch & Support', desc: 'We deploy your project and provide ongoing maintenance.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-400">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ── */}
      <section className="py-28 px-4 sm:px-6 border-t border-border">
        <div className="max-w-2xl mx-auto">
          <ContactForm />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq">
        <FAQSection />
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 px-4 sm:px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <Link href="/" className="mb-6 md:mb-0"><Logo size={24} /></Link>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-zinc-500 hover:text-white transition">Privacy</Link>
              <Link href="/terms" className="text-sm text-zinc-500 hover:text-white transition">Terms</Link>
              <Link href="/contact" className="text-sm text-zinc-500 hover:text-white transition">Contact</Link>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-zinc-600">© {new Date().getFullYear()} Scalify. Professional Web Design & Development Agency.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
