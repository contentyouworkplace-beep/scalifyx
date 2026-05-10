'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@/components/Logo';
import { useState } from 'react';

export default function WebsitePage() {
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [whatsappQuery, setWhatsappQuery] = useState('');

  const PAYMENT_LINK = 'https://rzp.io/rzp/GBnrfLOh';

  const handlePayNow = () => {
    window.location.href = PAYMENT_LINK;
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
    {
      icon: '🌐',
      title: 'Add Your Custom Domain',
      description: 'Domain must be purchased separately. We\'ll integrate it with your website.',
    },
  ];

  const faqs = [
    {
      q: 'What exactly do I get for ₹199?',
      a: 'A professional, custom-designed website that looks like you paid thousands for it. Includes beautiful design, fast loading, SEO setup, and hosting. We handle everything.',
    },
    {
      q: 'What about domain names?',
      a: 'Domains are not included in the ₹199 package. You need to purchase a domain separately from a registrar like GoDaddy, Namecheap, or others. Once purchased, we\'ll integrate it with your website at no extra cost. Domain costs vary but typically start from ₹300-500/year.',
    },
    {
      q: 'I have no design skills. Is that OK?',
      a: 'Perfect. We handle all the design work. You just need to tell us about your business.',
    },
    {
      q: 'How fast will my website be live?',
      a: '5 business days from the day you pay. We\'ve optimized this process to move fast without cutting corners.',
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
      a: "It's easy to cancel anytime—just one click, But your website will no longer be available.",
    },
  ];

  const demos = [
    { title: "Friends Factory Cafe", subtitle: 'Cafe Business', url: 'https://friendsfactorycafe.com/', image: '/screenshots/1.png' },
    { title: 'Wedding Planner Vadodara', subtitle: 'Wedding Planning', url: 'https://weddingplannervadodara.in/', image: '/screenshots/2.png' },
    { title: 'Waterproofing Vadodara', subtitle: 'Construction Services', url: 'https://waterproofingvadodara.com/', image: '/screenshots/3.png' },
    { title: 'Interior Design Vadodara', subtitle: 'Interior Design', url: 'https://interiordesignvadodara.in/', image: '/screenshots/4.png' },
    { title: 'Solar Installation', subtitle: 'Solar Energy', url: 'https://solarinstallationvadodara.in/', image: '/screenshots/5.png' },
    { title: 'Wow Shaadi', subtitle: 'Wedding Services', url: 'https://wowshaadi.com/', image: '/screenshots/6.png' },
  ];

  return (
    <div className="min-h-screen bg-bg text-white">
      <style>{`
        @keyframes glow-pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
        .slow-blink {
          animation: glow-pulse 2.5s ease-in-out infinite;
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
                <Link href="/refund" className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center gap-1 hover:bg-amber-500/30 transition">
                  <span className="text-amber-400 text-xs font-semibold">💰 14 Days Money Back Guarantee</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - Short & Punchy */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 overflow-hidden">
        {/* Background Image with Low Opacity */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/hero-image.webp"
            alt="background"
            fill
            className="object-cover opacity-15"
            priority
          />
        </div>
        <div className="text-center relative z-10">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
            Your Competitors Are Online.
            <br />
            <span className="text-green-400">You Should Be Too.</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-4">
            Professional website live in 5 days — starting at ₹199/month.
          </p>
          <p className="text-sm text-zinc-500 max-w-2xl mx-auto">
            750+ small businesses found on Google with Scalify.
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
              className="w-full rounded-2xl bg-gradient-to-r from-green-500 to-green-400 px-8 py-5 text-lg font-bold text-white hover:shadow-lg hover:shadow-green-500/50 active:scale-[0.98] transition-all mb-4"
            >
              Start Your Website Now →
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
              className="group relative rounded-2xl overflow-hidden border border-border hover:border-green-500/50 transition-all duration-300 h-64 sm:h-72"
            >
              {/* Background Image */}
              <Image
                src={demo.image}
                alt={demo.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Business info overlay - always visible at bottom */}
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                <div />
                <div className="bg-gradient-to-t from-black/80 to-transparent pt-8 pb-2">
                  <h3 className="text-white font-semibold text-lg">{demo.title}</h3>
                  <p className="text-green-400 text-sm">{demo.subtitle}</p>
                </div>
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
              <div className="text-4xl font-bold text-green-400 mb-2">5 Days</div>
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
          <p className="text-zinc-400 mb-4 text-lg">Join 750+ businesses who chose Scalify.</p>
          <p className="text-green-400 font-semibold mb-8 text-lg">Only 30 websites per month. Limited spots available.</p>
          <button
            onClick={handlePayNow}
            className="inline-block rounded-xl bg-green-500 px-12 py-4 text-lg font-bold text-white hover:bg-green-400 active:scale-[0.98] transition"
          >
            Get My Website for ₹199 →
          </button>
          <p className="text-xs text-zinc-600 mt-6">14-day money back · No hidden charges · WhatsApp support</p>
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
                  <path d="M12.031 6.172c-3.181 0-5.77 2.586-5.77 5.766 0 1.22.334 2.372.913 3.355L6.5 19.346l4.357-1.433c.996.528 2.135.832 3.174.832 3.18 0 5.768-2.586 5.768-5.766 0-3.18-2.588-5.766-5.768-5.766zm3.353 8.795c-.147.392-.468.643-.9.643-.432 0-.753-.25-.9-.643-.075-.2-.122-.436-.122-.672 0-.655.334-1.227.834-1.565.126-.098.268-.146.42-.146.15 0 .294.048.42.146.5.338.834.91.834 1.565 0 .236-.047.472-.122.672z"/>
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
                <path d="M12.031 6.172c-3.181 0-5.77 2.586-5.77 5.766 0 1.22.334 2.372.913 3.355L6.5 19.346l4.357-1.433c.996.528 2.135.832 3.174.832 3.18 0 5.768-2.586 5.768-5.766 0-3.18-2.588-5.766-5.768-5.766zm3.353 8.795c-.147.392-.468.643-.9.643-.432 0-.753-.25-.9-.643-.075-.2-.122-.436-.122-.672 0-.655.334-1.227.834-1.565.126-.098.268-.146.42-.146.15 0 .294.048.42.146.5.338.834.91.834 1.565 0 .236-.047.472-.122.672z"/>
              </svg>
              Send on WhatsApp
            </button>
          </div>
        )}

        <button
          onClick={() => setShowWhatsApp(!showWhatsApp)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold py-4 px-6 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-110 active:scale-95"
          title="Post-Purchase Support"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.77 2.586-5.77 5.766 0 1.22.334 2.372.913 3.355L6.5 19.346l4.357-1.433c.996.528 2.135.832 3.174.832 3.18 0 5.768-2.586 5.768-5.766 0-3.18-2.588-5.766-5.768-5.766zm3.353 8.795c-.147.392-.468.643-.9.643-.432 0-.753-.25-.9-.643-.075-.2-.122-.436-.122-.672 0-.655.334-1.227.834-1.565.126-.098.268-.146.42-.146.15 0 .294.048.42.146.5.338.834.91.834 1.565 0 .236-.047.472-.122.672z"/>
          </svg>
          <span className="hidden sm:inline">Post-Purchase Support</span>
        </button>
      </div>
    </div>
  );
}
