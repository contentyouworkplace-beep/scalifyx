'use client';

import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fredoka, Nunito } from 'next/font/google';
import {
  IcoCheck, IcoLock, IcoMessage, IcoBox, IcoTruck, IcoCoin,
  IcoBook, IcoGift, IcoUsers, IcoMapPin,
} from '../icons';

const fredoka = Fredoka({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const nunito  = Nunito({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] });

interface OrderData {
  name: string;
  whatsapp: string;
  businessName: string;
  businessType?: string;
  website?: string;
  address: string;
  orderId: string;
}

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    // 1. Try to read from localStorage first
    const stored = localStorage.getItem('reyyo_last_order');
    if (stored) {
      try {
        setOrder(JSON.parse(stored));
        return;
      } catch {}
    }

    // 2. Fallback to query param if direct navigation with only ID
    const urlId = searchParams.get('id');
    if (urlId) {
      setOrder({
        name: 'Valued Founder Partner',
        whatsapp: 'Your registered number',
        businessName: 'Your Business',
        address: 'Your delivery address',
        orderId: urlId,
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (!order) return;
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        value: 99,
        currency: 'INR',
        contents: [
          {
            quantity: 1
          }
        ],
      });
    }
  }, [order]);

  if (!order) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 ${nunito.className}`}>
        <p className="text-gray-500 font-bold mb-4">No order details found.</p>
        <Link href="/reyyo" className="px-6 py-3 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-colors">
          Go to Home Page
        </Link>
      </div>
    );
  }

  const steps = [
    { icon:<IcoMessage size={28}/>, bg:'#F0FFF4', t:'WhatsApp Confirmation',  d:'Order details sent to your WhatsApp within 5 minutes' },
    { icon:<IcoBox size={28}/>,     bg:'#F0F8FF', t:'Kit Packed & Shipped',   d:'QR Sticker + Acrylic Stand shipped within 2 days' },
    { icon:<IcoTruck size={28}/>,   bg:'#FFF8F0', t:'Delivery in 3–4 Days',  d:'Delivered to your doorstep in 3–4 business days' },
    { icon:<IcoCoin size={28}/>,    bg:'#F5F0FF', t:'Pay on Delivery — ₹99', d:'Our agent collects ₹99 when your kit arrives. Pay via Cash, UPI, or any method you prefer.' },
    { icon:<IcoBook size={28}/>,    bg:'#FFF8F0', t:'In-Store Tutorial by Our Agent', d:'Our agent will visit your store and personally teach you how to use Reyyo — plus you get a step-by-step tutorial guide.' },
    { icon:<IcoGift size={28}/>,    bg:'#FFF0F5', t:'Go Live!',               d:'Place your QR stand on your counter & start earning loyal customers from day one.' },
  ];

  return (
    <div className="min-h-screen pb-16" style={{background:'linear-gradient(135deg,#F0FFF4,#fff,#F5F0FF)',animation:'reyyoSlideIn 0.4s cubic-bezier(.22,.68,0,1.2) both'}}>
      <style>{`@keyframes reyyoSlideIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div className="bg-white border-b px-5 py-4 flex flex-col items-center">
        <Link href="/reyyo" className="flex flex-col items-center">
          <Image src="/reyyo/logo.webp" alt="Reyyo" width={120} height={52} className="object-contain h-12 w-auto"/>
          <span className={`${nunito.className} text-[9px] font-semibold text-gray-400 -mt-0.5 tracking-wide`}>by Scalify</span>
        </Link>
      </div>

      <div className="max-w-lg mx-auto px-5 py-10">
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl"
               style={{background:'linear-gradient(135deg,#00C853,#00AEEF)'}}>
            <IcoCheck size={52} color="white"/>
          </div>
          <p className={`${fredoka.className} text-4xl font-bold text-gray-900`}>Order Confirmed!</p>
          <p className={`text-gray-500 font-semibold mt-2 ${nunito.className}`}>Your Reyyo Founder Pack is on its way!</p>
          <p className={`text-sm font-bold mt-2 ${nunito.className}`} style={{color:'#7B2FBE'}}>Order ID: {order.orderId}</p>
        </div>

        <div className="rounded-2xl p-5 mb-5 flex gap-3" style={{background:'#DCFCE7',border:'2px solid #86EFAC'}}>
          <IcoMessage size={36}/>
          <div>
            <p className={`font-bold text-green-800 ${nunito.className}`}>WhatsApp Confirmation Sent!</p>
            <p className={`text-green-700 text-sm font-semibold mt-0.5 ${nunito.className}`}>
              Order details sent to <strong>+91 {order.whatsapp}</strong>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-5">
          <p className={`${fredoka.className} text-xl font-bold text-gray-900 mb-5`}>What Happens Next?</p>
          <div className="space-y-4">
            {steps.map((s,i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{background:s.bg}}>{s.icon}</div>
                <div>
                  <p className={`font-bold text-gray-900 ${nunito.className}`}>{s.t}</p>
                  <p className={`text-gray-400 text-sm font-semibold ${nunito.className}`}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <p className={`${fredoka.className} text-xl font-bold text-gray-900 mb-4`}>Order Details</p>
          {[
            { l: 'Name',      v: order.name },
            { l: 'WhatsApp',  v: order.whatsapp.startsWith('Your') ? order.whatsapp : `+91 ${order.whatsapp}` },
            { l: 'Business',  v: `${order.businessName}${order.businessType ? ` · ${order.businessType}` : ''}` },
            { l: 'Deliver To', v: order.address },
          ].map(r => (
            <div key={r.l} className={`flex justify-between py-2.5 border-b border-gray-50 last:border-0 gap-4 text-sm ${nunito.className}`}>
              <span className="text-gray-400 font-semibold flex-shrink-0">{r.l}</span>
              <span className="font-bold text-gray-900 text-right">{r.v}</span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-4 mt-2 border-t-2 border-gray-100">
            <div>
              <p className={`font-bold text-gray-900 ${nunito.className}`}>Total (Pay on Delivery)</p>
              <p className={`text-xs text-gray-400 ${nunito.className}`}>Delivery FREE · Lifetime access</p>
            </div>
            <span className={`${fredoka.className} text-2xl font-bold`} style={{color:'#FF2D78'}}>₹99</span>
          </div>
        </div>

        <a href="https://wa.me/916353583148?text=Hey%20Reyyo%2C%20I%20have%20a%20question%20about%20my%20order."
           target="_blank" rel="noreferrer"
           className={`${fredoka.className} flex items-center justify-center gap-3 w-full text-lg font-bold text-white py-4 rounded-2xl shadow-lg mt-6 transition-all hover:scale-105`}
           style={{background:'linear-gradient(135deg,#00C853,#00A040)'}}>
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" fill="white"/>
            <path d="M10 22L12 19.5C13.5 20.5 15 21 16 21C20 21 23 18 23 14.5C23 11 20 8 16 8C12 8 9 11 9 14.5C9 16 9.5 17.5 10.5 18.5L10 22Z" fill="#00C853"/>
          </svg>
          Questions? Chat on WhatsApp
        </a>
        <p className={`text-center text-xs text-gray-400 font-semibold mt-2 ${nunito.className}`}>
          +91 63535 83148 · Pre-filled message ready to send
        </p>

        <div className="text-center mt-8">
          <Link href="/reyyo" className={`text-sm font-bold text-purple-600 hover:underline ${nunito.className}`}>
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ReyyoOrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className={`min-h-screen flex items-center justify-center bg-gray-50 p-6 ${nunito.className}`}>
        <p className="text-gray-400 font-bold">Loading order details...</p>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
