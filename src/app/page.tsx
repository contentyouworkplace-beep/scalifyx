import Link from 'next/link';
import { PLANS, BUSINESS_TYPES, WEBSITE_TEMPLATES } from '@shared/constants';
import { Logo } from '@/components/Logo';
import {
  ChatBotIcon, PaletteIcon, PhoneIcon, SearchIcon, GlobeIcon,
  ChartIcon, WhatsAppIcon, ShieldIcon, HeadsetIcon, RocketIcon,
  RestaurantIcon, ScissorsIcon, HospitalIcon, ScaleIcon, ShoppingBagIcon,
  DumbbellIcon, BookIcon, CameraIcon, CarIcon, HomeOutlineIcon, BriefcaseIcon, WrenchIcon,
} from '@/components/Icons';
import React from 'react';

export default function LandingPage() {
  const plan = PLANS[0];

  return (
    <div className="min-h-screen bg-bg">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-bg/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/"><Logo size={36} /></Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-zinc-400 hover:text-white transition">Features</a>
            <a href="#templates" className="text-zinc-400 hover:text-white transition">Templates</a>
            <a href="#pricing" className="text-zinc-400 hover:text-white transition">Pricing</a>
            <a href="#business" className="text-zinc-400 hover:text-white transition">Business Types</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm text-zinc-300 hover:text-white transition">Login</Link>
            <Link href="/login?tab=signup" className="px-5 py-2 text-sm bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium">
            <RocketIcon size={16} /> AI-Powered Website & SEO — Live in 60 Seconds
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Professional Website with{' '}
            <span className="gradient-text">AI-Powered SEO</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            Get a mobile-responsive website with AI-driven SEO — meta tags, sitemaps, Google indexing — all monitored by our human support team. No coding required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login?tab=signup" className="px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold text-lg transition pulse-glow">
              Get Started
            </Link>
            <a href="#features" className="px-8 py-4 bg-card hover:bg-surface border border-border text-white rounded-xl font-semibold text-lg transition">
              See How It Works
            </a>
          </div>
          <p className="mt-6 text-zinc-500 text-sm">Join 50,000+ businesses already on ScalifyX</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-4">
          {[
            { num: '50,000+', label: 'Businesses' },
            { num: '60 sec', label: 'Average Setup' },
            { num: '99.9%', label: 'Uptime' },
            { num: '₹749/mo', label: 'Starting Price' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl sm:text-3xl font-bold gradient-text">{s.num}</div>
              <div className="text-zinc-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need to Go Online</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">One platform to create, launch, and grow your online presence.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { Icon: ChatBotIcon, title: 'AI-Powered Builder', desc: 'Chat with our AI to create your website. Describe your business and get a professional site instantly.' },
              { Icon: PaletteIcon, title: '12+ Templates', desc: 'Choose from professionally designed templates for restaurants, clinics, salons, portfolios, and more.' },
              { Icon: PhoneIcon, title: 'Mobile Responsive', desc: 'Every website looks perfect on phones, tablets, and desktops. No extra work needed.' },
              { Icon: SearchIcon, title: 'AI-Powered SEO', desc: 'Smart SEO handled by AI — Google Search Console, meta tags, sitemaps, speed optimization — all monitored by our human support team.' },
              { Icon: GlobeIcon, title: 'Custom Domain', desc: 'Use your own domain name or get a free subdomain. SSL certificate included.' },
              { Icon: ChartIcon, title: 'Analytics Dashboard', desc: 'Track visitors, leads, and growth. Monthly reports delivered right to your inbox.' },
              { Icon: WhatsAppIcon, title: 'WhatsApp Integration', desc: 'Floating WhatsApp button so customers can reach you instantly.' },
              { Icon: ShieldIcon, title: 'Free SSL & Hosting', desc: 'Enterprise-grade hosting with 99.9% uptime. SSL certificate included at no extra cost.' },
              { Icon: HeadsetIcon, title: '24/7 Human + AI Support', desc: 'Real humans watching over your website & SEO performance, backed by AI — get help anytime via chat.' },
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/20 transition">
                  <f.Icon size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition">{f.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="py-20 px-4 bg-surface/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Beautiful Templates for Every Business</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">Pick a template or let AI create a custom design for you.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {WEBSITE_TEMPLATES.map((t) => (
              <div key={t.id} className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition cursor-pointer group">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:bg-primary/20 transition">
                  <PaletteIcon size={20} />
                </div>
                <h4 className="font-semibold text-sm group-hover:text-primary transition">{t.name}</h4>
                <p className="text-zinc-500 text-xs mt-1">{t.preview}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Types */}
      <section id="business" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Built for Every Business Type</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">Whether you&apos;re a doctor, salon owner, or freelancer — we&apos;ve got you covered.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {BUSINESS_TYPES.map((b) => {
              const bizIcons: Record<string, React.ComponentType<{size?: number; className?: string}>> = {
                restaurant: RestaurantIcon, salon: ScissorsIcon, doctor: HospitalIcon,
                lawyer: ScaleIcon, shop: ShoppingBagIcon, gym: DumbbellIcon,
                tutor: BookIcon, photographer: CameraIcon, auto: CarIcon,
                realestate: HomeOutlineIcon, freelancer: BriefcaseIcon, other: WrenchIcon,
              };
              const BizIcon = bizIcons[b.id] || BriefcaseIcon;
              return (
                <div key={b.id} className="p-4 rounded-xl bg-card border border-border text-center hover:border-primary/30 transition group">
                  <div className="w-10 h-10 mx-auto rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2 group-hover:bg-primary/20 transition">
                    <BizIcon size={20} />
                  </div>
                  <div className="text-sm font-medium">{b.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-surface/50">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-zinc-400">No hidden fees. Cancel anytime.</p>
          </div>
          <div className="p-8 rounded-2xl bg-card border-2 border-primary relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-bold rounded-full">
              MOST POPULAR
            </div>
            <h3 className="text-2xl font-bold mt-2">{plan.name}</h3>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold gradient-text">₹{plan.price}</span>
              <span className="text-zinc-500 line-through">₹{plan.originalPrice}</span>
              <span className="text-zinc-400">/ {plan.period}</span>
            </div>
            <ul className="mt-6 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <span className="text-primary mt-0.5">✓</span>
                  <span className="text-zinc-300">{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/login?tab=signup" className="mt-8 block w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold text-center transition">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Take Your Business Online?</h2>
          <p className="text-zinc-400 mb-8 text-lg">Create your professional website in 60 seconds.</p>
          <Link href="/login?tab=signup" className="inline-block px-10 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold text-lg transition pulse-glow">
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/"><Logo size={32} /></Link>
            <div className="flex gap-6 text-sm text-zinc-500">
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#pricing" className="hover:text-white transition">Pricing</a>
              <a href="#templates" className="hover:text-white transition">Templates</a>
            </div>
          </div>

          {/* App coming soon */}
          <div className="flex flex-col items-center gap-3 pt-4 border-t border-border w-full">
            <p className="text-zinc-500 text-sm">App coming soon on</p>
            <div className="flex items-center gap-6">
              {/* Google Play */}
              <div className="flex items-center gap-2 text-white">
                <svg width="20" height="22" viewBox="0 0 512 512" fill="white">
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                </svg>
                <span className="text-sm font-medium">Google Play</span>
              </div>
              {/* Apple Store */}
              <div className="flex items-center gap-2 text-white">
                <svg width="18" height="22" viewBox="0 0 384 512" fill="white">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-62.1 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                </svg>
                <span className="text-sm font-medium">App Store</span>
              </div>
            </div>
          </div>

          <div className="text-zinc-600 text-sm">© 2026 ScalifyX. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
