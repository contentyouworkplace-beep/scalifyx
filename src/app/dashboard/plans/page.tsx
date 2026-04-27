'use client';

import { useAuth } from '../../../context/AuthContext';
import { apiFetch } from '../../../lib/api';
import { useState, useEffect, useCallback } from 'react';
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

interface PaymentRecord {
  id: string;
  amount: number;
  status: string;
  created_at: string;
}

export default function PlansPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [trialLoading, setTrialLoading] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [fetchingOffers, setFetchingOffers] = useState(true);
  const [subStatus, setSubStatus] = useState<SubStatus | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setFetchingOffers(true);
    await Promise.all([fetchOffers(), fetchStatus()]);
    setFetchingOffers(false);
  };

  const fetchOffers = async () => {
    try {
      const data = await apiFetch('/payment/offers');
      if (data.offers) setOffers(data.offers);
    } catch {}
  };

  const fetchStatus = async () => {
    try {
      const data = await apiFetch('/payment/status');
      if (data.success) {
        setSubStatus(data.subscription);
        setPayments(data.payments || []);
      }
    } catch {}
  };

  const trialOffer = offers.find(o => o.plan_type === 'trial' && !o.is_user_offer);
  const paidOffers = offers.filter(o => o.plan_type === 'pro' && !o.is_user_offer);
  const userOffers = offers.filter((o: any) => o.is_user_offer);

  const isActive = subStatus?.status === 'active';
  const isTrial = subStatus?.status === 'trial';
  const isExpired = subStatus?.status === 'expired';
  const isFree = !subStatus || subStatus.status === 'free';

  const handleStartTrial = async () => {
    setTrialLoading(true);
    try {
      const data = await apiFetch('/payment/start-trial', {
        method: 'POST',
        body: JSON.stringify({ offerId: trialOffer?.id }),
      });
      if (data.success) {
        toast.success(`Trial Activated! Your ${trialOffer?.trial_days || 7}-day free trial is now active.`);
        fetchStatus();
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to start trial';
      toast.error(msg);
    } finally {
      setTrialLoading(false);
    }
  };

  const handlePayNow = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/payment/create-payment-link', { method: 'POST' });
      if (data.success && data.paymentLink) {
        window.open(data.paymentLink, '_blank');
      } else {
        toast.error('Failed to create payment link');
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to create payment link';
      toast.error(msg);
    } finally {
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
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl md:text-[28px] font-extrabold leading-tight">
          {isActive || isTrial ? 'Your Plan' : <>One Plan.<br />Everything You Need.</>}
        </h1>
        <p className="text-sm text-zinc-500 mt-1.5">
          {isActive ? 'Your subscription is active' : isTrial ? "You're on a free trial" : isExpired ? 'Your plan has expired' : 'No confusing tiers. Just one powerful plan.'}
        </p>
      </div>

      {/* Status Banner */}
      {(isActive || isTrial || isExpired) && (
        <div className={`rounded-2xl p-5 mb-4 border ${
          isActive ? 'bg-green-500/5 border-green-500/30' : isTrial ? 'bg-yellow-500/5 border-yellow-500/30' : 'bg-red-500/5 border-red-500/30'
        }`}>
          <div className="flex items-center gap-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#22c55e' : isTrial ? '#F59E0B' : '#ef4444'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isActive ? <><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></> :
               isTrial ? <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></> :
               <><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/></>}
            </svg>
            <div className="flex-1">
              <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wide">
                {isActive ? 'Active' : isTrial ? 'Free Trial' : 'Expired'}
              </div>
              <div className="text-lg font-bold">{subStatus?.plan === 'pro' ? 'ScalifyX Pro' : 'Trial Plan'}</div>
            </div>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
              isActive ? 'bg-green-500/20 text-green-400' : isTrial ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-400'
            }`}>
              {isActive || isTrial ? `${subStatus?.daysLeft}d left` : 'Expired'}
            </span>
          </div>

          {subStatus?.expiryDate && (
            <div className="mt-4 pt-3 border-t border-border space-y-1.5 text-sm">
              {subStatus.startDate && (
                <div className="flex justify-between"><span className="text-zinc-500">Started</span><span className="font-semibold">{formatDate(subStatus.startDate)}</span></div>
              )}
              <div className="flex justify-between"><span className="text-zinc-500">{isExpired ? 'Expired on' : 'Expires on'}</span><span className="font-semibold">{formatDate(subStatus.expiryDate)}</span></div>
            </div>
          )}

          {(isExpired || isTrial) && (
            <button onClick={handlePayNow} disabled={loading} className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-bold transition hover:bg-primary-dark disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> :
                <>{isExpired ? 'Renew Now' : 'Upgrade to Pro'}</>}
            </button>
          )}
        </div>
      )}

      {/* Trial Card */}
      {isFree && trialOffer && (
        <div className="rounded-2xl p-5 mb-4 bg-yellow-500/5 border border-yellow-500/30">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500/20 text-yellow-500 text-[11px] font-extrabold tracking-wide rounded-full mb-2.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            FREE TRIAL
          </span>
          <div className="text-lg font-bold">{trialOffer.name}</div>
          {trialOffer.description && <p className="text-sm text-zinc-500 mt-0.5">{trialOffer.description}</p>}
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl font-extrabold text-yellow-500">FREE</span>
            <span className="text-sm text-zinc-500">for {trialOffer.trial_days} days</span>
          </div>
          {paidOffers.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-zinc-500 font-semibold">Then</span>
              {paidOffers[0].original_price > paidOffers[0].price && (
                <span className="text-sm text-zinc-500 line-through">₹{paidOffers[0].original_price}</span>
              )}
              <span className="text-lg font-extrabold text-primary">₹{paidOffers[0].price}/mo</span>
            </div>
          )}
          {trialOffer.features.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {trialOffer.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={handleStartTrial}
            disabled={trialLoading}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-yellow-500/20 border border-yellow-500/30 text-yellow-500 rounded-xl font-bold transition hover:bg-yellow-500/30 disabled:opacity-50"
          >
            {trialLoading ? <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" /> :
              <>Start Free Trial <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>}
          </button>
        </div>
      )}

      {/* 🎁 Custom Offers (sent by admin specifically for this user) */}
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
                  {/* Glow */}
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

            <p className="text-xs text-zinc-500 italic mb-4">
              Pay manually each month — no auto-debit
            </p>

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
      {(isActive || isTrial) && (
        <button onClick={handleCancel} disabled={cancelLoading} className="block mx-auto text-sm text-red-400 font-semibold underline mb-6 disabled:opacity-50">
          {cancelLoading ? 'Cancelling...' : 'Cancel Subscription'}
        </button>
      )}

      {/* Sticky Bottom Subscribe Button */}
      {(isFree || isExpired || isTrial) && paidOffers.length > 0 && (
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 md:left-64 z-40 bg-bg border-t border-border px-5 py-3 flex flex-col items-center">
          <button
            onClick={handlePayNow}
            disabled={loading}
            className="w-full max-w-lg flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-2xl font-bold text-base transition hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> :
              <>{isExpired ? 'Renew Now' : isTrial ? 'Upgrade to Pro' : 'Subscribe Now'} — ₹{paidOffers[0].price}/mo
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
