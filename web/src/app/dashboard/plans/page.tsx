'use client';

import { useAuth } from '../../../context/AuthContext';
import { apiFetch } from '../../../lib/api';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { DiamondIcon, ShieldIcon, CheckCircleIcon } from '../../../components/Icons';

interface Offer {
  id: string;
  name: string;
  description: string;
  plan_type: 'trial' | 'pro';
  price: number;
  original_price: number;
  trial_days: number;
  features: string[];
  is_active: boolean;
  is_user_offer?: boolean;
  expires_at?: string | null;
}

interface SubStatus {
  status: 'free' | 'active' | 'expired' | 'trial';
  plan: string;
  expiryDate: string | null;
  daysLeft: number;
  startDate: string | null;
}

interface CouponInfo {
  tier: 1 | 2;
  code: string;
  price: number;
  discount: number;
  expiresAt: string;
  label: string;
}

interface PaymentRecord {
  id: string;
  amount: number;
  status: string;
  created_at: string;
}

// ── Animated digit block ──────────────────────────────────────────────────────
function DigitBlock({ value, label }: { value: string; label: string }) {
  const [display, setDisplay] = useState(value);
  const [flip, setFlip] = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current !== value) {
      setFlip(true);
      const t = setTimeout(() => { setDisplay(value); setFlip(false); prev.current = value; }, 150);
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <div className="flex flex-col items-center">
      <div className={`relative w-14 h-16 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center overflow-hidden transition-transform duration-150 ${flip ? 'scale-y-90' : 'scale-y-100'}`}>
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
        <span className="text-3xl font-black text-white tabular-nums leading-none">{display}</span>
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1.5">{label}</span>
    </div>
  );
}

// ── Coupon banner ─────────────────────────────────────────────────────────────
function CouponBanner({ coupon, onPay, loading }: { coupon: CouponInfo; onPay: () => void; loading: boolean }) {
  const [timeLeft, setTimeLeft] = useState(Math.max(0, new Date(coupon.expiresAt).getTime() - Date.now()));
  const [expired, setExpired] = useState(timeLeft <= 0);

  useEffect(() => {
    if (expired) return;
    const tick = () => {
      const diff = Math.max(0, new Date(coupon.expiresAt).getTime() - Date.now());
      setTimeLeft(diff);
      if (diff === 0) setExpired(true);
    };
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [coupon.expiresAt, expired]);

  const secs = Math.floor(timeLeft / 1000);
  const h = Math.floor(secs / 3600).toString().padStart(2, '0');
  const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');

  if (expired) return null;

  const isTier1 = coupon.tier === 1;

  return (
    <div className={`relative rounded-3xl overflow-hidden mb-6 border ${isTier1 ? 'border-yellow-500/40 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-yellow-600/10' : 'border-blue-500/40 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-blue-600/10'}`}>
      {/* Glow orbs */}
      <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-30 ${isTier1 ? 'bg-yellow-500' : 'bg-blue-500'}`} />
      <div className={`absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${isTier1 ? 'bg-orange-500' : 'bg-indigo-500'}`} />

      <div className="relative p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${isTier1 ? 'bg-yellow-500/20' : 'bg-blue-500/20'}`}>
            {isTier1 ? '🎉' : '⚡'}
          </div>
          <div>
            <div className={`text-xs font-extrabold uppercase tracking-widest mb-0.5 ${isTier1 ? 'text-yellow-400' : 'text-blue-400'}`}>
              {isTier1 ? 'Exclusive Welcome Offer' : 'Last Chance — 24-Hour Deal'}
            </div>
            <h3 className="text-lg font-extrabold text-white leading-tight">
              {isTier1 ? "Congratulations! You've unlocked ₹600 OFF" : "You still have a special offer — ₹300 OFF"}
            </h3>
          </div>
        </div>

        {/* Coupon code */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-4 py-3">
            <span className="text-lg font-black tracking-widest text-white">{coupon.code}</span>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-3 rounded-xl font-extrabold text-xs ${isTier1 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
            APPLIED
          </div>
        </div>

        {/* Price display */}
        <div className="flex items-baseline gap-3 mb-5">
          <span className="text-zinc-500 line-through text-lg">₹1,499</span>
          <span className={`text-5xl font-black ${isTier1 ? 'text-yellow-400' : 'text-blue-400'}`}>₹{coupon.price}</span>
          <span className="text-zinc-400 text-sm">/first month</span>
          <span className={`ml-auto px-2.5 py-1 rounded-lg text-xs font-extrabold ${isTier1 ? 'bg-red-500 text-white' : 'bg-red-500 text-white'}`}>
            SAVE ₹{coupon.discount}
          </span>
        </div>

        {/* Countdown */}
        <div className="mb-5">
          <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${isTier1 ? 'text-yellow-400/70' : 'text-blue-400/70'}`}>
            ⏰ Offer expires in
          </p>
          <div className="flex items-center gap-2">
            {isTier1 ? (
              <>
                <DigitBlock value={m} label="min" />
                <span className="text-3xl font-black text-white/30 mb-4">:</span>
                <DigitBlock value={s} label="sec" />
              </>
            ) : (
              <>
                <DigitBlock value={h} label="hrs" />
                <span className="text-3xl font-black text-white/30 mb-4">:</span>
                <DigitBlock value={m} label="min" />
                <span className="text-3xl font-black text-white/30 mb-4">:</span>
                <DigitBlock value={s} label="sec" />
              </>
            )}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onPay}
          disabled={loading}
          className={`w-full py-4 rounded-2xl font-extrabold text-base transition active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg ${
            isTier1
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black shadow-yellow-500/25'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white shadow-blue-500/25'
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              🔥 Pay ₹{coupon.price} & Activate Now
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </>
          )}
        </button>

        <p className="text-center text-xs text-zinc-600 mt-3">
          Then ₹1,499/month · No auto-debit · Cancel anytime
        </p>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PlansPage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [fetchingOffers, setFetchingOffers] = useState(true);
  const [subStatus, setSubStatus] = useState<SubStatus | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [coupon, setCoupon] = useState<CouponInfo | null>(null);

  const fetchOffers = async () => {
    try {
      const data = await apiFetch('/payment/offers');
      if (data.offers) setOffers(data.offers);
    } catch (error) {
      console.error('Failed to fetch offers:', error);
    }
  };

  const fetchStatus = useCallback(async () => {
    try {
      const data = await apiFetch('/payment/status');
      if (data.success) {
        setSubStatus(data.subscription);
        setPayments(data.payments || []);
        if (data.coupon) setCoupon(data.coupon);
      }
    } catch (error) {
      console.error('Failed to fetch status:', error);
    }
  }, []);

  const loadData = useCallback(async () => {
    setFetchingOffers(true);
    await Promise.all([fetchOffers(), fetchStatus()]);
    setFetchingOffers(false);
  }, [fetchStatus]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get('payment') === 'success') {
      toast.success('Payment successful! Your Pro plan is being activated.', { duration: 6000 });
      window.history.replaceState({}, '', '/dashboard/plans');
      const poll = setInterval(() => { fetchStatus(); }, 3000);
      setTimeout(() => clearInterval(poll), 30000);
    }

    if (params.get('checkout') === '1') {
      window.history.replaceState({}, '', '/dashboard/plans');
    }

    loadData();
  }, [loadData, fetchStatus]);

  const paidOffers = offers.filter(o => o.plan_type === 'pro' && !o.is_user_offer);
  const userOffers = offers.filter((o: any) => o.is_user_offer);

  const isActive = subStatus?.status === 'active';
  const isExpired = subStatus?.status === 'expired';
  const isFree = !subStatus || subStatus.status === 'free' || subStatus.status === 'trial';

  const loadRazorpay = (): Promise<boolean> =>
    new Promise((resolve) => {
      if ((window as unknown as Record<string, unknown>).Razorpay) return resolve(true);
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const handlePayNow = async () => {
    setLoading(true);

    // Fire InitiateCheckout pixel + CAPI
    const checkoutEventId = `checkout_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', { currency: 'INR', value: coupon?.price || 1499 }, { eventID: checkoutEventId });
    }
    apiFetch('/payment/initiate-checkout', {
      method: 'POST',
      body: JSON.stringify({ event_id: checkoutEventId, amount: coupon?.price || 1499 }),
    }).catch(() => {});

    try {
      const data = await apiFetch('/payment/create-order', { method: 'POST' });

      if (!data.success) {
        if (data.whatsappFallback) {
          window.open(data.whatsappFallback, '_blank');
        } else {
          toast.error(data.error || 'Failed to initiate payment');
        }
        setLoading(false);
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error('Payment gateway failed to load. Try again or contact support.');
        setLoading(false);
        return;
      }

      const rzp = new (window as any).Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: 'Scalify',
        description: data.description || 'Scalify Pro',
        image: 'https://scalifyapp.com/logo.png',
        prefill: { email: user?.email || '', name: user?.name || '' },
        theme: { color: '#22c55e' },
        modal: { ondismiss: () => setLoading(false) },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const purchaseEventId = `purchase_${response.razorpay_payment_id}`;
          try {
            const verify = await apiFetch('/payment/verify', {
              method: 'POST',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                event_id: purchaseEventId,
                amount: data.displayPrice || 1499,
              }),
            });
            if (verify.success) {
              if (typeof window !== 'undefined' && (window as any).fbq) {
                (window as any).fbq('track', 'Purchase', { value: data.displayPrice || 1499, currency: 'INR' }, { eventID: purchaseEventId });
              }
              // Update AuthContext immediately so paywall unlocks on redirect
              updateUser({ plan: 'pro' });
              toast.success('🎉 Payment successful! Welcome to Scalify Pro!', { duration: 4000 });
              // Redirect to onboarding to complete profile
              setTimeout(() => router.replace('/dashboard'), 1500);
            } else {
              toast.error(verify.error || 'Payment verification failed. Contact support.');
            }
          } catch {
            toast.error('Verification failed. Contact support on WhatsApp.');
          } finally {
            setLoading(false);
          }
        },
      });
      rzp.open();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to initiate payment';
      toast.error(msg);
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel? You will still have access until your current period ends.')) return;
    setCancelLoading(true);
    try {
      const data = await apiFetch('/payment/cancel', { method: 'POST' });
      if (data.success) {
        toast.success(data.message || 'Subscription cancelled.');
        fetchStatus();
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to cancel';
      toast.error(msg);
    } finally {
      setCancelLoading(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  if (fetchingOffers) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-zinc-500 text-sm ml-3">Loading plans...</span>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto md:max-w-2xl pb-28">

      {/* ── Coupon Banner (free/expired users only) ── */}
      {(isFree || isExpired) && coupon && (
        <CouponBanner coupon={coupon} onPay={handlePayNow} loading={loading} />
      )}

      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl md:text-[28px] font-extrabold leading-tight">
          {isActive ? 'Your Plan' : <>One Plan.<br />Everything You Need.</>}
        </h1>
        <p className="text-sm text-zinc-500 mt-1.5">
          {isActive ? 'Your subscription is active' : isExpired ? 'Your plan has expired' : 'No confusing tiers. Just one powerful plan.'}
        </p>
      </div>

      {/* Current Plan Badge for Free Users */}
      {isFree && !coupon && (
        <div className="rounded-2xl p-4 mb-5 bg-zinc-800/40 border border-zinc-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-700/50 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-400"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <div className="flex-1">
              <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wide">Current Plan</div>
              <div className="text-lg font-bold text-zinc-200">Free Plan</div>
            </div>
            <span className="px-3 py-1 rounded-lg bg-zinc-700/40 text-zinc-400 text-xs font-bold">Active</span>
          </div>
        </div>
      )}

      {/* Active subscription status */}
      {isActive && (
        <div className="rounded-2xl p-5 mb-4 border bg-green-500/5 border-green-500/30">
          <div className="flex items-center gap-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/>
            </svg>
            <div className="flex-1">
              <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wide">Active</div>
              <div className="text-lg font-bold">Scalify Pro</div>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-green-500/20 text-green-400">
              {subStatus?.daysLeft}d left
            </span>
          </div>
          {subStatus?.expiryDate && (
            <div className="mt-4 pt-3 border-t border-border space-y-1.5 text-sm">
              {subStatus.startDate && (
                <div className="flex justify-between"><span className="text-zinc-500">Started</span><span className="font-semibold">{formatDate(subStatus.startDate)}</span></div>
              )}
              <div className="flex justify-between"><span className="text-zinc-500">Expires on</span><span className="font-semibold">{formatDate(subStatus.expiryDate)}</span></div>
            </div>
          )}
        </div>
      )}

      {/* Expired status */}
      {isExpired && (
        <div className="rounded-2xl p-5 mb-4 border bg-red-500/5 border-red-500/30">
          <div className="flex items-center gap-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/>
            </svg>
            <div className="flex-1">
              <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wide">Expired</div>
              <div className="text-lg font-bold">Scalify Pro</div>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-500/20 text-red-400">Expired</span>
          </div>
          {subStatus?.expiryDate && (
            <div className="mt-4 pt-3 border-t border-border text-sm">
              <div className="flex justify-between"><span className="text-zinc-500">Expired on</span><span className="font-semibold">{formatDate(subStatus.expiryDate)}</span></div>
            </div>
          )}
        </div>
      )}

      {/* Custom Offers (admin-sent) */}
      {userOffers.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🎁</span>
            <h2 className="text-sm font-extrabold text-green-400 uppercase tracking-wider">Special Offer Just For You</h2>
          </div>
          <div className="space-y-3">
            {userOffers.map((offer: any) => {
              const discount = offer.original_price > offer.price
                ? Math.round(((offer.original_price - offer.price) / offer.original_price) * 100)
                : 0;
              const expiring = offer.expires_at ? new Date(offer.expires_at) : null;
              const hoursLeft = expiring ? Math.max(0, Math.ceil((expiring.getTime() - Date.now()) / 3600000)) : null;

              return (
                <div key={offer.id} className="relative rounded-2xl p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/40 overflow-hidden">
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-500/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-500/20 text-green-400 text-[10px] font-extrabold tracking-wider rounded-full mb-2">
                        🎁 EXCLUSIVE OFFER
                      </span>
                      <div className="text-lg font-bold">{offer.name}</div>
                      {offer.description && <p className="text-sm text-zinc-400 mt-0.5">{offer.description}</p>}
                    </div>
                    {discount > 0 && (
                      <span className="flex-shrink-0 px-2 py-1 bg-red-500 text-white text-xs font-extrabold rounded-lg">{discount}% OFF</span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2 mt-3">
                    <span className="text-4xl font-extrabold text-green-400">₹{offer.price}</span>
                    {offer.original_price > offer.price && (
                      <span className="text-zinc-500 line-through text-lg">₹{offer.original_price}</span>
                    )}
                    <span className="text-zinc-500 text-sm">/month</span>
                  </div>
                  {hoursLeft !== null && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-yellow-400 font-semibold">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                      Expires in {hoursLeft < 24 ? `${hoursLeft}h` : `${Math.ceil(hoursLeft / 24)}d`}
                    </div>
                  )}
                  <button
                    onClick={handlePayNow}
                    disabled={loading}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-extrabold text-sm transition disabled:opacity-50 shadow-lg shadow-green-500/25"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> :
                      <>Claim This Offer <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Paid Plan Cards */}
      {paidOffers.map((offer, idx) => {
        const discountPercent = offer.original_price > offer.price
          ? Math.round(((offer.original_price - offer.price) / offer.original_price) * 100)
          : 0;

        return (
          <div key={offer.id} className="rounded-3xl p-6 bg-card border border-primary/30 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-[11px] font-extrabold tracking-wider rounded-full mb-4">
              <DiamondIcon size={12} /> {idx === 0 ? 'BEST VALUE' : 'POPULAR'}
            </span>
            <div className="text-[22px] font-bold">{offer.name}</div>
            {offer.description && <p className="text-sm text-zinc-500 mt-1">{offer.description}</p>}

            <div className="flex items-baseline gap-1.5 mt-2">
              {offer.original_price > offer.price && (
                <span className="text-lg text-zinc-500 line-through">₹{offer.original_price}</span>
              )}
              <span className="text-[42px] font-extrabold text-primary leading-none">₹{offer.price}</span>
              <span className="text-zinc-500">/month</span>
            </div>

            {discountPercent > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-extrabold rounded-lg">{discountPercent}% OFF</span>
                <span className="text-sm text-primary font-semibold">You save ₹{(offer.original_price - offer.price) * 12}/year</span>
              </div>
            )}

            <div className="border-t border-border my-5" />
            <p className="text-xs text-zinc-500 italic mb-4">Pay manually each month — no auto-debit</p>

            {offer.features.length > 0 && (
              <>
                <div className="text-xs text-zinc-500 font-bold tracking-wider uppercase mb-3">Everything included:</div>
                <div className="space-y-2.5">
                  {offer.features.map((f: string, i: number) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className="w-[22px] h-[22px] rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-primary"><path d="M20 6L9 17l-5-5"/></svg>
                      </div>
                      <span className="text-sm font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* Payment History */}
      {payments.length > 0 && (
        <div className="mb-4">
          <h2 className="text-base font-bold mb-3">Payment History</h2>
          {payments.slice(0, 5).map((p) => (
            <div key={p.id} className="flex items-center p-3.5 rounded-xl bg-surface border border-border mb-2">
              <div className="flex-1">
                <div className="text-sm font-bold">₹{p.amount}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{formatDate(p.created_at)}</div>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                p.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                p.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                'bg-yellow-500/20 text-yellow-500'
              }`}>
                {p.status === 'completed' ? 'Paid' : p.status === 'failed' ? 'Failed' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Trust Badges */}
      <div className="space-y-2.5 mb-6">
        {[
          { icon: <ShieldIcon size={18} />, text: '7-Day Money Back Guarantee', color: 'text-green-400' },
          { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="4"/><path d="M1 10h22"/></svg>, text: 'No Auto-Debit. Pay Monthly.', color: 'text-primary' },
          { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>, text: 'Secure Payment via Razorpay', color: 'text-blue-400' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2.5 p-3.5 rounded-xl bg-surface border border-border">
            <span className={item.color}>{item.icon}</span>
            <span className="text-sm font-semibold">{item.text}</span>
          </div>
        ))}
      </div>

      {/* Cancel Sub */}
      {isActive && (
        <button onClick={handleCancel} disabled={cancelLoading} className="block mx-auto text-sm text-red-400 font-semibold underline mb-6 disabled:opacity-50">
          {cancelLoading ? 'Cancelling...' : 'Cancel Subscription'}
        </button>
      )}

      {/* Sticky Bottom Subscribe Button (no coupon active) */}
      {(isFree || isExpired) && !coupon && paidOffers.length > 0 && (
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 md:left-64 z-40 bg-bg border-t border-border px-5 py-3 flex flex-col items-center">
          <button
            onClick={handlePayNow}
            disabled={loading}
            className="w-full max-w-lg flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-2xl font-bold text-base transition hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> :
              <>{isExpired ? 'Renew Now' : 'Subscribe Now'} — ₹{paidOffers[0].price}/mo
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </>}
          </button>
          <span className="text-xs text-zinc-500 mt-2">Secure payment via Razorpay. No auto-debit.</span>
        </div>
      )}

      {/* Renew when expiring soon */}
      {isActive && subStatus && subStatus.daysLeft <= 7 && paidOffers.length > 0 && (
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 md:left-64 z-40 bg-bg border-t border-border px-5 py-3 flex flex-col items-center">
          <button
            onClick={handlePayNow}
            disabled={loading}
            className="w-full max-w-lg flex items-center justify-center gap-2 py-4 bg-yellow-500 text-white rounded-2xl font-bold text-base transition hover:bg-yellow-600 disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> :
              <>Renew Now — ₹{paidOffers[0].price}/mo <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>}
          </button>
          <span className="text-xs text-zinc-500 mt-2">Expiring in {subStatus.daysLeft} days. Renew to continue.</span>
        </div>
      )}
    </div>
  );
}
