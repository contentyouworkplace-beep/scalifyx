'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Offer {
  id: string;
  name: string;
  description?: string;
  plan_type?: string;
  price?: number;
  original_price?: number;
  trial_days?: number;
  features: string[];
  is_active?: boolean;
  sort_order?: number;
}

export function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const { signUp } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [offer, setOffer] = useState<Offer | null>(null);

  // Fetch offers when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchOffers = async () => {
        try {
          const response = await fetch('/api/offers');
          const data = await response.json();
          const activeOffer = data.offers?.[0];
          if (activeOffer) {
            setOffer(activeOffer);
          }
        } catch (err) {
          console.error('Failed to fetch offers:', err);
        }
      };

      fetchOffers();
      setName('');
      setPhone('');
      setEmail('');
      setPassword('');
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!loading) return;
    const base = 'Creating your account';
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
    if (!name.trim()) { setError('Please enter your company name.'); return; }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid WhatsApp number.'); return;
    }
    if (!email.trim()) { setError('Please enter your email.'); return; }
    if (!password.trim()) { setError('Please enter a password.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    const result = await signUp(email, password, name, phone);

    if (!result.success) {
      setError(result.error || 'Something went wrong. Please try again.');
      setLoading(false);
      return;
    }

    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead');
    }
    router.replace('/signup-success');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[75vh] rounded-3xl border border-border bg-card shadow-2xl overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="sticky top-5 right-5 float-right z-10 w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 hover:border-zinc-500 flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition"
          title="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="p-4 lg:p-6">
          {/* Header with trial offer */}
          <div className="mb-6 pb-6 border-b border-border">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-px w-5 bg-green-500" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-green-400">Growth Plan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Start Your 7-Day <span className="text-green-400">Free Trial</span>
            </h2>
            <p className="text-zinc-400 text-sm">
              No credit card required — Get full access instantly
            </p>
          </div>

          {/* Signup form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Company Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-inputBg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-green-500/50 focus:outline-none transition"
                placeholder="Your business name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">WhatsApp Number</label>
              <div className="flex rounded-xl border border-border bg-inputBg overflow-hidden focus-within:border-green-500/50 transition">
                <span className="flex items-center px-4 text-zinc-500 text-sm border-r border-border select-none">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  required
                  className="flex-1 py-3 px-4 bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none"
                  placeholder="10-digit number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-inputBg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-green-500/50 focus:outline-none transition"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-inputBg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-green-500/50 focus:outline-none transition"
                placeholder="Min 6 characters"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {offer && offer.features && offer.features.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-1.5">
                {offer.features.slice(0, 12).map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5 text-green-400">
                      <circle cx="8" cy="8" r="7.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M4.5 8L6.5 10L11.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-[11px] leading-tight text-zinc-300">{feature}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-green-500 hover:bg-green-400 text-white font-bold text-sm py-3 transition active:scale-[0.99] disabled:opacity-50 mt-4"
            >
              {loading ? loadingText : 'Activate My 7 Days Free Trial'}
            </button>
          </form>

          {/* Footer info */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-center text-xs text-zinc-600">
              ✓ No credit card required · ✓ Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
