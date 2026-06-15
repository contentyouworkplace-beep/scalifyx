'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Fredoka, Nunito } from 'next/font/google';
import {
  IcoGift, IcoStar, IcoPhone, IcoUsers, IcoCamera, IcoGlobe,
  IcoTruck, IcoBox, IcoQR, IcoChart, IcoRocket, IcoZap, IcoCoin,
  IcoCheck, IcoLock, IcoMessage, IcoHeart, IcoCoffee, IcoScissors,
  IcoPlate, IcoDumbbell, IcoTooth, IcoBag, IcoPill, IcoPaw,
  IcoCroissant, IcoBook, IcoSpa, IcoRepeat, IcoScan, IcoStore,
  IcoMapPin, IcoSparkle,
} from './icons';

const fredoka = Fredoka({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const nunito  = Nunito({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] });

type View = 'landing' | 'form' | 'summary' | 'success';

interface OrderData {
  name: string; whatsapp: string; businessName: string;
  businessType: string; website: string; address: string;
}
const emptyOrder: OrderData = {
  name: '', whatsapp: '', businessName: '', businessType: '', website: '', address: '',
};

// ── Logo ────────────────────────────────────────────────────────────────────
function ReyyoLogo({ size = 'md', dark = false }: { size?: 'sm'|'md'|'lg'; dark?: boolean }) {
  const { txt, o } = { sm:{txt:'text-2xl',o:28}, md:{txt:'text-3xl',o:36}, lg:{txt:'text-5xl',o:52} }[size];
  return (
    <div className="flex flex-col items-center select-none">
      <svg width={o*1.6} height={o*0.45} viewBox="0 0 64 18" className="mb-0.5">
        {[['32','18','32','3','#FF8C00'],['32','18','22','4','#FF2D78'],['32','18','10','11','#7B2FBE'],
          ['32','18','42','4','#00AEEF'],['32','18','54','11','#00C853'],['32','18','60','6','#FFD600'],['32','18','4','6','#FF8C00'],
        ].map(([x1,y1,x2,y2,c],i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
        ))}
      </svg>
      <div className={`${fredoka.className} ${txt} font-semibold flex items-center leading-none`}>
        <span style={{color:'#FF2D78'}}>r</span>
        <span style={{color:'#7B2FBE'}}>e</span>
        <span style={{color:'#FF8C00'}}>y</span>
        <span style={{color:'#00AEEF'}}>y</span>
        <span className="relative inline-flex items-center justify-center rounded-full text-white font-bold"
              style={{background:'#00C853',width:o,height:o,fontSize:o*0.55}}>o</span>
      </div>
      <svg width={o*2} height="11" viewBox="0 0 80 11" className="mt-0.5">
        <path d="M 4 2 Q 40 12 76 2" stroke="#FF2D78" strokeWidth="3" fill="none" strokeLinecap="round"/>
      </svg>
      <span className={`${nunito.className} text-xs font-semibold mt-0.5`}
            style={{color: dark ? '#9CA3AF' : '#111827'}}>by Scalify</span>
    </div>
  );
}

// ── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button onClick={() => setOpen(!open)}
              className={`w-full text-left py-5 px-6 flex justify-between items-start gap-4 ${nunito.className}`}>
        <span className="font-bold text-gray-900 text-left">{q}</span>
        <span className={`flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-45' : ''}`} style={{marginTop:2}}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" fill={open ? '#FF2D78' : '#F3F4F6'}/>
            <path d="M12 7V17M7 12H17" stroke={open ? 'white' : '#6B7280'} strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </span>
      </button>
      {open && <p className={`px-6 pb-5 text-gray-600 leading-relaxed font-semibold ${nunito.className}`}>{a}</p>}
    </div>
  );
}

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
    await new Promise(r => setTimeout(r, 900));
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
          <Image src="/reyyo/logo.png" alt="Reyyo" width={110} height={48} className="object-contain h-11 w-auto"/>
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
function OrderSummary({ data, onEdit, onConfirm }: { data:OrderData; onEdit:()=>void; onConfirm:()=>void }) {
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    setBusy(true);
    try {
      await fetch('/api/reyyo/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {}
    await new Promise(r => setTimeout(r, 1000));
    setBusy(false);
    onConfirm();
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
          <Image src="/reyyo/logo.png" alt="Reyyo" width={110} height={48} className="object-contain h-11 w-auto"/>
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
            <div key={r.l} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0 gap-4">
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
            <p className={`font-bold text-yellow-800 ${nunito.className}`}>Pay on Delivery — Cash Only</p>
            <p className={`text-yellow-700 text-sm font-semibold mt-0.5 ${nunito.className}`}>
              Our agent collects ₹99 cash when your kit arrives. No online payment needed.
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

// ── Thank You ────────────────────────────────────────────────────────────────
function ThankYou({ data }: { data: OrderData }) {
  const orderId = `REY-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
  const steps = [
    { icon:<IcoMessage size={28}/>, bg:'#F0FFF4', t:'WhatsApp Confirmation',  d:'Order details on your WhatsApp within 5 minutes' },
    { icon:<IcoBox size={28}/>,     bg:'#F0F8FF', t:'Kit Packed & Shipped',   d:'QR Sticker + Acrylic Stand shipped within 2 days' },
    { icon:<IcoTruck size={28}/>,   bg:'#FFF8F0', t:'Delivery in 3–4 Days',  d:'Delivered to your doorstep in 3–4 business days' },
    { icon:<IcoCoin size={28}/>,    bg:'#F5F0FF', t:'Pay on Delivery',        d:'Pay ₹99 cash to the delivery agent. Simple.' },
    { icon:<IcoGift size={28}/>,    bg:'#FFF0F5', t:'Go Live!',               d:'Place your QR stand & start earning loyal customers' },
  ];

  return (
    <div className="min-h-screen" style={{background:'linear-gradient(135deg,#F0FFF4,#fff,#F5F0FF)',animation:'reyyoSlideIn 0.4s cubic-bezier(.22,.68,0,1.2) both'}}>
      <style>{`@keyframes reyyoSlideIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div className="bg-white border-b px-5 py-4 flex flex-col items-center">
        <Image src="/reyyo/logo.png" alt="Reyyo" width={120} height={52} className="object-contain h-12 w-auto"/>
        <span className={`${nunito.className} text-[9px] font-semibold text-gray-400 -mt-0.5 tracking-wide`}>by Scalify</span>
      </div>
      <div className="max-w-lg mx-auto px-5 py-10">
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl"
               style={{background:'linear-gradient(135deg,#00C853,#00AEEF)'}}>
            <IcoCheck size={52} color="white"/>
          </div>
          <p className={`${fredoka.className} text-4xl font-bold text-gray-900`}>Order Confirmed!</p>
          <p className={`text-gray-500 font-semibold mt-2 ${nunito.className}`}>Your Reyyo Founder Pack is on its way!</p>
          <p className={`text-sm font-bold mt-2 ${nunito.className}`} style={{color:'#7B2FBE'}}>Order ID: {orderId}</p>
        </div>

        <div className="rounded-2xl p-5 mb-5 flex gap-3" style={{background:'#DCFCE7',border:'2px solid #86EFAC'}}>
          <IcoMessage size={36}/>
          <div>
            <p className={`font-bold text-green-800 ${nunito.className}`}>WhatsApp Confirmation Sent!</p>
            <p className={`text-green-700 text-sm font-semibold mt-0.5 ${nunito.className}`}>
              Order details sent to <strong>+91 {data.whatsapp}</strong>
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
            { l:'Name',      v:data.name },
            { l:'WhatsApp',  v:`+91 ${data.whatsapp}` },
            { l:'Business',  v:`${data.businessName}${data.businessType ? ` · ${data.businessType}` : ''}` },
            { l:'Deliver To',v:data.address },
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

        <p className={`text-center text-sm text-gray-400 font-semibold mt-6 ${nunito.className}`}>
          Questions?{' '}
          <a href="https://wa.me/916353583148" style={{color:'#00C853'}} className="font-bold hover:underline">
            WhatsApp us at +91 63535 83148
          </a>
        </p>
      </div>
    </div>
  );
}

// ── Trust bar items ──────────────────────────────────────────────────────────
const trustItems = [
  { icon: <IcoCoffee size={20}/>,    label: 'Cafés'        },
  { icon: <IcoScissors size={20}/>,  label: 'Salons'       },
  { icon: <IcoPlate size={20}/>,     label: 'Restaurants'  },
  { icon: <IcoDumbbell size={20}/>,  label: 'Gyms'         },
  { icon: <IcoTooth size={20}/>,     label: 'Clinics'      },
  { icon: <IcoBag size={20}/>,       label: 'Retail Stores'},
  { icon: <IcoSpa size={20}/>,       label: 'Spas'         },
  { icon: <IcoBook size={20}/>,      label: 'Tutoring'     },
  { icon: <IcoPaw size={20}/>,       label: 'Pet Shops'    },
  { icon: <IcoCroissant size={20}/>, label: 'Bakeries'     },
  { icon: <IcoPill size={20}/>,      label: 'Pharmacies'   },
  { icon: <IcoStore size={20}/>,     label: 'Boutiques'    },
];

// ── MAIN LANDING PAGE ────────────────────────────────────────────────────────
export default function ReyyoPage() {
  const [view, setView]         = useState<View>('landing');
  const [order, setOrder]       = useState<OrderData|null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (view !== 'landing') return;
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, [view]);

  const goToForm = () => { setView('form'); window.scrollTo(0, 0); };

  if (view === 'form') return (
    <OrderForm onBack={() => setView('landing')} onNext={d => { setOrder(d); setView('summary'); window.scrollTo(0,0); }}/>
  );
  if (view === 'summary' && order) return (
    <OrderSummary data={order} onEdit={() => setView('form')} onConfirm={() => { setView('success'); window.scrollTo(0,0); }}/>
  );
  if (view === 'success' && order) return <ThankYou data={order}/>;

  const pills = [
    { icon:<IcoGift size={18}/>,    label:'Loyalty Rewards',    color:'#FF2D78', bg:'#FFF0F5' },
    { icon:<IcoStar size={18}/>,    label:'Google Reviews',      color:'#FF8C00', bg:'#FFF8F0' },
    { icon:<IcoMessage size={18}/>, label:'WhatsApp Engagement', color:'#00C853', bg:'#F0FFF4' },
    { icon:<IcoUsers size={18}/>,   label:'Customer Database',   color:'#00AEEF', bg:'#F0F8FF' },
  ];

  return (
    <div className={`${nunito.className} bg-white overflow-x-hidden`}>

      {/* ══ NAVBAR ══════════════════════════════════════════════════════════ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white/80 backdrop-blur-sm'}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-20">
          <Link href="/reyyo" className="flex flex-col items-center">
            <Image src="/reyyo/logo.png" alt="Reyyo" width={180} height={80} className="object-contain h-[72px] w-auto"/>
            <span className={`${nunito.className} text-[10px] font-semibold text-gray-400 -mt-1 tracking-wide`}>by Scalify</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-600">
            {[['#pricing','Pricing'],['#features','Features'],['#how-it-works','How It Works'],['#faq','FAQ']].map(([h,l]) => (
              <a key={h} href={h} className="hover:text-purple-600 transition-colors">{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/reyyo/admin" className="hidden sm:block text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">Login</Link>
            <a href="#pricing" className="text-sm font-bold text-white px-5 py-2.5 rounded-full shadow-md transition-all hover:scale-105 hover:shadow-lg"
               style={{background:'linear-gradient(135deg,#FF2D78,#7B2FBE)'}}>
              Order Now
            </a>
          </div>
        </div>
      </nav>

      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section className="pt-28 pb-20 px-5 sm:px-8 relative overflow-hidden"
               style={{background:'linear-gradient(160deg,#fff 0%,#FFF5F8 50%,#F5F0FF 100%)'}}>
        <div className="absolute top-20 left-0 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none" style={{background:'#FF2D78'}}/>
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none" style={{background:'#7B2FBE'}}/>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-6"
                 style={{background:'#FFF0F5',color:'#FF2D78',border:'1.5px solid #FFCCD9'}}>
              <IcoSparkle size={16}/> Founder Plan — ₹99 Lifetime · Only First 500 Businesses in Vadodara
            </div>

            <h1 className={`${fredoka.className} font-bold leading-[1.1] mb-6`}
                style={{fontSize:'clamp(2.8rem,6vw,4.5rem)',color:'#0F0A1E'}}>
              Turn{' '}<span style={{color:'#FF2D78'}}>First-Time</span><br/>
              Customers Into<br/>
              <span style={{color:'#7B2FBE'}}>Regulars</span>
            </h1>

            <p className={`text-lg sm:text-xl text-gray-500 font-semibold mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed`}>
              Reward customers for every visit and keep them coming back — with one simple QR code on your counter.
            </p>

            <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start mb-10">
              {pills.map(p => (
                <span key={p.label}
                      className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full shadow-sm border"
                      style={{borderColor:p.color+'30',color:p.color,background:p.bg}}>
                  {p.icon} {p.label}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#pricing"
                 className={`${fredoka.className} flex items-center justify-center gap-2 text-lg font-semibold text-white px-9 py-4 rounded-2xl shadow-xl transition-all hover:scale-105 hover:shadow-2xl`}
                 style={{background:'linear-gradient(135deg,#FF2D78,#7B2FBE)'}}>
                <IcoTruck size={22}/> Order Now — Pay on Delivery
              </a>
              <a href="#pricing"
                 className={`${fredoka.className} flex items-center justify-center gap-2 text-lg font-semibold px-9 py-4 rounded-2xl border-2 transition-all hover:scale-105`}
                 style={{borderColor:'#00C853',color:'#00C853',background:'#F0FFF4'}}>
                <IcoBox size={22}/> Get Free Stand Kit
              </a>
            </div>
            <p className={`text-sm text-gray-400 mt-4 font-semibold`}>No app required · Setup in 5 minutes · Free delivery</p>
          </div>

          {/* Right — QR Stand (1.5x mobile, 1.2x desktop) */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-96 sm:w-[420px] lg:w-[480px]">
              <div className="absolute -inset-8 rounded-full blur-3xl opacity-20 pointer-events-none"
                   style={{background:'linear-gradient(135deg,#FF2D78,#7B2FBE,#00AEEF)'}}/>

              {/* ── Floating decorative elements ── */}
              {/* Coin — top left */}
              <div className="absolute -left-8 top-12 animate-bounce" style={{animationDuration:'3s'}}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="22" fill="#FFD600" stroke="#FF8C00" strokeWidth="2.5"/>
                  <circle cx="24" cy="24" r="16" fill="#FFC200" opacity="0.6"/>
                  <text x="24" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#FF8C00">₹</text>
                </svg>
              </div>
              {/* Star — top right */}
              <div className="absolute -right-6 top-16 animate-bounce" style={{animationDuration:'2.5s',animationDelay:'0.4s'}}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M20 4L23.5 15H36L26.5 22L30 33L20 26L10 33L13.5 22L4 15H16.5L20 4Z" fill="#FF2D78" stroke="#FF2D78" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </div>
              {/* Gift box — bottom left */}
              <div className="absolute -left-10 bottom-28 animate-bounce" style={{animationDuration:'3.5s',animationDelay:'0.8s'}}>
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <rect x="4" y="18" width="36" height="22" rx="3" fill="#7B2FBE"/>
                  <rect x="4" y="12" width="36" height="8" rx="2" fill="#9B4FDE"/>
                  <rect x="19" y="12" width="6" height="28" fill="#FFD600"/>
                  <path d="M22 12C22 12 16 6 14 8C12 10 17 12 22 12Z" fill="#FF2D78"/>
                  <path d="M22 12C22 12 28 6 30 8C32 10 27 12 22 12Z" fill="#FF2D78"/>
                </svg>
              </div>
              {/* Sparkle — top center-right */}
              <div className="absolute right-4 top-4 animate-spin" style={{animationDuration:'8s'}}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 2L17.5 13L28 8L19 17L28 22L17.5 19L16 30L14.5 19L4 22L13 17L4 8L14.5 13L16 2Z" fill="#00AEEF" opacity="0.85"/>
                </svg>
              </div>
              {/* Reward badge — bottom right */}
              <div className="absolute -right-8 bottom-20 animate-bounce" style={{animationDuration:'2.8s',animationDelay:'1s'}}>
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                  <circle cx="25" cy="25" r="22" fill="#00C853" stroke="#00A040" strokeWidth="2"/>
                  <circle cx="25" cy="25" r="15" fill="#00E860" opacity="0.5"/>
                  <text x="25" y="21" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">FREE</text>
                  <text x="25" y="33" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white">REWARD</text>
                </svg>
              </div>
              {/* Small star — far left mid */}
              <div className="absolute -left-6 top-1/2 animate-bounce" style={{animationDuration:'4s',animationDelay:'1.5s'}}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M14 2L16.5 10H25L18.5 15L21 23L14 18L7 23L9.5 15L3 10H11.5L14 2Z" fill="#FF8C00"/>
                </svg>
              </div>
              {/* Lightning bolt — top left area */}
              <div className="absolute left-6 top-2 animate-bounce" style={{animationDuration:'2.2s',animationDelay:'0.6s'}}>
                <svg width="26" height="36" viewBox="0 0 26 36" fill="none">
                  <path d="M15 2L4 20H12L11 34L22 14H14L15 2Z" fill="#FFD600" stroke="#FF8C00" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </div>

              <Image src="/reyyo/qr-stand-v2.png" alt="Reyyo QR Stand Kit"
                     width={520} height={693} priority
                     className="relative drop-shadow-2xl object-contain"/>
            </div>
          </div>
        </div>
      </section>

      {/* ══ VADODARA STRIP ══════════════════════════════════════════════════ */}
      <section className="py-8 px-5 border-y text-center" style={{background:'#FFFBF0',borderColor:'#FFE5A0'}}>
        <p className={`text-base sm:text-lg font-semibold text-gray-700 leading-relaxed`}>
          Reyyo is a{' '}
          <span className={`${fredoka.className} font-bold text-xl px-2.5 py-0.5 rounded-xl inline-block`} style={{color:'#FF2D78',background:'#FFF0F5'}}>Vadodara</span>
          {' '}-based startup built for{' '}
          <span className={`${fredoka.className} font-bold text-xl px-2.5 py-0.5 rounded-xl inline-block`} style={{color:'#7B2FBE',background:'#F5F0FF'}}>Vadodara</span>
          {' '}businesses. We understand your customers, your market, and your challenges — because we are from{' '}
          <span className={`${fredoka.className} font-bold text-xl px-2.5 py-0.5 rounded-xl inline-block`} style={{color:'#FF8C00',background:'#FFF8F0'}}>Vadodara</span>
          {' '}too.
        </p>
        <div className="text-gray-500 font-bold mt-3 flex items-center justify-center gap-2">
          <IcoMapPin size={20}/>
          <span>Built for <strong>Vadodara</strong> with</span>
          <IcoHeart size={20}/>
        </div>
      </section>

      {/* ══ TRUST BAR ═══════════════════════════════════════════════════════ */}
      <section className="py-8 overflow-hidden border-b" style={{borderColor:'#F0F0F0',background:'#FAFAFA'}}>
        <p className={`${fredoka.className} text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5`}>
          Trusted by Local Businesses Across Vadodara
        </p>
        <div style={{animation:'marquee 28s linear infinite',display:'flex',width:'max-content',gap:'12px'}}>
          {[...trustItems,...trustItems].map((b,i) => (
            <div key={i} className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white shadow-sm border font-bold text-sm flex-shrink-0"
                 style={{borderColor:'#EBEBEB',color:'#555'}}>
              {b.icon} {b.label}
            </div>
          ))}
        </div>
      </section>

      {/* ══ PROBLEM ═════════════════════════════════════════════════════════ */}
      <section className="py-24 px-5 sm:px-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{background:'linear-gradient(160deg,#fff 0%,#FFF5F8 60%,#F5F0FF 100%)'}}/>
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-14">
            <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5`}
                  style={{background:'#FFF0F5',color:'#FF2D78',border:'1.5px solid #FFCCD9'}}>
              😬 The Problem
            </span>
            <h2 className={`${fredoka.className} font-bold`} style={{fontSize:'clamp(2rem,5vw,3.5rem)',color:'#0F0A1E'}}>
              Most Businesses Lose Customers<br/>
              <span style={{color:'#FF2D78'}}>After The First Visit</span>
            </h2>
            <p className={`text-gray-400 text-lg mt-3 font-semibold`}>Sound familiar? You're not alone.</p>
          </div>

          {/* Problem cards grid */}
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {[
              { icon:<IcoUsers size={28}/>, title:'No Customer Database', desc:'You have no idea who visited last week — or how to reach them again.', c:'#FF2D78', bg:'#FFF0F5' },
              { icon:<IcoMessage size={28}/>, title:'No Follow-Up System', desc:'Customers walk out and you have zero way to send them an offer or reminder.', c:'#7B2FBE', bg:'#F5F0FF' },
              { icon:<IcoGift size={28}/>, title:'No Loyalty Program', desc:'Your competitor down the road gives stamp cards. You give… nothing.', c:'#FF8C00', bg:'#FFF8F0' },
              { icon:<IcoRepeat size={28}/>, title:'No Way to Bring Them Back', desc:'First-time customers never become regulars because there\'s no reason to return.', c:'#00AEEF', bg:'#F0F8FF' },
            ].map(p => (
              <div key={p.title} className="flex items-start gap-4 p-5 rounded-2xl border-2 transition-all hover:shadow-md"
                   style={{background:p.bg, borderColor:p.c+'30'}}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                     style={{background:p.c+'15'}}>
                  <span style={{color:p.c}}>{p.icon}</span>
                </div>
                <div>
                  <p className={`${fredoka.className} font-bold text-lg mb-1`} style={{color:'#0F0A1E'}}>{p.title}</p>
                  <p className="text-gray-500 font-semibold text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Solution callout */}
          <div className="rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 shadow-xl"
               style={{background:'linear-gradient(135deg,#0F0A1E,#2D1B69)',border:'2px solid #7B2FBE40'}}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                 style={{background:'linear-gradient(135deg,#00C853,#00AEEF)'}}>
              <IcoScan size={32}/>
            </div>
            <div className="text-center sm:text-left">
              <p className={`${fredoka.className} text-2xl font-bold text-white`}>
                Reyyo fixes all of this with{' '}
                <span style={{color:'#00C853'}}>one simple QR code.</span>
              </p>
              <p className="text-gray-400 font-semibold text-sm mt-1">Place it on your counter. Customers scan. You grow.</p>
            </div>
            <a href="#pricing"
               className={`${fredoka.className} flex-shrink-0 text-base font-bold text-white px-6 py-3 rounded-2xl transition-all hover:scale-105 shadow-lg`}
               style={{background:'linear-gradient(135deg,#FF2D78,#7B2FBE)'}}>
              Get Started →
            </a>
          </div>
        </div>
      </section>

      {/* ══ PRICING ═════════════════════════════════════════════════════════ */}
      <section id="pricing" className="py-20 px-5 sm:px-8"
               style={{background:'linear-gradient(135deg,#FFF5F8,#F5F0FF)'}}>
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full`}
                  style={{background:'#FFF0F5',color:'#FF2D78'}}>
              <IcoSparkle size={16}/> Founder Offer
            </span>
            <h2 className={`${fredoka.className} font-bold mt-4`} style={{fontSize:'clamp(2rem,5vw,3rem)',color:'#0F0A1E'}}>
              Launch <span style={{color:'#FF2D78'}}>Special</span>
            </h2>
            <p className={`text-gray-400 font-semibold mt-2`}>Only for the first 500 businesses.</p>
          </div>

          <div className="p-[3px] rounded-3xl shadow-2xl"
               style={{background:'linear-gradient(135deg,#FF2D78,#7B2FBE,#00AEEF,#00C853)'}}>
            <div className="bg-white rounded-[22px] p-8 sm:p-12">
              <div className="flex justify-center mb-6">
                <span className={`inline-flex items-center gap-2 text-sm font-bold px-5 py-2 rounded-full text-white`}
                      style={{background:'linear-gradient(135deg,#FF8C00,#FF2D78)'}}>
                  <IcoZap size={16}/> Lifetime Deal · Only First 500 Businesses
                </span>
              </div>
              <div className="text-center mb-8">
                <div className="flex items-end justify-center gap-2 mb-3">
                  <span className={`${fredoka.className} font-bold`} style={{fontSize:'5rem',lineHeight:1,color:'#FF2D78'}}>₹99</span>
                  <div className="mb-3 text-left">
                    <span className={`text-2xl text-gray-800 font-bold block`}>Lifetime</span>
                    <span className={`text-xs text-gray-400 font-semibold`}>one-time · pay on delivery</span>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
                     style={{background:'#FFF8F0',border:'1.5px dashed #FF8C00',color:'#FF8C00'}}>
                  ⏳ After first 500 spots fill → ₹99/year for new businesses
                </div>
              </div>
              <div className="space-y-3 mb-10">
                {[
                  { t:'Reyyo Account (Lifetime)',         icon:<IcoPhone size={22}/>, c:'#FF2D78' },
                  { t:'QR Sticker (printed & shipped)',   icon:<IcoQR size={22}/>,    c:'#7B2FBE' },
                  { t:'Acrylic Stand (delivered free)',   icon:<IcoBox size={22}/>,   c:'#FF8C00' },
                  { t:'Business Dashboard Access',        icon:<IcoChart size={22}/>, c:'#00AEEF' },
                  { t:'Customer Rewards System',          icon:<IcoGift size={22}/>,  c:'#00C853' },
                ].map(f => (
                  <div key={f.t} className="flex items-center gap-3 p-3 rounded-xl" style={{background:f.c+'0D'}}>
                    {f.icon}
                    <span className={`font-bold text-gray-800`}>{f.t}</span>
                  </div>
                ))}
              </div>
              <button onClick={goToForm}
                      className={`${fredoka.className} w-full text-xl font-semibold text-white py-5 rounded-2xl shadow-xl transition-all hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3`}
                      style={{background:'linear-gradient(135deg,#FF2D78,#7B2FBE)'}}>
                <IcoTruck size={24}/> Order Now — Pay on Delivery
              </button>
              <p className={`text-center text-gray-400 text-sm font-semibold mt-4 flex items-center justify-center gap-1.5`}>
                <IcoLock size={14}/> Free delivery · Pay ₹99 only when your kit arrives
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-24 px-5 sm:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full`}
                  style={{background:'#FFE8F0',color:'#FF2D78'}}>Simple Setup</span>
            <h2 className={`${fredoka.className} font-bold mt-4`} style={{fontSize:'clamp(1.8rem,4vw,3rem)',color:'#0F0A1E'}}>
              Simple Setup. <span style={{color:'#7B2FBE'}}>Powerful Results.</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n:'01', icon:<IcoScan size={52}/>,   bg:'#FFF0F5', border:'#FF2D78', t:'Display Your QR Code', d:'Place your Reyyo QR stand on your counter. Every customer sees it.' },
              { n:'02', icon:<IcoPhone size={52}/>,  bg:'#F5F0FF', border:'#7B2FBE', t:'Customer Scans',       d:'Scan with any phone camera. No app download, no friction.' },
              { n:'03', icon:<IcoGift size={52}/>,   bg:'#FFF8F0', border:'#FF8C00', t:'Earns Rewards',        d:'Visit 5 times → Get Free Coffee. Customers track progress live.' },
              { n:'04', icon:<IcoRepeat size={52}/>, bg:'#F0FFF4', border:'#00C853', t:'Comes Back Again',     d:'Customers return to earn more points and unlock bigger rewards.' },
            ].map(s => (
              <div key={s.n} className="rounded-3xl p-7 text-center transition-all hover:-translate-y-2 hover:shadow-xl"
                   style={{background:s.bg,border:`2px solid ${s.border}20`}}>
                <div className={`${fredoka.className} text-5xl font-bold mb-3 opacity-10`} style={{color:s.border}}>{s.n}</div>
                <div className="flex justify-center mb-4">{s.icon}</div>
                <h3 className={`${fredoka.className} text-xl font-bold mb-3`} style={{color:s.border}}>{s.t}</h3>
                <p className={`text-gray-500 text-sm leading-relaxed font-semibold`}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CUSTOMER APP ════════════════════════════════════════════════════ */}
      <section className="py-24 px-5 sm:px-8" style={{background:'#FAFAFA'}}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full`}
                  style={{background:'#E8F5FF',color:'#00AEEF'}}>Customer Experience</span>
            <h2 className={`${fredoka.className} font-bold mt-4`} style={{fontSize:'clamp(1.8rem,4vw,3rem)',color:'#0F0A1E'}}>
              Customers <span style={{color:'#FF2D78'}}>Love</span> Rewards
            </h2>
            <p className={`text-gray-400 text-lg mt-2 font-semibold`}>No app to download. Works instantly in the browser.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { t:'Earn Points',    sub:'Track visit progress',     img:'/reyyo/customer-home.png',   c:'#FF2D78' },
              { t:'Special Offers', sub:'Exclusive deals & actions', img:'/reyyo/customer-offers.png', c:'#7B2FBE' },
              { t:'My Wallet',      sub:'Redeem rewards anytime',   img:'/reyyo/customer-wallet.png', c:'#FF8C00' },
              { t:'Google Review',  sub:'Auto-generated for them',  img:'/reyyo/customer-review.png', c:'#00C853' },
            ].map(s => (
              <div key={s.t} className="flex flex-col items-center">
                <div className="relative w-52 shadow-2xl rounded-[2.5rem] overflow-hidden border-[3px]"
                     style={{borderColor:s.c+'50',aspectRatio:'9/19',background:'#f0f0f0'}}>
                  <Image src={s.img} alt={s.t} fill className="object-cover object-top"/>
                </div>
                <h4 className={`${fredoka.className} text-xl font-bold mt-4`} style={{color:s.c}}>{s.t}</h4>
                <p className={`text-gray-400 text-sm font-semibold mt-1`}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BUSINESS DASHBOARD ══════════════════════════════════════════════ */}
      <section className="py-24 px-5 sm:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full`}
                  style={{background:'#F0E8FF',color:'#7B2FBE'}}>Business Dashboard</span>
            <h2 className={`${fredoka.className} font-bold mt-4`} style={{fontSize:'clamp(1.8rem,4vw,3rem)',color:'#0F0A1E'}}>
              Powerful Yet <span style={{color:'#7B2FBE'}}>Simple</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { t:'Business Overview',  sub:'Members · Repeat customers · Reviews — all in one view', img:'/reyyo/dashboard-main.png',       c:'#7B2FBE', icon:<IcoChart size={22}/> },
              { t:'Customer Hub',        sub:'Every customer, every visit, every point. One place.',    img:'/reyyo/dashboard-members.png',    c:'#FF2D78', icon:<IcoUsers size={22}/> },
              { t:'Create Rewards',      sub:'Free Coffee after 5 visits. You decide the reward.',       img:'/reyyo/dashboard-rewards.png',    c:'#FF8C00', icon:<IcoGift size={22}/>  },
              { t:'Engagement Center',   sub:'Google Reviews · Instagram · Website Traffic',             img:'/reyyo/dashboard-engagement.png', c:'#00AEEF', icon:<IcoStar size={22}/>  },
            ].map(d => (
              <div key={d.t} className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                   style={{border:`2px solid ${d.c}20`}}>
                <div className="relative h-56 sm:h-64 bg-gray-50">
                  <Image src={d.img} alt={d.t} fill className="object-cover object-top"/>
                </div>
                <div className="p-5 flex items-center gap-3">
                  {d.icon}
                  <div>
                    <h3 className={`${fredoka.className} text-xl font-bold`} style={{color:d.c}}>{d.t}</h3>
                    <p className={`text-gray-400 text-sm font-semibold`}>{d.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ════════════════════════════════════════════════════════ */}
      <section id="features" className="py-24 px-5 sm:px-8" style={{background:'#FAFAFA'}}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`${fredoka.className} font-bold`} style={{fontSize:'clamp(1.8rem,4vw,3rem)',color:'#0F0A1E'}}>
              Everything You Need To Keep<br/>
              <span style={{color:'#FF2D78'}}>Customers Engaged</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon:<IcoGift size={52}/>,    c:'#FF2D78', bg:'#FFF0F5', t:'Loyalty Rewards',    d:'Create visit-based or points-based rewards. Free coffee after 5 visits. You decide.' },
              { icon:<IcoStar size={52}/>,    c:'#FF8C00', bg:'#FFF8F0', t:'Google Reviews',      d:'Auto-generated review suggestions make it a 30-second task for every customer.' },
              { icon:<IcoMessage size={52}/>, c:'#00C853', bg:'#F0FFF4', t:'WhatsApp Engagement', d:'Stay connected. Send offers and campaigns directly via WhatsApp.' },
              { icon:<IcoUsers size={52}/>,   c:'#7B2FBE', bg:'#F5F0FF', t:'Customer Database',   d:'Name, mobile, visits, points — auto-collected every time someone scans your QR.' },
              { icon:<IcoCamera size={52}/>,  c:'#FF2D78', bg:'#FFF0F5', t:'Instagram Growth',    d:'Reward customers for following your page and grow your social presence.' },
              { icon:<IcoGlobe size={52}/>,   c:'#00AEEF', bg:'#F0F8FF', t:'Website Traffic',     d:'Drive repeat customers to your website. Every scan can earn them points.' },
            ].map(f => (
              <div key={f.t} className="rounded-3xl p-8 transition-all hover:-translate-y-1 hover:shadow-xl"
                   style={{background:f.bg,border:`2px solid ${f.c}15`}}>
                <div className="mb-5">{f.icon}</div>
                <h3 className={`${fredoka.className} text-2xl font-bold mb-3`} style={{color:f.c}}>{f.t}</h3>
                <p className={`text-gray-500 leading-relaxed font-semibold`}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ QR CODE DESIGN ══════════════════════════════════════════════════ */}
      <section className="py-24 px-5 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left — text */}
            <div className="flex-1 text-center lg:text-left">
              <span className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full ${nunito.className}`}
                    style={{background:'#FFF0F5',color:'#FF2D78'}}>Your QR Code</span>
              <h2 className={`${fredoka.className} font-bold mt-4 mb-5`} style={{fontSize:'clamp(1.8rem,4vw,3rem)',color:'#0F0A1E'}}>
                How Your <span style={{color:'#FF2D78'}}>QR Code</span><br/>Will Look
              </h2>
              <p className={`text-gray-500 text-lg font-semibold leading-relaxed mb-6 ${nunito.className}`}>
                Every Reyyo QR code is uniquely designed with your brand colours and business name — ready to print and display on your acrylic stand.
              </p>
              <div className="space-y-3">
                {[
                  {c:'#FF2D78', t:'Unique to your business'},
                  {c:'#7B2FBE', t:'Printed & shipped to you'},
                  {c:'#00C853', t:'Works with any phone camera'},
                  {c:'#FF8C00', t:'No app needed to scan'},
                ].map(f => (
                  <div key={f.t} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{background:f.c}}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <span className={`font-bold text-gray-800 ${nunito.className}`}>{f.t}</span>
                  </div>
                ))}
              </div>
              <a href="#pricing" className={`${fredoka.className} inline-flex items-center gap-2 mt-8 text-lg font-bold text-white px-8 py-4 rounded-2xl shadow-xl transition-all hover:scale-105`}
                 style={{background:'linear-gradient(135deg,#FF2D78,#7B2FBE)'}}>
                <IcoQR size={22}/> Get Your QR Code Now
              </a>
            </div>
            {/* Right — QR design image */}
            <div className="flex-1 flex justify-center">
              <div className="relative w-72 sm:w-96 lg:w-[420px]">
                <div className="absolute -inset-6 rounded-3xl blur-2xl opacity-20 pointer-events-none"
                     style={{background:'linear-gradient(135deg,#FF2D78,#7B2FBE)'}}/>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4"
                     style={{borderColor:'#FF2D7830'}}>
                  <Image src="/reyyo/qr-design.png" alt="Reyyo QR Code Design"
                         width={500} height={500} className="w-full object-contain"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STANDY COLLAGE ══════════════════════════════════════════════════ */}
      <section className="py-24 px-5 sm:px-8" style={{background:'#FAFAFA'}}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full ${nunito.className}`}
                  style={{background:'#F0E8FF',color:'#7B2FBE'}}>The Reyyo Stand</span>
            <h2 className={`${fredoka.className} font-bold mt-4`} style={{fontSize:'clamp(1.8rem,4vw,3rem)',color:'#0F0A1E'}}>
              Built to <span style={{color:'#7B2FBE'}}>Stand Out</span> on Your Counter
            </h2>
            <p className={`text-gray-400 text-lg mt-2 font-semibold ${nunito.className}`}>
              Premium acrylic stand, shipped free with your Founder Pack.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {img:'/reyyo/standy-1.png', label:'Café Display',     c:'#FF2D78'},
              {img:'/reyyo/standy-2.png', label:'Restaurant Setup', c:'#7B2FBE'},
              {img:'/reyyo/standy-3.png', label:'Retail Counter',   c:'#FF8C00'},
              {img:'/reyyo/standy-4.png', label:'Salon & Spa',      c:'#00AEEF'},
            ].map(s => (
              <div key={s.label} className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 aspect-[3/4]">
                <Image src={s.img} alt={s.label} fill className="object-cover transition-transform duration-500 group-hover:scale-105"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"/>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className={`text-white font-bold text-sm px-3 py-1.5 rounded-full ${nunito.className}`}
                        style={{background:s.c}}>{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY REYYO ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-5 sm:px-8" style={{background:'linear-gradient(135deg,#1A1A2E,#2D1B69)'}}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`${fredoka.className} font-bold text-white`} style={{fontSize:'clamp(1.8rem,4vw,3rem)'}}>
              Why Business Owners <span style={{color:'#FFD600'}}>Love</span> Reyyo
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon:<IcoQR size={52}/>,     c:'#FF2D78', t:'One QR Code',      d:'Everything starts with a scan. No hardware, no complication.' },
              { icon:<IcoRocket size={52}/>, c:'#00AEEF', t:'No App Required',  d:'Works in the browser instantly. Zero friction for customers.' },
              { icon:<IcoZap size={52}/>,    c:'#FFD600', t:'Setup In Minutes', d:'No technical skills needed. Display your QR stand and go live today.' },
              { icon:<IcoCoin size={52}/>,   c:'#00C853', t:'₹99 Lifetime',     d:'The most affordable loyalty platform in India. Pay once, keep customers forever.' },
            ].map(w => (
              <div key={w.t} className="p-8 rounded-3xl text-center"
                   style={{background:'rgba(255,255,255,0.06)',border:`1px solid ${w.c}35`}}>
                <div className="flex justify-center mb-5">{w.icon}</div>
                <h3 className={`${fredoka.className} text-xl font-bold mb-3`} style={{color:w.c}}>{w.t}</h3>
                <p className={`text-gray-300 text-sm leading-relaxed font-semibold`}>{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FREE STAND BANNER ═══════════════════════════════════════════════ */}
      <section className="py-14 px-5 sm:px-8" style={{background:'linear-gradient(135deg,#00C853,#00AEEF)'}}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
          <div className="text-center sm:text-left flex items-center gap-4">
            <IcoBox size={56}/>
            <div>
              <p className={`${fredoka.className} text-3xl font-bold`}>Get Your Free QR Stand Kit!</p>
              <p className={`text-white/80 font-semibold mt-1`}>Order today and we ship your Acrylic Stand + QR Sticker free. Pay on delivery.</p>
            </div>
          </div>
          <a href="#pricing"
             className={`${fredoka.className} flex-shrink-0 flex items-center gap-2 text-lg font-bold px-8 py-4 rounded-2xl shadow-xl transition-all hover:scale-105 whitespace-nowrap`}
             style={{background:'white',color:'#00C853'}}>
            <IcoGift size={22}/> Claim Free Stand →
          </a>
        </div>
      </section>

      {/* ══ FAQ ═════════════════════════════════════════════════════════════ */}
      <section id="faq" className="py-24 px-5 sm:px-8" style={{background:'#FAFAFA'}}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`${fredoka.className} font-bold`} style={{fontSize:'clamp(1.8rem,4vw,3rem)',color:'#0F0A1E'}}>
              Got <span style={{color:'#7B2FBE'}}>Questions?</span>
            </h2>
          </div>
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
            {[
              { q:'Do customers need to install an app?',          a:"No. Everything works instantly in the browser. Customers just scan the QR code and they're in — no download, no friction." },
              { q:'What is the Free QR Stand Kit?',                a:"When you order, we print and ship a physical Reyyo QR sticker + acrylic stand to your business — completely free. Display it on your counter and you're live." },
              { q:'Can I create my own rewards?',                  a:"Yes! Create visit-based rewards (Free Coffee after 5 visits), points-based offers, and action-based campaigns — all from your simple dashboard." },
              { q:'Can I collect customer data?',                  a:'Yes. Every scan automatically collects customer name, mobile number, total visits, points, and all activity. Your customer database builds itself.' },
              { q:'Can I collect Google Reviews?',                 a:'Yes. Reyyo prompts happy customers to leave a Google Review and auto-generates a review suggestion — making it a 30-second task.' },
              { q:"What happens after the first 500 businesses?",  a:"The founder lifetime plan is only for the first 500. After that, it's ₹99/year. Order now to lock in your lifetime access." },
            ].map(item => <FAQ key={item.q} q={item.q} a={item.a}/>)}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-5 sm:px-8 text-center relative overflow-hidden"
               style={{background:'linear-gradient(135deg,#FF2D78,#7B2FBE,#00AEEF)'}}>
        <div className="absolute top-8 left-8 opacity-10 pointer-events-none"><IcoGift size={96}/></div>
        <div className="absolute bottom-8 right-8 opacity-10 pointer-events-none"><IcoStar size={96}/></div>
        <div className="max-w-3xl mx-auto relative">
          <h2 className={`${fredoka.className} font-bold text-white mb-6`} style={{fontSize:'clamp(2rem,5vw,4rem)'}}>
            Ready To Get More<br/>Repeat Customers?
          </h2>
          <p className={`text-white/80 text-xl mb-10 font-semibold`}>
            Start rewarding your customers today. Only ₹99. Lifetime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#pricing"
               className={`${fredoka.className} flex items-center justify-center gap-2 text-xl font-bold px-10 py-5 rounded-2xl shadow-2xl transition-all hover:scale-105`}
               style={{background:'white',color:'#FF2D78'}}>
              <IcoTruck size={26}/> Order Now — Pay on Delivery
            </a>
            <a href="#pricing"
               className={`${fredoka.className} flex items-center justify-center gap-2 text-xl font-bold px-10 py-5 rounded-2xl border-2 border-white text-white transition-all hover:scale-105 hover:bg-white/10`}>
              <IcoBox size={26}/> Get Free Stand Kit
            </a>
          </div>
          <p className={`text-white/50 text-sm mt-6 font-semibold`}>
            Only for first 500 businesses · Free delivery · Pay on delivery
          </p>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer className="py-16 px-5 sm:px-8" style={{background:'#0F0A1E'}}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-10">
            <Image src="/reyyo/logo.png" alt="Reyyo" width={320} height={144} className="object-contain h-32 w-auto"/>
            <p className={`text-gray-500 mt-3 font-semibold`}>scan. unlock rewards. enjoy.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 mb-10">
            {[['#','Home'],['#features','Features'],['#how-it-works','How It Works'],['#pricing','Pricing'],['#faq','FAQ'],['/reyyo/admin','Login']].map(([h,l]) => (
              <a key={l} href={h} className={`hover:text-white transition-colors font-semibold`}>{l}</a>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className={`text-sm text-gray-600 font-medium`}>© 2025 Reyyo by Scalify. All rights reserved.</p>
            <div className="flex gap-6">
              {[['Privacy Policy','/reyyo/privacy-policy'],['Terms','/reyyo/terms'],['Contact','/reyyo/contact']].map(([l,h]) => (
                <Link key={l} href={h} className={`text-sm text-gray-600 hover:text-white transition-colors font-semibold`}>{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
      `}</style>
    </div>
  );
}
