'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  spotsLeft: number;
}


export function SignupModal({ isOpen, onClose, spotsLeft }: SignupModalProps) {
  const { signUp } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
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

    router.replace('/signup-success');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[75vh] rounded-3xl border border-border bg-card shadow-2xl overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="sticky top-4 right-4 float-right z-10 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-border flex items-center justify-center text-zinc-400 hover:text-white transition"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
