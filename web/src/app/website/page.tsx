'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { Logo } from '@/components/Logo';
import { CheckCircleIcon } from '@/components/Icons';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function WebsitePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [whatsappQuery, setWhatsappQuery] = useState('');

  const handlePayNow = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/payment/create-payment-link', {
        method: 'POST',
        body: JSON.stringify({ redirectTo: '/payment-success' }),
      });
      if (data.success && data.paymentLink) {
        sessionStorage.setItem('paymentReturnUrl', '/payment-success');
        window.location.href = data.paymentLink;
      } else {
        toast.error('Failed to create payment link');
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to create payment link';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppQuery = () => {
    const message = whatsappQuery || 'Hi Scalify team! I have a question about your website design service.';
    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/916353583148?text=${encodedMsg}`, '_blank');
    setShowWhatsApp(false);
    setWhatsappQuery('');
  };

  const inclusions = [
    {
      icon: '🎨',
      title: 'Professional Website Design',
      description: 'Custom-designed website tailored to your business needs',
    },
    {
      icon: '⚡',
      title: 'Fast Loading Speed',
      description: 'Optimized for performance and lightning-fast user experience',
    },
    {
      icon: '🔍',
      title: 'Basic SEO Setup',
      description: 'SEO fundamentals configured for better search visibility',
    },
    {
      icon: '🏠',
      title: 'Free Hosting Setup',
      description: 'Complete hosting configuration included in your package',
    },
  ];

  const faqs = [
    {
      q: 'What exactly do I get for ₹199?',
      a: 'A professional, custom-designed website that looks like you paid thousands for it. Includes beautiful design, fast loading, SEO setup, and hosting. We handle everything.',
    },
    {
      q: 'I have no design skills. Is that OK?',
      a: 'Perfect. We handle all the design work. You just need to tell us about your business.',
    },
    {
      q: 'How fast will my website be live?',
      a: '5-7 business days from the day you pay. We\'ve optimized this process to move fast without cutting corners.',
    },
    {
      q: 'What if I don\'t like it?',
      a: 'We offer unlimited revisions until you\'re happy. And if it\'s not right, you can cancel anytime with no penalty.',
    },
    {
      q: 'Do you update and maintain it?',
      a: 'Yes. Website updates, security patches, speed optimization—all included. You focus on your business.',
    },
    {
      q: 'What happens if I cancel?',
      a: 'We give you a backup of your website. No lock-in, no drama. You own your content.',
    },
  ];

  const demos = [
    { title: 'Friends Factory Cafe', url: 'https://friendsfactorycafe.com/', icon: '☕' },
    { title: 'Wedding Planner Vadodara', url: 'https://weddingplannervadodara.in/', icon: '💒' },
    { title: 'Waterproofing Vadodara', url: 'https://waterproofingvadodara.com/', icon: '🏗️' },
    { title: 'Interior Design Vadodara', url: 'https://interiordesignvadodara.in/', icon: '🎨' },
    { title: 'Solar Installation', url: 'https://solarinstallationvadodara.in/', icon: '☀️' },
    { title: 'Wow Shaadi', url: 'https://wowshaadi.com/', icon: '💍' },
  ];

  return (
    <div className="min-h-screen bg-bg text-white">
      <style>{`
        @keyframes slowBlink {
          0%, 49%, 100% { opacity: 1; }
          50%, 99% { opacity: 0.3; }
        }
        .slow-blink {
          animation: slowBlink 3s ease-in-out infinite;
        }
      `}</style>
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-card/30 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <Logo size={32} />
            </Link>
            <div className="flex items-center gap-4">
              {/* Money Back Guarantee Badge */}
              <div className="slow-blink">
                <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center gap-1">
                  <span className="text-amber-400 text-xs font-semibold">💰 15 Days Money Back</span>
                </div>
              </div>
              {user && (
                <Link href="/dashboard" className="text-sm text-green-400 hover:text-green-300 transition">
                  Go to Dashboard →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - Short & Punchy */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
            Professional Website
            <br />
            <span className="text-green-400">Starting at ₹199/month</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-2">
            750+ businesses already online. No design skills needed. We handle everything.
          </p>
        </div>
      </div>

      {/* Main Pricing Card - Hero Product */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-20">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-3xl border border-green-500/30 bg-gradient-to-br from-card to-card/50 p-10 sm:p-14 shadow-2xl shadow-green-500/10">
            {/* Price */}
            <div className="text-center mb-10">
              <div className="inline-flex items-baseline gap-3 mb-4">
                <span className="text-7xl font-extrabold text-green-400">₹199</span>
                <span className="text-2xl text-zinc-400">/month</span>
              </div>
              <p className="text-zinc-400 text-lg">Billed monthly. Cancel anytime. No surprises.</p>
            </div>

            {/* Inclusions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {inclusions.map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="text-3xl flex-shrink-0">{item.icon}</div>
                  <div>
                    <p className="font-semibold text-white mb-1">{item.title}</p>
                    <p className="text-sm text-zinc-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={handlePayNow}
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-green-500 to-green-400 px-8 py-5 text-lg font-bold text-white hover:shadow-lg hover:shadow-green-500/50 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {loading ? 'Processing...' : 'Start Your Website Now →'}
            </button>

            <p className="text-center text-sm text-zinc-500">
              Secure payment via Razorpay. We never store your card details.
            </p>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-20">
        <div className="rounded-2xl border border-border bg-card/30 p-10 sm:p-12 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Why Most Businesses Stay Offline</h2>
          <div className="space-y-4 text-zinc-300">
            <p className="text-lg">You have a great business. But without a web presence, potential customers can't find you.</p>
            <p className="text-lg">Expensive agencies want ₹50,000+. WordPress is confusing. Wix looks generic. And you're stuck.</p>
            <p className="text-lg font-semibold text-green-400">It doesn't have to be this way.</p>
          </div>
        </div>
      </div>

      {/* Portfolio/Demos Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3">Beautiful Websites We've Built</h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">750+ businesses across industries. All starting at ₹199/month.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {demos.map((demo, idx) => (
            <a
              key={idx}
              href={demo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-card/50 to-card/20 hover:border-green-500/50 transition-all duration-300 h-64 sm:h-72"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <div className="text-6xl mb-4">{demo.icon}</div>
                <p className="text-white font-bold text-lg mb-4 group-hover:text-green-400 transition">{demo.title}</p>
                <button className="px-5 py-2 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-400 transition transform group-hover:scale-105 active:scale-95">
                  View Live
                </button>
              </div>

              {/* Hover overlay with arrow */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40">
                <div className="text-center">
                  <svg className="w-12 h-12 text-green-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <p className="text-white text-sm font-semibold">Click to explore</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        <p className="text-center text-zinc-500 text-sm mt-8">All live websites built with our service. Click any to see them in action.</p>
      </div>

      {/* Trust Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-20">
        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-10 sm:p-14">
          <h2 className="text-3xl font-bold mb-10 text-center">Why 750+ Businesses Choose Scalify</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">750+</div>
              <p className="text-zinc-400">Websites Live</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">5-7 Days</div>
              <p className="text-zinc-400">From Payment to Launch</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">0 Skills</div>
              <p className="text-zinc-400">Required from You</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">24/7</div>
              <p className="text-zinc-400">WhatsApp Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-20">
        <h2 className="text-3xl font-bold mb-12 text-center">Simple as 1, 2, 3, 4</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { num: '1', title: 'Pay ₹199', desc: 'Secure payment. No hidden charges.' },
            { num: '2', title: 'Share Your Story', desc: 'Tell us about your business on WhatsApp.' },
            { num: '3', title: 'We Design', desc: 'Our team builds your custom website.' },
            { num: '4', title: 'You Launch', desc: 'Website goes live. You start winning.' },
          ].map((step, idx) => (
            <div key={idx} className="rounded-xl border border-border bg-card/50 p-6 hover:bg-card transition">
              <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center font-bold text-green-400 text-xl mb-4">
                {step.num}
              </div>
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-zinc-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-20">
        <h2 className="text-3xl font-bold mb-10 text-center">Questions?</h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group rounded-xl border border-border bg-card/50 p-5 hover:bg-card transition cursor-pointer"
            >
              <summary className="flex items-center justify-between font-semibold text-white">
                <span>{faq.q}</span>
                <span className="text-zinc-500 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="mt-4 text-sm text-zinc-400">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-20">
        <div className="rounded-3xl border border-green-500/30 bg-gradient-to-r from-green-500/10 to-green-400/5 p-10 sm:p-14 text-center">
          <h3 className="text-4xl font-bold mb-4">Ready to Go Online?</h3>
          <p className="text-zinc-400 mb-2 text-lg">Join 750+ businesses who chose Scalify.</p>
          <p className="text-zinc-500 mb-8">Starting at just ₹199/month.</p>
          <button
            onClick={handlePayNow}
            disabled={loading}
            className="inline-block rounded-xl bg-green-500 px-12 py-4 text-lg font-bold text-white hover:bg-green-400 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Launch Your Website Today'}
          </button>
          <p className="text-xs text-zinc-600 mt-6">Free consultation. No credit card. Cancel anytime.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-card/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><Link href="/" className="hover:text-white transition">Home</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a href="https://wa.me/916353583148?text=Hi%20Scalify%20team" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">WhatsApp</a></li>
                <li><Link href="/refund" className="hover:text-white transition">Refund Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><Link href="/shipping" className="hover:text-white transition">Shipping</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 text-center text-sm text-zinc-600">
            <p>&copy; 2026 Scalify. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* WhatsApp Sticky Button with Query */}
      <div className="fixed bottom-6 right-6 z-50">
        {showWhatsApp && (
          <div className="absolute bottom-20 right-0 w-80 sm:w-96 bg-card border border-border rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                </svg>
                Ask Us
              </h4>
              <button onClick={() => setShowWhatsApp(false)} className="text-zinc-500 hover:text-white">
                ✕
              </button>
            </div>
            <textarea
              value={whatsappQuery}
              onChange={(e) => setWhatsappQuery(e.target.value)}
              placeholder="What's your question? (e.g., Can you design for my cafe?)"
              className="w-full bg-bg border border-border rounded-lg p-3 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-green-500 resize-none mb-3"
              rows={3}
            />
            <button
              onClick={handleWhatsAppQuery}
              className="w-full bg-green-500 hover:bg-green-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
              </svg>
              Send on WhatsApp
            </button>
          </div>
        )}

        <button
          onClick={() => setShowWhatsApp(!showWhatsApp)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold py-4 px-6 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-110 active:scale-95"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
          </svg>
          <span className="hidden sm:inline">Ask a Question</span>
        </button>
      </div>
    </div>
  );
}
