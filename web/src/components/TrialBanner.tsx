'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function TrialBanner() {
  const { user } = useAuth();
  const [daysLeft, setDaysLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!user?.trial_ends_at) return;

    const calculateDaysLeft = () => {
      const now = new Date();
      const trialEnd = new Date(user.trial_ends_at);
      const diff = trialEnd.getTime() - now.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

      if (days <= 0) {
        setIsExpired(true);
        setDaysLeft(0);
      } else {
        setIsExpired(false);
        setDaysLeft(days);
      }
    };

    calculateDaysLeft();
    const interval = setInterval(calculateDaysLeft, 60000);
    return () => clearInterval(interval);
  }, [user?.trial_ends_at]);

  if (!user?.plan || user.plan !== 'trial') return null;

  if (isExpired) {
    return (
      <div className="mb-4 md:mb-6 rounded-2xl bg-red-500/10 border border-red-500/30 p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-sm md:text-base font-semibold text-red-400">
              Your 7-day free trial has ended
            </p>
            <p className="text-xs md:text-sm text-red-300 mt-1">
              Upgrade to Scalify Pro to keep using all features
            </p>
          </div>
          <Link
            href="/dashboard/plans"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold text-sm rounded-lg transition whitespace-nowrap"
          >
            Upgrade Now →
          </Link>
        </div>
      </div>
    );
  }

  const bgColor = daysLeft <= 3 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-blue-500/10 border-blue-500/30';
  const textColor = daysLeft <= 3 ? 'text-amber-400' : 'text-blue-400';
  const warningText = daysLeft <= 3 ? 'Hurry! Your trial ends soon' : `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left`;

  return (
    <div className={`mb-4 md:mb-6 rounded-2xl ${bgColor} border p-4 md:p-5`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className={`text-sm md:text-base font-semibold ${textColor}`}>
            {warningText} in your free trial
          </p>
          <p className={`text-xs md:text-sm ${textColor} opacity-80 mt-1`}>
            Upgrade to Scalify Pro to continue building after your trial ends
          </p>
        </div>
        <Link
          href="/dashboard/plans"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-semibold text-sm rounded-lg transition whitespace-nowrap"
        >
          View Plans →
        </Link>
      </div>
    </div>
  );
}
