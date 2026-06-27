'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const ADMIN_PASSWORD = 'Webinar@2026';

type Lead = {
  id: string;
  name: string;
  whatsapp: string;
  company: string;
  website: string | null;
  pain_point: string;
  created_at: string;
};

type LeadMeta = {
  status: string;
  notes: string;
  joined_group: boolean;
  converted: boolean;
  revenue: number;
};

const STATUS_COLORS: Record<string, string> = {
  New: 'bg-blue-50 text-blue-600 border border-blue-100',
  Hot: 'bg-red-50 text-red-600 border border-red-100',
  Warm: 'bg-orange-50 text-orange-600 border border-orange-100',
  Cold: 'bg-slate-100 text-slate-600 border border-slate-200',
  Archived: 'bg-slate-50 text-slate-400 border border-slate-100',
};

export default function WebinarAdmin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [groupFilter, setGroupFilter] = useState('all');
  const [conversionFilter, setConversionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editForm, setEditForm] = useState<LeadMeta>({ status: 'New', notes: '', joined_group: false, converted: false, revenue: 0 });
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem('webinar_admin_authed') === '1') setAuthed(true);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('webinar_admin_authed', '1');
      setAuthed(true); setLoginError('');
    } else setLoginError('Incorrect password.');
  }

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    fetch('/api/seo-webinar/registrations')
      .then(r => r.json())
      .then(d => { setLeads(d.leads || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [authed]);

  function parsePainPoint(rawStr: string) {
    const parts = (rawStr || '').split(' ||| ');
    const pain_point = parts[0] || '';
    let meta: LeadMeta = { status: 'New', notes: '', joined_group: false, converted: false, revenue: 0 };
    if (parts[1]) { try { meta = { ...meta, ...JSON.parse(parts[1]) }; } catch (e) {} }
    return { pain_point, meta };
  }

  function handleExpandRow(leadId: string, rawPainPoint: string) {
    if (expanded === leadId) { setExpanded(null); return; }
    setExpanded(leadId);
    setEditForm(parsePainPoint(rawPainPoint).meta);
  }

  async function handleSaveChanges(leadId: string, rawStr: string) {
    setSavingId(leadId);
    const { pain_point: clean } = parsePainPoint(rawStr);
    try {
      const res = await fetch('/api/seo-webinar/registrations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, pain_point: clean + ' ||| ' + JSON.stringify(editForm) }),
      });
      if (!res.ok) throw new Error();
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, pain_point: clean + ' ||| ' + JSON.stringify(editForm) } : l));
      toast.success('Saved!');
    } catch { toast.error('Failed to save.'); }
    finally { setSavingId(null); }
  }

  function exportCsv() {
    const header = 'Name,WhatsApp,Company,Website,Pain Point,Status,Notes,Joined Group,Converted,Revenue,Date\n';
    const rows = leads.map(l => {
      const { pain_point, meta } = parsePainPoint(l.pain_point);
      return `"${l.name}","${l.whatsapp}","${l.company}","${l.website || ''}","${pain_point.replace(/"/g, '""')}","${meta.status}","${meta.notes.replace(/"/g, '""')}","${meta.joined_group ? 'Yes' : 'No'}","${meta.converted ? 'Yes' : 'No'}","${meta.revenue}","${new Date(l.created_at).toLocaleString('en-IN')}"`;
    }).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'webinar-leads.csv'; a.click();
  }

  const parsedLeads = leads.map(l => {
    const { pain_point: cleanPainPoint, meta } = parsePainPoint(l.pain_point);
    return { ...l, cleanPainPoint, meta };
  });

  const totalRevenue = parsedLeads.reduce((acc, l) => acc + (Number(l.meta.revenue) || 0), 0);
  const totalJoinedGroup = parsedLeads.filter(l => l.meta.joined_group).length;
  const totalConverted = parsedLeads.filter(l => l.meta.converted).length;
  const todayCount = leads.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length;

  const filtered = parsedLeads.filter(l => {
    const s = search.toLowerCase();
    const matchSearch = !s || l.name.toLowerCase().includes(s) || l.company.toLowerCase().includes(s) || l.whatsapp.includes(s) || l.cleanPainPoint.toLowerCase().includes(s);
    const matchGroup = groupFilter === 'all' || (groupFilter === 'joined' ? l.meta.joined_group : !l.meta.joined_group);
    const matchConv = conversionFilter === 'all' || (conversionFilter === 'converted' ? l.meta.converted : !l.meta.converted);
    const matchStatus = statusFilter === 'all' || l.meta.status === statusFilter;
    return matchSearch && matchGroup && matchConv && matchStatus;
  });

  /* ── LOGIN ── */
  if (!authed) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 w-full max-w-sm shadow-xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-100">
            <svg className="w-7 h-7 text-[#FF6B35]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Admin Panel</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">SEO Webinar Leads</p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl px-4 py-3 pr-12 text-sm outline-none focus:border-slate-400 font-bold"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showPassword
                ? <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                : <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              }
            </button>
          </div>
          {loginError && <p className="text-red-500 text-xs font-bold bg-red-50 border border-red-100 rounded-xl px-4 py-3">{loginError}</p>}
          <button type="submit" className="w-full bg-[#FF6B35] hover:bg-[#e5561f] text-white font-black text-sm py-3.5 rounded-xl transition-all">
            Login →
          </button>
        </form>
      </div>
    </div>
  );

  /* ── MAIN PANEL ── */
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* TOPBAR */}
      <div className="bg-slate-900 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-2.5">
          <svg className="w-5 h-5 text-[#FF6B35]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
          <span className="text-base font-black text-white">Webinar Leads</span>
          <span className="bg-[#FF6B35]/20 text-[#FF6B35] text-[10px] font-black px-2.5 py-1 rounded-full">{leads.length}</span>
        </div>
        <button onClick={exportCsv}
          className="bg-[#FF6B35] hover:bg-[#e5561f] text-white text-xs font-black px-4 py-2 rounded-xl transition-all flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span className="hidden sm:inline">Export CSV</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total Registrations', val: parsedLeads.length, color: 'text-blue-600', bg: 'bg-blue-50', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A9.342 9.342 0 0112.242 20c-1.077 0-2.115-.18-3.083-.512v-.111c0-1.08.277-2.099.765-2.991m7.318-3.938A8 8 0 1118 7.5a8 8 0 01-2.732 6.009M9 16.5A5.5 5.5 0 003.5 22h11a5.5 5.5 0 00-5.5-5.5z" /></svg> },
            { label: 'Today Signups', val: todayCount, color: 'text-cyan-600', bg: 'bg-cyan-50', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-9-6h.008v.008H12v-.008z" /></svg> },
            { label: 'Joined 1% Group', val: totalJoinedGroup, color: 'text-indigo-600', bg: 'bg-indigo-50', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.281m5.94 2.28m-2.28 5.941L15.3 11.7" /></svg> },
            { label: 'Revenue Earned', val: `₹${totalRevenue.toLocaleString('en-IN')}`, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.214.113a3.433 3.433 0 003.957-.495l.024-.025M16.5 12h-9" /></svg> },
          ].map(s => (
            <div key={s.label} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0 ${s.color}`}>{s.icon}</div>
              <div className="min-w-0">
                <div className="text-xl font-black text-slate-900 leading-tight">{s.val}</div>
                <div className="text-[10px] text-slate-400 font-bold leading-tight mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* SEARCH + FILTERS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
          <input
            type="text"
            placeholder="🔍  Search by name, company, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-300 font-semibold"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Status', value: statusFilter, setter: setStatusFilter, options: [['all','All Statuses'],['New','New'],['Hot','Hot 🔥'],['Warm','Warm'],['Cold','Cold'],['Archived','Archived']] },
              { label: '1% Group', value: groupFilter, setter: setGroupFilter, options: [['all','All'],['joined','Joined'],['not_joined','Not Joined']] },
              { label: 'Conversion', value: conversionFilter, setter: setConversionFilter, options: [['all','All'],['converted','Converted ✅'],['not_converted','Not Converted']] },
            ].map(f => (
              <div key={f.label}>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">{f.label}</label>
                <select value={f.value} onChange={e => f.setter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold outline-none cursor-pointer">
                  {f.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* LEADS */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center text-slate-400 font-bold">Loading leads...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center text-slate-400 font-bold">No leads found.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((lead, i) => {
              const isExpanded = expanded === lead.id;
              return (
                <div key={lead.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

                  {/* Lead Card Row — click to expand */}
                  <div onClick={() => handleExpandRow(lead.id, lead.pain_point)}
                    className="flex items-start sm:items-center gap-3 p-4 cursor-pointer hover:bg-slate-50 transition-all">

                    {/* Number */}
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-black text-slate-400 flex-shrink-0 mt-0.5 sm:mt-0">
                      {i + 1}
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-sm font-black text-slate-900">{lead.name}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${STATUS_COLORS[lead.meta.status] || STATUS_COLORS.New}`}>
                          {lead.meta.status}
                        </span>
                        {lead.meta.joined_group && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">Group ✓</span>
                        )}
                        {lead.meta.converted && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">Paid ✓</span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="text-xs text-slate-500 font-semibold">{lead.company}</span>
                        <a href={`https://wa.me/91${lead.whatsapp}`} target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="text-xs text-emerald-500 hover:text-emerald-600 font-bold flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.864.001-2.63-1.023-5.101-2.885-6.963C16.486 1.96 14.026 1.932 12.006 1.932c-5.44 0-9.865 4.42-9.867 9.864-.001 1.77.464 3.5 1.348 5.03l-.974 3.559 3.634-.931z" /></svg>
                          {lead.whatsapp}
                        </a>
                      </div>
                    </div>

                    {/* Right meta */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {lead.meta.revenue > 0 && (
                        <span className="text-xs font-black text-emerald-600">₹{lead.meta.revenue.toLocaleString('en-IN')}</span>
                      )}
                      <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">
                        {new Date(lead.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </span>
                      <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>

                  {/* Expanded Panel */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50/60 p-4 space-y-4">

                      {/* Website */}
                      {lead.website && (
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Website</p>
                          <a href={lead.website} target="_blank" rel="noopener noreferrer"
                            className="text-sm font-bold text-blue-500 hover:text-blue-600 hover:underline break-all">
                            {lead.website}
                          </a>
                        </div>
                      )}

                      {/* Pain point */}
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Their Lead Generation Problem</p>
                        <p className="text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl p-3.5 leading-relaxed">
                          {lead.cleanPainPoint || '—'}
                        </p>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Admin Notes</label>
                        <textarea rows={2} placeholder="Write notes here..."
                          value={editForm.notes}
                          onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
                          className="w-full bg-white border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl p-3.5 text-sm font-semibold outline-none focus:border-slate-300 resize-none"
                        />
                      </div>

                      {/* Meta grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: 'Status', key: 'status', type: 'select', options: ['New','Hot','Warm','Cold','Archived'] },
                          { label: 'Joined 1% Group', key: 'joined_group', type: 'bool' },
                          { label: 'Converted Paid', key: 'converted', type: 'bool' },
                          { label: 'Revenue (₹)', key: 'revenue', type: 'number' },
                        ].map(field => (
                          <div key={field.key}>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">{field.label}</label>
                            {field.type === 'select' ? (
                              <select value={(editForm as any)[field.key]}
                                onChange={e => setEditForm(f => ({ ...f, [field.key]: e.target.value }))}
                                className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-sm font-bold outline-none cursor-pointer">
                                {field.options!.map(o => <option key={o} value={o}>{o}</option>)}
                              </select>
                            ) : field.type === 'bool' ? (
                              <select value={(editForm as any)[field.key] ? 'yes' : 'no'}
                                onChange={e => setEditForm(f => ({ ...f, [field.key]: e.target.value === 'yes' }))}
                                className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-sm font-bold outline-none cursor-pointer">
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                              </select>
                            ) : (
                              <input type="number" placeholder="0"
                                disabled={!editForm.converted}
                                value={editForm.converted ? editForm.revenue : ''}
                                onChange={e => setEditForm(f => ({ ...f, revenue: Number(e.target.value) || 0 }))}
                                className="w-full bg-white border border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 text-slate-800 rounded-xl px-3 py-2.5 text-sm font-bold outline-none"
                              />
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end pt-1">
                        <button onClick={() => handleSaveChanges(lead.id, lead.pain_point)}
                          disabled={savingId === lead.id}
                          className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-black text-sm px-6 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2">
                          {savingId === lead.id ? (
                            <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Saving...</>
                          ) : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
