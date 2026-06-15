'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';
import { Fredoka, Nunito } from 'next/font/google';

const fredoka = Fredoka({ subsets: ['latin'], weight: ['400', '600', '700'] });
const nunito  = Nunito({ subsets: ['latin'], weight: ['400', '600', '700', '800'] });

const ADMIN_EMAIL    = process.env.NEXT_PUBLIC_REYYO_ADMIN_EMAIL    || 'founder@reyyo.in';
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_REYYO_ADMIN_PASSWORD || 'Vardaan@5678';

interface Order {
  id: string;
  order_id: string;
  name: string;
  whatsapp: string;
  business_name: string;
  business_type: string | null;
  website: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  status: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending:   { bg: '#FEF3C7', text: '#B45309' },
  shipped:   { bg: '#DBEAFE', text: '#1D4ED8' },
  delivered: { bg: '#D1FAE5', text: '#065F46' },
  cancelled: { bg: '#FEE2E2', text: '#B91C1C' },
};

export default function ReyyoAdmin() {
  const [authed, setAuthed]     = useState(false);
  const [email, setEmail]       = useState('');
  const [pw, setPw]             = useState('');
  const [pwErr, setPwErr]       = useState('');
  const [orders, setOrders]     = useState<Order[]>([]);
  const [loading, setLoading]   = useState(false);
  const [filter, setFilter]     = useState('all');
  const [search, setSearch]     = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  const login = () => {
    if (email === ADMIN_EMAIL && pw === ADMIN_PASSWORD) { setAuthed(true); setPwErr(''); }
    else setPwErr('Incorrect email or password');
  };

  useEffect(() => {
    if (!authed) return;
    loadOrders();
  }, [authed]);

  const loadOrders = async () => {
    setLoading(true);
    const supabase = createClient(
      process.env.NEXT_PUBLIC_REYYO_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_REYYO_SUPABASE_ANON_KEY!,
    );
    const { data } = await supabase
      .from('reyyo_orders')
      .select('*')
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    const supabase = createClient(
      process.env.NEXT_PUBLIC_REYYO_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_REYYO_SUPABASE_ANON_KEY!,
    );
    await supabase.from('reyyo_orders').update({ status }).eq('id', id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    setUpdating(null);
  };

  const filtered = orders.filter(o => {
    const matchStatus = filter === 'all' || o.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || o.name.toLowerCase().includes(q) || o.business_name.toLowerCase().includes(q) || o.whatsapp.includes(q) || o.order_id.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const counts = {
    all: orders.length,
    pending:   orders.filter(o=>o.status==='pending').length,
    shipped:   orders.filter(o=>o.status==='shipped').length,
    delivered: orders.filter(o=>o.status==='delivered').length,
    cancelled: orders.filter(o=>o.status==='cancelled').length,
  };

  if (!authed) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-5 ${nunito.className}`}
           style={{background:'linear-gradient(135deg,#FFF0F5,#F5F0FF)'}}>
        <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-sm text-center">
          <div className="flex flex-col items-center mb-1">
            <Image src="/reyyo/logo.webp" alt="Reyyo" width={140} height={60} className="object-contain h-14 w-auto"/>
            <span className="text-[10px] font-semibold text-gray-400 tracking-wide -mt-1">by Scalify</span>
          </div>
          <p className="text-gray-400 font-semibold mb-8">Admin Panel</p>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                 onKeyDown={e=>e.key==='Enter'&&login()}
                 placeholder="Admin email"
                 className="w-full px-4 py-3.5 rounded-2xl border-2 font-semibold text-gray-900 outline-none focus:border-purple-500 mb-3"
                 style={{borderColor:pwErr?'#EF4444':'#E5E7EB'}}/>
          <input type="password" value={pw} onChange={e=>setPw(e.target.value)}
                 onKeyDown={e=>e.key==='Enter'&&login()}
                 placeholder="Password"
                 className="w-full px-4 py-3.5 rounded-2xl border-2 font-semibold text-gray-900 outline-none focus:border-purple-500 mb-3"
                 style={{borderColor:pwErr?'#EF4444':'#E5E7EB'}}/>
          {pwErr && <p className="text-red-500 text-sm font-bold mb-3">{pwErr}</p>}
          <button onClick={login}
                  className={`${fredoka.className} w-full text-lg font-semibold text-white py-4 rounded-2xl transition-all hover:scale-105`}
                  style={{background:'linear-gradient(135deg,#FF2D78,#7B2FBE)'}}>
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${nunito.className}`}>
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex flex-col items-start">
          <Image src="/reyyo/logo.webp" alt="Reyyo" width={100} height={44} className="object-contain h-10 w-auto"/>
          <p className="text-xs text-gray-400 font-semibold -mt-0.5">Admin Panel</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadOrders}
                  className="text-sm font-bold px-4 py-2 rounded-xl border-2 transition-all hover:bg-gray-50"
                  style={{borderColor:'#E5E7EB',color:'#555'}}>
            ↻ Refresh
          </button>
          <button onClick={()=>setAuthed(false)}
                  className="text-sm font-bold px-4 py-2 rounded-xl text-red-500 border-2 border-red-100 hover:bg-red-50 transition-all">
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          {[
            {label:'Total',  count:counts.all,       color:'#7B2FBE', bg:'#F5F0FF'},
            {label:'Pending',count:counts.pending,   color:'#B45309', bg:'#FEF3C7'},
            {label:'Shipped',count:counts.shipped,   color:'#1D4ED8', bg:'#DBEAFE'},
            {label:'Delivered',count:counts.delivered,color:'#065F46',bg:'#D1FAE5'},
            {label:'Cancelled',count:counts.cancelled,color:'#B91C1C',bg:'#FEE2E2'},
          ].map(s=>(
            <div key={s.label} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
              <p className={`${fredoka.className} text-4xl font-bold`} style={{color:s.color}}>{s.count}</p>
              <p className="text-sm font-bold text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Revenue pill */}
        <div className="mb-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm shadow-sm"
             style={{background:'#D1FAE5',color:'#065F46',border:'1.5px solid #6EE7B7'}}>
          💰 Revenue: ₹{counts.delivered * 99} collected · ₹{counts.pending * 99 + counts.shipped * 99} pending
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input type="text" placeholder="Search name, business, WhatsApp, order ID..." value={search}
                 onChange={e=>setSearch(e.target.value)}
                 className="px-4 py-2.5 rounded-xl border-2 font-semibold text-sm outline-none focus:border-purple-400 flex-1 min-w-60"
                 style={{borderColor:'#E5E7EB'}}/>
          <div className="flex gap-2">
            {['all','pending','shipped','delivered','cancelled'].map(f=>(
              <button key={f} onClick={()=>setFilter(f)}
                      className={`text-xs font-bold px-4 py-2.5 rounded-xl border-2 capitalize transition-all ${filter===f?'border-purple-500 text-purple-700 bg-purple-50':'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                {f} {counts[f as keyof typeof counts] !== undefined ? `(${counts[f as keyof typeof counts]})` : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-gray-400 font-bold">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-bold">No orders found</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left" style={{background:'#F9FAFB'}}>
                    {['Order ID','Date','Name','WhatsApp','Business','Status','Action'].map(h=>(
                      <th key={h} className="px-5 py-4 font-bold text-gray-600 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(o=>{
                    const st = STATUS_COLORS[o.status] || { bg:'#F3F4F6', text:'#6B7280' };
                    return (
                      <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 font-bold" style={{color:'#7B2FBE'}}>{o.order_id}</td>
                        <td className="px-5 py-4 text-gray-500 font-semibold whitespace-nowrap">
                          {new Date(o.created_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
                        </td>
                        <td className="px-5 py-4 font-bold text-gray-900">{o.name}</td>
                        <td className="px-5 py-4">
                          <a href={`https://wa.me/91${o.whatsapp}`} target="_blank" rel="noreferrer"
                             className="font-bold hover:underline" style={{color:'#00C853'}}>
                            {o.whatsapp}
                          </a>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-bold text-gray-900">{o.business_name}</p>
                          {o.business_type && <p className="text-gray-400 text-xs font-semibold">{o.business_type}</p>}
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-bold capitalize"
                                style={{background:st.bg, color:st.text}}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <select value={o.status}
                                  disabled={updating===o.id}
                                  onChange={e=>updateStatus(o.id, e.target.value)}
                                  className="text-xs font-bold border-2 rounded-lg px-2 py-1.5 outline-none cursor-pointer"
                                  style={{borderColor:'#E5E7EB'}}>
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Address view on click */}
        <p className="text-xs text-gray-400 font-semibold mt-4 text-center">
          Showing {filtered.length} of {orders.length} orders
        </p>
      </div>
    </div>
  );
}
