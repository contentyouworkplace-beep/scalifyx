'use client';

import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { CheckCircleIcon } from '@/components/Icons';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState('');
  const [loaded, setLoaded] = useState(false);

  const WHATSAPP_NUMBER = '+916353583148';
  const whatsappMessage = `Hi Scalify team! 👋\n\nI just completed my payment for the ₹199/month website design package. \n\nPlease help me with the next steps to get my website built.\n\nThank you!`;

  useEffect(() => {
    // Get order ID from URL or generate one
    const id = searchParams.get('orderId') || `ORD-${Date.now()}`;
    setOrderId(id);
    setLoaded(true);
  }, [searchParams]);

  const handleWhatsappClick = () => {
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!loaded) {
    return (
      <div className="min-h-screen bg-bg text-white flex items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Logo size={40} />
        </div>

        {/* Success Card */}
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-10">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-green-500/20 p-5 border border-green-500/30">
              <CheckCircleIcon className="w-16 h-16 text-green-400" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-extrabold text-center mb-2">
            Payment Successful!
          </h1>
          <p className="text-center text-zinc-400 mb-8 text-lg">
            Thank you for choosing Scalify. Your website is on the way!
          </p>

          {/* Order Details */}
          <div className="bg-card/50 rounded-xl border border-border p-6 mb-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-sm text-zinc-500">Order ID</span>
                <span className="font-mono text-sm font-semibold text-white">{orderId}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-sm text-zinc-500">Package</span>
                <span className="font-semibold text-white">Professional Website Design</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-sm text-zinc-500">Amount Paid</span>
                <span className="font-bold text-green-400 text-lg">₹199</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-500">Billing</span>
                <span className="text-sm text-zinc-300">Monthly</span>
              </div>
            </div>
          </div>

          {/* What's Included */}
          <div className="mb-8">
            <h3 className="font-semibold text-white mb-4">Your Package Includes:</h3>
            <div className="space-y-3">
              {[
                'Professional website design',
                'Fast loading optimization',
                'Basic SEO setup',
                'Free hosting configuration',
                'Website updates & maintenance',
                'WhatsApp support',
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-zinc-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 p-4 mb-8">
            <p className="text-sm text-blue-200 leading-relaxed">
              ✓ Payment confirmed and processed securely<br/>
              ✓ Check your email for invoice and receipt<br/>
              ✓ Subscription active for 30 days
            </p>
          </div>

          {/* Next Steps */}
          <div className="mb-8">
            <h3 className="font-semibold text-white mb-4">What's Next?</h3>
            <ol className="space-y-3 text-sm text-zinc-400">
              <li className="flex gap-3">
                <span className="font-bold text-green-400">1.</span>
                <span>Click the button below to message us on WhatsApp</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-green-400">2.</span>
                <span>Share your business details and website requirements</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-green-400">3.</span>
                <span>We'll design and launch your website (5-7 business days)</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-green-400">4.</span>
                <span>We'll send you the website link and login credentials</span>
              </li>
            </ol>
          </div>

          {/* WhatsApp CTA */}
          <button
            onClick={handleWhatsappClick}
            className="w-full rounded-xl bg-green-500 px-6 py-4 text-lg font-bold text-white hover:bg-green-400 active:scale-[0.98] transition flex items-center justify-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.806c0 2.734.732 5.41 2.124 7.738L3.565 21.1l8.102-2.129c2.257 1.312 4.8 2.006 7.402 2.006 5.43 0 9.884-4.418 9.884-9.846 0-2.634-.675-5.11-1.96-7.246A9.853 9.853 0 0012.051 6.979z"/>
            </svg>
            Continue on WhatsApp
          </button>

          {/* Help Text */}
          <p className="text-center text-xs text-zinc-600 mb-6">
            We're usually online and respond within minutes during business hours
          </p>

          {/* Secondary Link */}
          <Link
            href="/"
            className="block text-center text-sm text-green-400 hover:text-green-300 transition font-semibold"
          >
            Back to Home
          </Link>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-zinc-700 mt-8">
          Your order details have been sent to your email
        </p>
      </div>
    </div>
  );
}

import { Suspense } from 'react';

export default function PaymentSuccess() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg text-white flex items-center justify-center p-4">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
