'use client';

import { useState, useEffect } from 'react';

const ADMIN_PASSWORD = 'Learn@5678';

const SLOT_LABELS: Record<string, string> = {
  morning: '10 AM – 2 PM',
  afternoon: '3 PM – 7 PM',
  evening: '7 PM – 11 PM',
};

type Booking = {
  id: string;
  name: string;
  company: string;
  phone: string;
  biz_type: string;
  website: string | null;
  date: string;
  slot: string;
  paid: boolean;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  created_at: string;
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError('');
    } else {
      setError('Incorrect password.');
    }
  }

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    fetch('/api/seo-course/bookings?all=1')
      .then(r => r.json())
      .then(d => { setBookings(d.bookings || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [authed]);

  const filtered = bookings.filter(b => {
    if (filter === 'paid') return b.paid;
    if (filter === 'pending') return !b.paid;
    return true;
  });

  const totalPaid = bookings.filter(b => b.paid).length;
  const totalRevenue = totalPaid * 1;

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-4 font-['Poppins',sans-serif]">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 w-full max-w-sm shadow-lg">
          <h1 className="text-2xl font-extrabold text-[#0F172A] mb-1">Admin Panel</h1>
          <p className="text-[#9CA3AF] text-sm mb-6">SEO Masterclass Bookings</p>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#0F172A] text-sm focus:outline-none focus:border-[#16A34A] transition"
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#15803D] text-white font-bold text-sm"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-['Poppins',sans-serif] p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F172A]">SEO Masterclass Bookings</h1>
            <p className="text-[#9CA3AF] text-sm mt-0.5">All enrolments in one place</p>
          </div>
          <button onClick={() => setAuthed(false)} className="text-xs text-[#9CA3AF] hover:text-[#0F172A] transition">Logout</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: bookings.length },
            { label: 'Confirmed (Paid)', value: totalPaid },
            { label: 'Revenue (Rs. 1 each)', value: `Rs. ${totalRevenue.toLocaleString('en-IN')}` },
          ].map(s => (
            <div key={s.label} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
              <p className="text-2xl font-extrabold text-[#16A34A]">{s.value}</p>
              <p className="text-[#9CA3AF] text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-5">
          {(['all', 'paid', 'pending'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize border transition ${filter === f ? 'bg-[#16A34A] text-white border-[#16A34A]' : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#16A34A]'}`}
            >
              {f}
            </button>
          ))}
          <button
            onClick={() => { setLoading(true); fetch('/api/seo-course/bookings?all=1').then(r => r.json()).then(d => { setBookings(d.bookings || []); setLoading(false); }); }}
            className="ml-auto px-4 py-2 rounded-xl text-xs font-bold border border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#16A34A] transition"
          >
            ↻ Refresh
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-[#9CA3AF]">Loading bookings...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-[#9CA3AF]">No bookings found.</div>
        ) : (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                    {['Name', 'Company', 'Phone', 'Type', 'Date', 'Slot', 'Status', 'Booked On'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold text-[#9CA3AF] uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b, i) => (
                    <tr key={b.id} className={`border-b border-[#F3F4F6] ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAF7]'}`}>
                      <td className="px-4 py-3 font-semibold text-[#0F172A] whitespace-nowrap">{b.name}</td>
                      <td className="px-4 py-3 text-[#374151] whitespace-nowrap">{b.company}</td>
                      <td className="px-4 py-3">
                        <a href={`https://wa.me/91${b.phone}`} target="_blank" rel="noopener noreferrer" className="text-[#16A34A] font-semibold hover:underline whitespace-nowrap">
                          +91 {b.phone}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">{b.biz_type}</td>
                      <td className="px-4 py-3 text-[#374151] whitespace-nowrap">
                        {new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-[#374151] whitespace-nowrap">{SLOT_LABELS[b.slot] || b.slot}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${b.paid ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-[#FEF9C3] text-[#A16207]'}`}>
                          {b.paid ? '✓ Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#9CA3AF] whitespace-nowrap">
                        {new Date(b.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
