'use client';

import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://api.scalifyapp.com/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="min-h-screen bg-bg text-white">
      <nav className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/"><Logo size={28} /></Link>
          <Link href="/" className="text-sm text-zinc-500 hover:text-white transition">← Back to Home</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Support</p>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Contact Us</h1>
          <p className="text-zinc-400 text-base max-w-xl">We're here to help. Reach out via any channel below and we'll get back to you within 24 hours on business days.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Contact Channels */}
          <div className="space-y-4">
            <ContactCard
              icon="📧"
              title="Email Support"
              detail="support@scalifyapp.com"
              href="mailto:support@scalifyapp.com"
              sub="Response within 24 hours"
            />
            <ContactCard
              icon="💬"
              title="WhatsApp"
              detail="+91 63535 83148"
              href="https://wa.me/916353583148"
              sub="Fastest response — usually within the hour"
              external
            />
            <ContactCard
              icon="🌐"
              title="Website"
              detail="scalifyapp.com"
              href="/"
              sub="Manage your account and website"
            />
          </div>

          {/* Business Info */}
          <div className="rounded-2xl bg-zinc-900 border border-border p-6 space-y-4 text-sm text-zinc-400">
            <h2 className="text-base font-bold text-white">Business Information</h2>
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Company</p>
              <p className="text-zinc-200">Scalify</p>
            </div>
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Platform</p>
              <p className="text-zinc-200">scalifyapp.com</p>
            </div>
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Email</p>
              <a href="mailto:support@scalifyapp.com" className="text-green-400 hover:underline">support@scalifyapp.com</a>
            </div>
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">WhatsApp</p>
              <a href="https://wa.me/916353583148" className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">+91 63535 83148</a>
            </div>
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Support Hours</p>
              <p className="text-zinc-200">Mon – Sat, 10 AM – 7 PM IST</p>
            </div>
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Country</p>
              <p className="text-zinc-200">India</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-2xl bg-zinc-900 border border-border p-8">
          <h2 className="text-xl font-bold text-white mb-6">Send a Message</h2>

          {status === 'sent' ? (
            <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-6 text-center">
              <p className="text-2xl mb-2">✅</p>
              <p className="text-green-400 font-semibold text-lg">Message sent!</p>
              <p className="text-zinc-400 text-sm mt-1">We'll get back to you within 24 hours. Check your email or WhatsApp.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full bg-zinc-800 border border-border rounded-xl px-4 py-3 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full bg-zinc-800 border border-border rounded-xl px-4 py-3 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Subject</label>
                <select
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  required
                  className="w-full bg-zinc-800 border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition"
                >
                  <option value="" disabled>Select a topic</option>
                  <option value="billing">Billing &amp; Payments</option>
                  <option value="technical">Technical Issue</option>
                  <option value="website">Website Help</option>
                  <option value="refund">Refund Request</option>
                  <option value="cancellation">Cancellation</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Describe your issue or question..."
                  className="w-full bg-zinc-800 border border-border rounded-xl px-4 py-3 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition resize-none"
                />
              </div>

              {status === 'error' && (
                <p className="text-red-400 text-sm">Something went wrong. Please email us directly at support@scalifyapp.com.</p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full sm:w-auto px-8 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition disabled:opacity-60 text-sm"
              >
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </main>

      <LegalFooter />
    </div>
  );
}

function ContactCard({
  icon, title, detail, href, sub, external,
}: {
  icon: string; title: string; detail: string; href: string; sub: string; external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-900 border border-border hover:border-zinc-600 transition group"
    >
      <span className="text-2xl mt-0.5">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-white group-hover:text-green-400 transition">{title}</p>
        <p className="text-sm text-zinc-300 mt-0.5">{detail}</p>
        <p className="text-xs text-zinc-500 mt-1">{sub}</p>
      </div>
    </a>
  );
}

function LegalFooter() {
  return (
    <footer className="border-t border-border mt-20 py-10 px-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
        <p>© 2026 Scalify. All rights reserved.</p>
        <div className="flex flex-wrap gap-5">
          <Link href="/terms" className="hover:text-white transition">Terms</Link>
          <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
          <Link href="/refund" className="hover:text-white transition">Refund Policy</Link>
          <Link href="/shipping" className="hover:text-white transition">Shipping</Link>
          <Link href="/contact" className="hover:text-white transition">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
