'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Fredoka, Nunito } from 'next/font/google';
import {
  IcoGift, IcoStar, IcoPhone, IcoUsers, IcoCamera, IcoGlobe,
  IcoTruck, IcoBox, IcoQR, IcoChart, IcoCoin, IcoCheck, IcoLock,
  IcoMessage, IcoCoffee, IcoScissors, IcoPlate, IcoDumbbell,
  IcoTooth, IcoBag, IcoPill, IcoPaw, IcoCroissant, IcoBook, IcoSpa,
  IcoMapPin, IcoSparkle, IcoStore,
} from '../icons';

const fredoka = Fredoka({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const nunito  = Nunito({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] });

interface OrderData {
  name: string; whatsapp: string; businessName: string;
  businessType: string; website: string; address: string;
}
const emptyOrder: OrderData = {
  name: '', whatsapp: '', businessName: '', businessType: '', website: '', address: '',
};

// ── Order Form ───────────────────────────────────────────────────────────────
function OrderForm({ onBack, onNext }: { onBack: ()=>void; onNext: (d:OrderData)=>void }) {
  const [form, setForm] = useState<OrderData>(emptyOrder);
  const [errs, setErrs] = useState<Partial<OrderData>>({});
  const [busy, setBusy]  = useState(false);

  const set = (k: keyof OrderData, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrs(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e: Partial<OrderData> = {};
    if (!form.name.trim())                    e.name     = 'Required';
    if (!/^[6-9]\d{9}$/.test(form.whatsapp)) e.whatsapp = 'Enter valid 10-digit number';
    if (!form.businessName.trim())            e.businessName = 'Required';
    if (!form.address.trim())                 e.address  = 'Required';
    return e;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrs(e); return; }
    setBusy(true);
    await new Promise(r => setTimeout(r, 600));
    setBusy(false);
    onNext(form);
  };

  const inp = `w-full px-4 py-3.5 rounded-2xl border-2 font-semibold text-gray-900 transition-all outline-none focus:border-purple-500 bg-gray-50 focus:bg-white ${nunito.className}`;
  const lbl = `flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 ${nunito.className}`;
  const errCls = `text-red-500 text-xs mt-1.5 font-bold ${nunito.className}`;

  return (
    <div className="min-h-screen bg-white" style={{animation:'reyyoSlideIn 0.35s cubic-bezier(.22,.68,0,1.2) both'}}>
      <style>{`@keyframes reyyoSlideIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b px-5 py-4 flex items-center justify-between">
        <button onClick={onBack} className={`font-bold text-gray-500 hover:text-gray-900 flex items-center gap-2 ${nunito.className}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back
        </button>
        <div className="flex flex-col items-center">
          <Image src="/reyyo/logo.webp" alt="Reyyo" width={110} height={48} className="object-contain h-11 w-auto"/>
          <span className={`${nunito.className} text-[9px] font-semibold text-gray-400 -mt-0.5 tracking-wide`}>by Scalify</span>
        </div>
        <div className="w-16"/>
      </div>

      <div className="max-w-lg mx-auto px-5 py-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3"><IcoSparkle size={52}/></div>
          <p className={`${fredoka.className} text-4xl font-bold text-gray-900`}>Almost There!</p>
          <p className={`text-gray-500 font-semibold mt-2 ${nunito.className}`}>Complete your order to claim the Founder Plan</p>
        </div>

        {/* Mini summary */}
        <div className="rounded-2xl p-5 mb-8 flex justify-between items-start gap-4"
             style={{background:'linear-gradient(135deg,#FFF0F5,#F5F0FF)',border:'2px solid #E8D5F5'}}>
          <div>
            <p className={`${fredoka.className} text-lg font-bold text-gray-900`}>Reyyo Founder Plan</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {['Account','QR Sticker','Acrylic Stand','Dashboard'].map(x => (
                <span key={x} className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-white ${nunito.className}`}
                      style={{color:'#7B2FBE'}}>
                  <IcoCheck size={12} color="#7B2FBE"/> {x}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className={`${fredoka.className} text-3xl font-bold`} style={{color:'#FF2D78'}}>₹99</p>
            <p className={`text-xs font-bold ${nunito.className}`} style={{color:'#00C853'}}>Lifetime · Pay on Delivery</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <h3 className={`${fredoka.className} text-2xl font-bold text-gray-900 flex items-center gap-2`}>
            <IcoUsers size={28}/> Your Details
          </h3>

          <div>
            <label className={lbl}>Full Name *</label>
            <input type="text" placeholder="Arjun Patel" value={form.name}
                   onChange={e => set('name', e.target.value)}
                   className={inp} style={{borderColor:errs.name?'#EF4444':'#E5E7EB'}}/>
            {errs.name && <p className={errCls}>{errs.name}</p>}
          </div>

          <div>
            <label className={lbl}><IcoPhone size={18}/> WhatsApp Number *</label>
            <div className="flex gap-2">
              <span className={`flex items-center px-4 rounded-2xl border-2 font-bold text-gray-600 bg-gray-50 text-sm flex-shrink-0 ${nunito.className}`}
                    style={{borderColor:'#E5E7EB'}}>🇮🇳 +91</span>
              <input type="tel" placeholder="9876543210" value={form.whatsapp} maxLength={10}
                     onChange={e => set('whatsapp', e.target.value.replace(/\D/g,''))}
                     className={inp} style={{borderColor:errs.whatsapp?'#EF4444':'#E5E7EB'}}/>
            </div>
            {errs.whatsapp && <p className={errCls}>{errs.whatsapp}</p>}
            <p className={`text-xs text-gray-400 mt-1 font-semibold ${nunito.className}`}>Order confirmation sent to this WhatsApp</p>
          </div>

          <div>
            <label className={lbl}><IcoStore size={18}/> Business Name *</label>
            <input type="text" placeholder="Arjun's Café" value={form.businessName}
                   onChange={e => set('businessName', e.target.value)}
                   className={inp} style={{borderColor:errs.businessName?'#EF4444':'#E5E7EB'}}/>
            {errs.businessName && <p className={errCls}>{errs.businessName}</p>}
          </div>

          <div>
            <label className={lbl}>Business Type <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
            <select value={form.businessType} onChange={e => set('businessType', e.target.value)}
                    className={inp} style={{borderColor:'#E5E7EB',background:'#F9FAFB'}}>
              <option value="">Select type</option>
              {['Café','Restaurant','Salon','Gym','Clinic','Retail Store','Spa','Bakery','Pharmacy','Other'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={lbl}><IcoGlobe size={18}/> Website <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
            <input type="text" placeholder="yourwebsite.com" value={form.website}
                   onChange={e => set('website', e.target.value)}
                   className={inp} style={{borderColor:'#E5E7EB'}}/>
          </div>

          <div className="pt-2 space-y-4">
            <h3 className={`${fredoka.className} text-2xl font-bold text-gray-900 flex items-center gap-2`}>
              <IcoMapPin size={26}/> Delivery Address
            </h3>
            <div>
              <label className={lbl}>Full Address with Landmark *</label>
              <textarea placeholder="Shop No. 5, MG Road, Near State Bank, Vadodara, Gujarat – 390007"
                        value={form.address} onChange={e => set('address', e.target.value)}
                        rows={3} className={`${inp} resize-none`}
                        style={{borderColor:errs.address?'#EF4444':'#E5E7EB'}}/>
              {errs.address && <p className={errCls}>{errs.address}</p>}
              <p className={`text-xs text-gray-400 mt-1 font-semibold ${nunito.className}`}>Include street, area, city, state & PIN code for smooth delivery</p>
            </div>
          </div>

          <button type="submit" disabled={busy}
                  className={`${fredoka.className} w-full text-xl font-semibold text-white py-5 rounded-2xl shadow-xl transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed`}
                  style={{background:'linear-gradient(135deg,#FF2D78,#7B2FBE)'}}>
            {busy ? '⏳ Please wait...' : 'Review My Order →'}
          </button>
          <p className={`text-center text-xs text-gray-400 font-bold flex items-center justify-center gap-1.5 ${nunito.className}`}>
            <IcoLock size={14}/> No payment now · Pay ₹99 only when your kit arrives
          </p>
        </form>
      </div>
    </div>
  );
}

// ── Order Summary ────────────────────────────────────────────────────────────
function OrderSummary({ data, onEdit, onConfirm }: { data:OrderData; onEdit:()=>void; onConfirm:(orderId: string)=>void }) {
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const confirm = async () => {
    setBusy(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/reyyo/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        onConfirm(resData.orderId);
      } else {
        setErrorMsg(resData.error || 'Failed to save your order. Please check your Supabase Row-Level Security (RLS) setup or database settings.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('A network error occurred. Please check your internet connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  const items = [
    { icon:<IcoPhone size={22}/>,  label:'Reyyo Account (Lifetime)',        price:'₹99',  free:false },
    { icon:<IcoQR size={22}/>,     label:'QR Sticker (Printed & Shipped)',  price:'FREE', free:true  },
    { icon:<IcoBox size={22}/>,    label:'Acrylic Stand',                   price:'FREE', free:true  },
    { icon:<IcoChart size={22}/>,  label:'Business Dashboard Access',       price:'FREE', free:true  },
    { icon:<IcoGift size={22}/>,   label:'Customer Rewards System',         price:'FREE', free:true  },
    { icon:<IcoTruck size={22}/>,  label:'Delivery (3–4 business days)',    price:'FREE', free:true  },
  ];

  return (
    <div className="min-h-screen bg-white" style={{animation:'reyyoSlideIn 0.35s cubic-bezier(.22,.68,0,1.2) both'}}>
      <style>{`@keyframes reyyoSlideIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b px-5 py-4 flex items-center justify-between">
        <button onClick={onEdit} className={`font-bold text-gray-500 hover:text-gray-900 flex items-center gap-2 ${nunito.className}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Edit
        </button>
        <div className="flex flex-col items-center">
          <Image src="/reyyo/logo.webp" alt="Reyyo" width={110} height={48} className="object-contain h-11 w-auto"/>
          <span className={`${nunito.className} text-[9px] font-semibold text-gray-400 -mt-0.5 tracking-wide`}>by Scalify</span>
        </div>
        <div className="w-16"/>
      </div>

      <div className="max-w-lg mx-auto px-5 py-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3"><IcoBox size={56}/></div>
          <p className={`${fredoka.className} text-4xl font-bold text-gray-900`}>Review Your Order</p>
          <p className={`text-gray-500 font-semibold mt-2 ${nunito.className}`}>Check everything before we confirm</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-2xl mb-6 font-bold text-sm leading-relaxed flex flex-col gap-2">
            <p className="flex items-center gap-2">⚠️ Error Saving Order</p>
            <p className="font-semibold text-xs text-red-600">{errorMsg}</p>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-4">
          <p className={`${fredoka.className} text-xl font-bold text-gray-900 mb-4 flex items-center gap-2`}>
            <IcoGift size={24}/> What You're Getting
          </p>
          {items.map(r => (
            <div key={r.label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 gap-3">
              <div className="flex items-center gap-3">{r.icon}
                <span className={`text-sm font-semibold text-gray-800 ${nunito.className}`}>{r.label}</span>
              </div>
              <span className={`text-sm font-bold flex-shrink-0 ${nunito.className}`}
                    style={{color:r.free?'#00C853':'#FF2D78'}}>{r.price}</span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-4 mt-2 border-t-2 border-gray-100">
            <div>
              <p className={`font-bold text-gray-900 ${nunito.className}`}>Total (Pay on Delivery)</p>
              <p className={`text-xs text-gray-400 ${nunito.className}`}>Cash payment to delivery agent</p>
            </div>
            <span className={`${fredoka.className} text-2xl font-bold`} style={{color:'#FF2D78'}}>₹99</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <p className={`${fredoka.className} text-xl font-bold text-gray-900 flex items-center gap-2`}>
              <IcoUsers size={22}/> Your Details
            </p>
            <button onClick={onEdit} className={`text-sm font-bold hover:underline ${nunito.className}`} style={{color:'#7B2FBE'}}>Edit</button>
          </div>
          {[
            { l:'Name',     v:data.name },
            { l:'WhatsApp', v:`+91 ${data.whatsapp}` },
            { l:'Business', v:`${data.businessName}${data.businessType ? ` · ${data.businessType}` : ''}` },
            ...(data.website ? [{ l:'Website', v:data.website }] : []),
          ].map(r => (
            <div key={r.l} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0 gap-4 text-sm">
              <span className={`text-gray-400 text-sm font-semibold ${nunito.className}`}>{r.l}</span>
              <span className={`font-bold text-sm text-gray-900 text-right ${nunito.className}`}>{r.v}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-4">
          <div className="flex justify-between items-center mb-3">
            <p className={`${fredoka.className} text-xl font-bold text-gray-900 flex items-center gap-2`}>
              <IcoMapPin size={22}/> Delivery Address
            </p>
            <button onClick={onEdit} className={`text-sm font-bold hover:underline ${nunito.className}`} style={{color:'#7B2FBE'}}>Edit</button>
          </div>
          <p className={`font-semibold text-gray-700 leading-relaxed ${nunito.className}`}>{data.address}</p>
          <p className={`text-sm font-semibold mt-3 flex items-center gap-2 ${nunito.className}`} style={{color:'#00AEEF'}}>
            <IcoTruck size={18}/> Estimated delivery: 3–4 business days
          </p>
        </div>

        <div className="rounded-2xl p-4 mb-6 flex gap-3" style={{background:'#FFFBEB',border:'2px solid #FDE68A'}}>
          <IcoCoin size={36}/>
          <div>
            <p className={`font-bold text-yellow-800 ${nunito.className}`}>Pay on Delivery</p>
            <p className={`text-yellow-700 text-sm font-semibold mt-0.5 ${nunito.className}`}>
              Our agent collects ₹99 when your kit arrives. You can pay via Cash, UPI, or any method you prefer.
            </p>
          </div>
        </div>

        <button onClick={confirm} disabled={busy}
                className={`${fredoka.className} w-full text-xl font-semibold text-white py-5 rounded-2xl shadow-xl transition-all hover:scale-105 disabled:opacity-60 flex items-center justify-center gap-3`}
                style={{background:'linear-gradient(135deg,#00C853,#00AEEF)'}}>
          {busy ? 'Confirming...' : <><IcoCheck size={24} color="white"/> Yes, Confirm My Order</>}
        </button>
        <button onClick={onEdit} className={`w-full text-center text-sm font-bold text-gray-400 mt-4 hover:text-gray-700 py-2 ${nunito.className}`}>
          ← Go back and edit
        </button>
      </div>
    </div>
  );
}

// ── MAIN CHECKOUT PAGE ──────────────────────────────────────────────────────
export default function ReyyoCheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'summary'>('form');
  const [order, setOrder] = useState<OrderData | null>(null);

  const handleConfirm = (orderId: string) => {
    if (order) {
      // Save order details to localStorage for the Success Page
      localStorage.setItem('reyyo_last_order', JSON.stringify({ ...order, orderId }));
      router.push(`/reyyo/order-success?id=${orderId}`);
    }
  };

  if (step === 'summary' && order) {
    return (
      <OrderSummary
        data={order}
        onEdit={() => setStep('form')}
        onConfirm={handleConfirm}
      />
    );
  }

  return (
    <OrderForm
      onBack={() => router.push('/reyyo')}
      onNext={(d) => {
        setOrder(d);
        setStep('summary');
      }}
    />
  );
}
