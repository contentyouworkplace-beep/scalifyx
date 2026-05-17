'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';

const COLORS = ['#22c55e', '#4ade80', '#facc15', '#f97316', '#818cf8', '#38bdf8', '#fb7185'];

function Confetti() {
  const [pieces, setPieces] = useState<React.CSSProperties[]>([]);
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    setPieces(
      Array.from({ length: 70 }, (_, i) => ({
        position: 'fixed' as const,
        left: `${Math.random() * 100}%`,
        top: `-${8 + Math.random() * 8}%`,
        width: `${6 + Math.random() * 7}px`,
        height: `${6 + Math.random() * 7}px`,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        backgroundColor: COLORS[i % COLORS.length],
        transform: `rotate(${Math.random() * 360}deg)`,
        animation: `confettiFall ${1.6 + Math.random() * 1.4}s ease-in ${Math.random() * 1.2}s forwards`,
        opacity: 0,
        zIndex: 0,
        pointerEvents: 'none' as const,
      }))
    );
  }, []);
  return (
    <>
      <style>{`
        @keyframes confettiFall {
          0%   { opacity: 1; transform: translateY(0) rotate(0deg); }
          100% { opacity: 0; transform: translateY(110vh) rotate(720deg); }
        }
        @keyframes popIn {
          0%   { transform: scale(0.4); opacity: 0; }
          70%  { transform: scale(1.12); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        {pieces.map((s, i) => <div key={i} style={s} />)}
      </div>
    </>
  );
}

function PaymentSuccessContent() {
  const router = useRouter();
  const params = useSearchParams();
  const amount = params.get('amount') || '1499';
  const pid = params.get('pid') || '';

  const [verified, setVerified] = useState(false);
  const pixelFired = useRef(false);

  useEffect(() => {
    apiFetch('/payment/status')
      .then((data) => {
        const plan = data.subscription?.plan;
        const status = data.subscription?.status;
        if (plan === 'pro' && status === 'active') {
          setVerified(true);
          // Fire client-side Purchase pixel once — deduplicates with server CAPI via same eventID
          if (!pixelFired.current && typeof window !== 'undefined' && (window as any).fbq) {
            const eventId = pid ? `purchase_${pid}` : `purchase_success_${Date.now()}`;
            (window as any).fbq('track', 'Purchase', { value: Number(amount), currency: 'INR' }, { eventID: eventId });
            pixelFired.current = true;
          }
        } else {
          // Not a paid user — bounce back to plans
          router.replace('/dashboard/plans');
        }
      })
      .catch(() => {
        router.replace('/dashboard/plans');
      });
  }, [router, amount, pid]);

  if (!verified) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 relative overflow-hidden">
      <Confetti />

      <div className="relative z-10 w-full max-w-sm text-center">
        {/* Animated check circle */}
        <div
          className="mx-auto mb-6 w-24 h-24 rounded-full bg-green-500/15 border-2 border-green-500/30 flex items-center justify-center"
          style={{ animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}
        >
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/40">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-white mb-1">Payment Successful!</h1>
        <p className="text-zinc-400 text-sm mb-6">
          Welcome to Scalify Pro · ₹{Number(amount).toLocaleString('en-IN')}/month
        </p>

        {/* What you get */}
        <div className="rounded-2xl bg-surface border border-border p-4 mb-6 text-left space-y-3">
          {[
            { icon: '✅', title: 'Pro Plan Activated', sub: 'All features unlocked immediately' },
            { icon: '📅', title: 'Valid for 30 Days', sub: 'Renews monthly · cancel anytime' },
            { icon: '💬', title: 'Team Will Contact You', sub: "We'll reach out on WhatsApp within 24h" },
          ].map(({ icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="text-xl w-8 text-center flex-shrink-0">{icon}</span>
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs text-zinc-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Primary CTA */}
        <button
          onClick={() => router.replace('/dashboard')}
          className="w-full py-4 rounded-2xl bg-green-500 hover:bg-green-400 active:scale-[0.98] text-white font-bold text-base transition shadow-lg shadow-green-500/30 mb-3"
        >
          Go to Dashboard →
        </button>

        {/* WhatsApp secondary */}
        <a
          href="https://wa.me/916353583148?text=Hi%20Scalify%20team!%20I%20just%20completed%20my%20Pro%20plan%20payment.%20Please%20help%20me%20get%20started."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border border-[#25D366]/40 text-[#25D366] text-sm font-semibold hover:bg-[#25D366]/10 transition"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378L2 21l3.75-1.023A9.895 9.895 0 0012.051 21.9c5.43 0 9.884-4.418 9.884-9.846 0-2.634-.675-5.11-1.96-7.246A9.853 9.853 0 0012.051 6.979z"/>
          </svg>
          Chat With Us on WhatsApp
        </a>

        <p className="text-xs text-zinc-600 mt-4">
          Receipt sent to your email · Secure payment via Razorpay
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
