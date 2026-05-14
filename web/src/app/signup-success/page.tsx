'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/Logo';
import { CheckCircleIcon } from '@/components/Icons';
import { apiFetch } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function SignupSuccess() {
  const router = useRouter();
  const { session } = useAuth();
  const [daysLeft, setDaysLeft] = useState<number>(7);

  useEffect(() => {
    if (!session) return; // wait for auth to be ready
    apiFetch('/payment/start-trial')
      .then(data => {
        const days = data?.subscription?.trialDays ?? data?.subscription?.daysLeft;
        if (days != null && days > 0) setDaysLeft(days);
      })
      .catch(() => {}); // keep the 7-day default on error
  }, [session]);

  return (
    <div className="min-h-screen bg-bg text-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Logo size={40} />
        </div>

        {/* Success Card */}
        <div className="rounded-2xl border border-border bg-card p-8">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-500/20 p-4">
              <CheckCircleIcon className="w-12 h-12 text-green-400" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-extrabold text-center mb-2">
            Account Created!
          </h1>
          <p className="text-center text-zinc-400 mb-6">
            Welcome to Scalify. Your account is ready.
          </p>

          {/* Trial Countdown */}
          {daysLeft !== null && (
            <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30">
              <div className="flex items-center gap-3">
                <div className="text-2xl">⏰</div>
                <div>
                  <p className="text-sm text-zinc-400">Free Trial Remaining</p>
                  <p className="text-lg font-bold text-green-400">
                    {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="mb-8 space-y-3">
            <p className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
              Next Steps
            </p>

            <div className="space-y-3">
              {/* Option 1 */}
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full p-4 rounded-xl border border-green-500/30 bg-green-500/10 hover:bg-green-500/20 transition text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-green-400">✨</div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-green-400 transition">
                      Complete Your Business Profile
                    </h3>
                    <p className="text-sm text-zinc-500">Add details about your business (2 min)</p>
                  </div>
                </div>
              </button>

              {/* Option 2 */}
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full p-4 rounded-xl border border-border bg-card/50 hover:bg-card transition text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">🚀</div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-green-400 transition">
                      Build Your Website with AI
                    </h3>
                    <p className="text-sm text-zinc-500">Create your first website in minutes (5 min)</p>
                  </div>
                </div>
              </button>

              {/* Option 3 */}
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full p-4 rounded-xl border border-border bg-card/50 hover:bg-card transition text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">📊</div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-green-400 transition">
                      Explore Your Dashboard
                    </h3>
                    <p className="text-sm text-zinc-500">See all available features and settings</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 p-4 mb-6">
            <p className="text-sm text-blue-200">
              ✓ No credit card required<br/>
              ✓ No setup fee<br/>
              ✓ Cancel anytime
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full rounded-xl bg-green-500 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-green-400 active:scale-[0.99]"
          >
            Go to Dashboard →
          </button>

          {/* Help Text */}
          <p className="text-center text-xs text-zinc-600 mt-6">
            Questions? Check out our{' '}
            <Link href="/#faqs" className="text-green-400 hover:text-green-300 transition">
              FAQs
            </Link>
            {' '}or contact us
          </p>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-zinc-700 mt-8">
          Check your email for account confirmation
        </p>
      </div>
    </div>
  );
}
