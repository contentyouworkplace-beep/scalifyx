'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLAN_FEATURES = [
  'AI-Powered Business Website',
  'Local SEO & Google Indexing',
  'WhatsApp Lead Capture',
  'Mobile-First Design',
  'SSL & Managed Hosting',
  'Analytics Dashboard',
  'Custom Domain Ready',
  '24/7 Priority Support',
];

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const { signUp, user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [paymentDismissed, setPaymentDismissed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setPhone('');
      setEmail('');
      setPassword('');
      setError('');
      setLoading(false);
      setPaymentDismissed(false);
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

  const openRazorpay = async (prefill: { email: string; name: string }) => {
    try {
      const data = await apiFetch('/payment/create-order', { method: 'POST' });

      if (!data.success) {
        if (data.whatsappFallback) {
          window.open(data.whatsappFallback, '_blank');
          setLoading(false);
          return;
        }
        setError(data.error || 'Failed to initiate payment. Please try again.');
        setLoading(false);
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded) {
        setError('Payment gateway failed to load. Please refresh and try again.');
        setLoading(false);
        return;
      }

      setLoading(false);

      const rzp = new (window as any).Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: 'Scalify',
        description: 'Scalify Pro — ₹1,499/month',
        image: 'https://scalifyapp.com/logo.png',
        prefill,
        theme: { color: '#22c55e' },
        modal: {
          ondismiss: () => setPaymentDismissed(true),
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verify = await apiFetch('/payment/verify', {
              method: 'POST',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            if (verify.success) {
              if (typeof window !== 'undefined' && (window as any).fbq) {
                (window as any).fbq('track', 'Purchase', { value: 1499, currency: 'INR' });
              }
              router.replace('/dashboard');
            } else {
              setError(verify.error || 'Payment verification failed. Contact support on WhatsApp.');
            }
          } catch {
            setError('Verification failed. Please contact support on WhatsApp.');
          }
        },
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message || 'Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

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

    await openRazorpay({ email, name });
  };

  const handleRetryPayment = () => {
    setPaymentDismissed(false);
    setError('');
    setLoading(true);
    openRazorpay({
      email: user?.email || email,
      name: user?.name || name,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[85vh] rounded-3xl border border-border bg-card shadow-2xl overflow-y-auto">
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

        <div className="p-5 lg:p-6">
          {/* Header */}
          <div className="mb-5 pb-5 border-b border-border">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-px w-5 bg-green-500" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-green-400">Growth Plan — ₹1,499/month</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
              Create Your Account
            </h2>
            <p className="text-zinc-400 text-sm">
              One step to get your business live on Google
            </p>
          </div>

          {/* Payment dismissed — retry state */}
          {paymentDismissed && (
            <div className="mb-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
              <p className="text-sm text-yellow-400 font-semibold mb-1">Payment not completed</p>
              <p className="text-xs text-zinc-400 mb-3">Your account was created. Complete payment to access your dashboard.</p>
              {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
              <button
                onClick={handleRetryPayment}
                disabled={loading}
                className="w-full rounded-lg bg-green-500 hover:bg-green-400 text-white font-bold text-sm py-2.5 transition disabled:opacity-50"
              >
                {loading ? 'Opening payment...' : 'Complete Payment — ₹1,499'}
              </button>
            </div>
          )}

          {/* Signup form */}
          {!paymentDismissed && (
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
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-inputBg px-4 py-3 pr-11 text-sm text-white placeholder-zinc-600 focus:border-green-500/50 focus:outline-none transition"
                    placeholder="Min 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Feature list */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-1">
                {PLAN_FEATURES.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5 text-green-400">
                      <circle cx="8" cy="8" r="7.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M4.5 8L6.5 10L11.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-[11px] leading-tight text-zinc-300">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-green-500 hover:bg-green-400 text-white font-bold text-sm py-3.5 transition active:scale-[0.99] disabled:opacity-50 mt-2"
              >
                {loading ? loadingText : 'Create Account & Pay ₹1,499 →'}
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-center text-xs text-zinc-600">
              ✓ Secure payment via Razorpay · ✓ Cancel anytime · ✓ No auto-debit
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
