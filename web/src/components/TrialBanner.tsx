'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export function TrialBanner() {
  const { user } = useAuth();

  // Show for free/trial users who haven't paid
  if (!user?.plan || user.plan === 'pro') return null;

  return (
    <div className="mb-4 md:mb-6 rounded-2xl bg-primary/10 border border-primary/30 p-4 md:p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-sm md:text-base font-semibold text-primary">
            Your website is ready to be built
          </p>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Upgrade to Scalify Pro to complete your profile and go live on Google
          </p>
        </div>
        <Link
          href="/dashboard/plans"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-semibold text-sm rounded-lg transition whitespace-nowrap"
        >
          Upgrade Now →
        </Link>
      </div>
    </div>
  );
}
