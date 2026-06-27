'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const ADMIN_PASSWORD = 'Webinar@2026';

type Lead = {
  id: string;
  name: string;
  whatsapp: string;
  company: string;
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

export default function WebinarAdmin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  
  // Filters
  const [groupFilter, setGroupFilter] = useState('all'); // all, joined, not_joined
  const [conversionFilter, setConversionFilter] = useState('all'); // all, converted, not_converted
  const [statusFilter, setStatusFilter] = useState('all'); // all, New, Hot, Warm, Cold, Archived

  // Edit State
  const [editForm, setEditForm] = useState<LeadMeta>({
    status: 'New',
    notes: '',
    joined_group: false,
    converted: false,
    revenue: 0
  });
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem('webinar_admin_authed') === '1') setAuthed(true);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('webinar_admin_authed', '1');
      setAuthed(true); setError('');
    } else setError('Incorrect password.');
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
    let meta: LeadMeta = {
      status: 'New',
      notes: '',
      joined_group: false,
      converted: false,
      revenue: 0
    };
    if (parts[1]) {
      try {
        meta = { ...meta, ...JSON.parse(parts[1]) };
      } catch (e) {}
    }
    return { pain_point, meta };
  }

  // Populate edit form on expand
  function handleExpandRow(leadId: string, rawPainPoint: string) {
    if (expanded === leadId) {
      setExpanded(null);
    } else {
      setExpanded(leadId);
      const { meta } = parsePainPoint(rawPainPoint);
      setEditForm(meta);
    }
  }

  async function handleSaveChanges(leadId: string, rawStr: string) {
    setSavingId(leadId);
    const { pain_point: cleanPainPoint } = parsePainPoint(rawStr);
    const newPainPoint = cleanPainPoint + ' ||| ' + JSON.stringify(editForm);
    
    try {
      const res = await fetch('/api/seo-webinar/registrations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, pain_point: newPainPoint }),
      });
      if (!res.ok) throw new Error('Failed to update lead');
      
      // Update local state
      setLeads(prevLeads => prevLeads.map(l => {
        if (l.id === leadId) {
          return { ...l, pain_point: newPainPoint };
        }
        return l;
      }));
      
      toast.success('Changes saved successfully!');
    } catch (e) {
      toast.error('Failed to save changes.');
    } finally {
      setSavingId(null);
    }
  }

  function exportCsv() {
    const header = 'Name,WhatsApp,Company,Pain Point,Status,Notes,Joined Group,Converted,Revenue,Date\n';
    const rows = leads.map(l => {
      const { pain_point, meta } = parsePainPoint(l.pain_point);
      return `"${l.name}","${l.whatsapp}","${l.company}","${pain_point.replace(/"/g, '""')}","${meta.status}","${meta.notes.replace(/"/g, '""')}","${meta.joined_group ? 'Yes' : 'No'}","${meta.converted ? 'Yes' : 'No'}","${meta.revenue}","${new Date(l.created_at).toLocaleString('en-IN')}"`;
    }).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'webinar-leads.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  // Parse all leads
  const parsedLeads = leads.map(l => {
    const { pain_point: cleanPainPoint, meta } = parsePainPoint(l.pain_point);
    return { ...l, cleanPainPoint, meta };
  });

  // Calculate statistics
  const totalRegistrations = parsedLeads.length;
  const totalConverted = parsedLeads.filter(l => l.meta.converted).length;
  const totalRevenue = parsedLeads.reduce((acc, l) => acc + (Number(l.meta.revenue) || 0), 0);
  const totalJoinedGroup = parsedLeads.filter(l => l.meta.joined_group).length;

  // Filter leads
  const filtered = parsedLeads.filter(l => {
    // Search text filter
    const matchesSearch = 
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase()) ||
      l.whatsapp.includes(search) ||
      l.cleanPainPoint.toLowerCase().includes(search.toLowerCase()) ||
      l.meta.notes.toLowerCase().includes(search.toLowerCase());

    // Group filter
    let matchesGroup = true;
    if (groupFilter === 'joined') matchesGroup = l.meta.joined_group === true;
    else if (groupFilter === 'not_joined') matchesGroup = l.meta.joined_group === false;

    // Conversion filter
    let matchesConversion = true;
    if (conversionFilter === 'converted') matchesConversion = l.meta.converted === true;
    else if (conversionFilter === 'not_converted') matchesConversion = l.meta.converted === false;

    // Status filter
    let matchesStatus = true;
    if (statusFilter !== 'all') matchesStatus = l.meta.status === statusFilter;

    return matchesSearch && matchesGroup && matchesConversion && matchesStatus;
  });

  // SVG Icons
  const GrowthIcon = (
    <svg className="w-12 h-12 text-[#FF6B35] mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.281m5.94 2.28m-2.28 5.941L15.3 11.7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19.5h12.75" />
    </svg>
  );

  const EyeIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const EyeSlashIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );

  const DashboardIcon = (
    <svg className="w-5 h-5 text-slate-800" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  );

  const UsersIcon = (
    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A9.342 9.342 0 0112.242 20c-1.077 0-2.115-.18-3.083-.512v-.111c0-1.08.277-2.099.765-2.991m7.318-3.938A8 8 0 1118 7.5a8 8 0 01-2.732 6.009M9 16.5A5.5 5.5 0 003.5 22h11a5.5 5.5 0 00-5.5-5.5zm0 0a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" />
    </svg>
  );

  const CalendarIcon = (
    <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008z" />
    </svg>
  );

  const ChartIcon = (
    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.281m5.94 2.28m-2.28 5.941L15.3 11.7" />
    </svg>
  );

  const RupeeIcon = (
    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.214.113a3.433 3.433 0 003.957-.495l.024-.025M16.5 12h-9" />
    </svg>
  );

  const WhatsAppIcon = (
    <svg className="w-4 h-4 text-emerald-500 inline-block mr-1.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.864.001-2.63-1.023-5.101-2.885-6.963C16.486 1.96 14.026 1.932 12.006 1.932c-5.44 0-9.865 4.42-9.867 9.864-.001 1.77.464 3.5 1.348 5.03l-.974 3.559 3.634-.931z" />
    </svg>
  );

  if (!authed) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
      <div className="bg-white border border-slate-200 rounded-3xl p-10 w-full max-w-sm shadow-xl shadow-slate-100 text-slate-800">
        <div className="text-center mb-8">
          {GrowthIcon}
          <h1 className="text-2xl font-black text-slate-900">Admin Panel</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1.5">SEO Webinar Leads</p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl px-4 py-3 pr-12 text-sm focus:border-slate-400 outline-none transition-all duration-200 font-bold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? EyeSlashIcon : EyeIcon}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-xs font-bold bg-red-50 border border-red-100 rounded-xl px-4.5 py-3">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-[#FF6B35] hover:bg-[#e5561f] text-white font-black text-sm py-3.5 rounded-xl cursor-pointer shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all duration-200"
          >
            Login →
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#FF6B35] selection:text-white">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .table-row:hover td { background-color: #f8fafc; }
      `}</style>

      {/* TOPBAR */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 sm:px-8 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          {DashboardIcon}
          <span className="text-lg font-black text-white tracking-tight">Webinar Leads</span>
        </div>
        <div className="flex gap-3 items-center">
          <span className="bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/20 rounded-full px-4 py-1.5 text-xs font-black tracking-wide">
            {leads.length} Registrations
          </span>
          <button
            onClick={exportCsv}
            className="bg-[#FF6B35] hover:bg-[#e5561f] text-white border-none rounded-xl px-5 py-2 text-xs font-black cursor-pointer shadow-md shadow-orange-500/15 transition-all duration-200"
          >
            ↓ Export CSV
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        
        {/* STATS PANEL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Registrations', val: totalRegistrations, icon: UsersIcon },
            { label: 'Today Signup', val: leads.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length, icon: CalendarIcon },
            { label: 'Joined 1% Group', val: totalJoinedGroup, icon: ChartIcon },
            { label: 'Revenue Earned', val: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: RupeeIcon },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 p-6 flex items-start gap-4 shadow-sm shadow-slate-100/50">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 leading-tight">{stat.val}</div>
                <div className="text-xs text-slate-400 font-bold tracking-wide mt-1">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CONTROLS (SEARCH & FILTERS) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
          
          {/* Search box */}
          <div className="relative w-full md:max-w-xs">
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-slate-300 transition-all duration-200"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            
            {/* Status Filter */}
            <div className="flex flex-col gap-1 w-full sm:w-auto">
              <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Status</label>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="New">New</option>
                <option value="Hot">Hot</option>
                <option value="Warm">Warm</option>
                <option value="Cold">Cold</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            {/* WhatsApp Group Filter */}
            <div className="flex flex-col gap-1 w-full sm:w-auto">
              <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">1% Group</label>
              <select
                value={groupFilter}
                onChange={e => setGroupFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer"
              >
                <option value="all">All Group Join Status</option>
                <option value="joined">Joined Group</option>
                <option value="not_joined">Not Joined Group</option>
              </select>
            </div>

            {/* Conversion Filter */}
            <div className="flex flex-col gap-1 w-full sm:w-auto">
              <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Paid Conversion</label>
              <select
                value={conversionFilter}
                onChange={e => setConversionFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer"
              >
                <option value="all">All Conversions</option>
                <option value="converted">Converted (Paid)</option>
                <option value="not_converted">Not Converted</option>
              </select>
            </div>

          </div>
        </div>

        {/* LEADS LIST CARD */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-24 text-center text-slate-400 font-bold text-sm">Loading leads...</div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center text-slate-400 font-bold text-sm">No registrations found matching search filters.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">#</th>
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Name</th>
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">WhatsApp</th>
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Company</th>
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Status</th>
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Group</th>
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Converted</th>
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Revenue</th>
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead, i) => {
                    const isExpanded = expanded === lead.id;
                    const statusColorMap: Record<string, string> = {
                      New: 'bg-blue-50 text-blue-600 border border-blue-100',
                      Hot: 'bg-red-50 text-red-600 border border-red-100',
                      Warm: 'bg-orange-50 text-orange-600 border border-orange-100',
                      Cold: 'bg-slate-100 text-slate-600 border border-slate-200',
                      Archived: 'bg-slate-50 text-slate-400 border border-slate-100'
                    };
                    
                    return (
                      <>
                        {/* Table Main Row */}
                        <tr
                          key={lead.id}
                          onClick={() => handleExpandRow(lead.id, lead.pain_point)}
                          className="table-row border-b border-slate-100 cursor-pointer transition-all duration-150"
                        >
                          <td className="px-6 py-4.5 text-xs text-slate-400 font-bold">{i + 1}</td>
                          <td className="px-6 py-4.5 text-sm text-slate-900 font-black">{lead.name}</td>
                          <td className="px-6 py-4.5 text-xs">
                            <a
                              href={`https://wa.me/91${lead.whatsapp}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-500 hover:text-emerald-600 font-bold inline-flex items-center"
                              onClick={e => e.stopPropagation()}
                            >
                              {WhatsAppIcon}
                              {lead.whatsapp}
                            </a>
                          </td>
                          <td className="px-6 py-4.5 text-sm text-slate-600 font-semibold">{lead.company}</td>
                          <td className="px-6 py-4.5">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${statusColorMap[lead.meta.status] || statusColorMap.New}`}>
                              {lead.meta.status}
                            </span>
                          </td>
                          <td className="px-6 py-4.5">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${lead.meta.joined_group ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400'}`}>
                              {lead.meta.joined_group ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td className="px-6 py-4.5">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${lead.meta.converted ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-100 text-slate-400'}`}>
                              {lead.meta.converted ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td className="px-6 py-4.5 text-sm text-slate-900 font-black">
                            {lead.meta.revenue > 0 ? `₹${lead.meta.revenue.toLocaleString('en-IN')}` : '—'}
                          </td>
                          <td className="px-6 py-4.5 text-xs text-slate-400 font-bold whitespace-nowrap">
                            {new Date(lead.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                        </tr>

                        {/* Expanded Detail Panel */}
                        {isExpanded && (
                          <tr key={`${lead.id}-exp`}>
                            <td colSpan={9} className="px-8 py-6 bg-slate-50/50 border-b border-slate-100">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                
                                {/* Left Side: Original details & Notes */}
                                <div className="flex flex-col gap-4">
                                  <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">User Pain Point:</span>
                                    <p className="text-sm font-semibold text-slate-800 leading-relaxed bg-white border border-slate-200 rounded-xl p-4 shadow-inner">
                                      {lead.cleanPainPoint || 'No pain point specified.'}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Lead Notes:</label>
                                    <textarea
                                      rows={3}
                                      placeholder="Write admin notes here..."
                                      value={editForm.notes}
                                      onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
                                      className="w-full bg-white border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl p-4 text-xs font-semibold outline-none focus:border-slate-300 resize-y shadow-inner"
                                    />
                                  </div>
                                </div>

                                {/* Right Side: Status Updates & Conversion Fields */}
                                <div className="flex flex-col gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 mb-2">Update Lead Metadata</h4>
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    {/* Lead Status */}
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Status</label>
                                      <select
                                        value={editForm.status}
                                        onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                                        className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-xs font-bold outline-none cursor-pointer"
                                      >
                                        <option value="New">New</option>
                                        <option value="Hot">Hot</option>
                                        <option value="Warm">Warm</option>
                                        <option value="Cold">Cold</option>
                                        <option value="Archived">Archived</option>
                                      </select>
                                    </div>

                                    {/* Joined WhatsApp Group */}
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Joined 1% Group</label>
                                      <select
                                        value={editForm.joined_group ? 'yes' : 'no'}
                                        onChange={e => setEditForm(f => ({ ...f, joined_group: e.target.value === 'yes' }))}
                                        className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-xs font-bold outline-none cursor-pointer"
                                      >
                                        <option value="no">No</option>
                                        <option value="yes">Yes</option>
                                      </select>
                                    </div>

                                    {/* Converted Paid */}
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Converted Paid</label>
                                      <select
                                        value={editForm.converted ? 'yes' : 'no'}
                                        onChange={e => setEditForm(f => ({ ...f, converted: e.target.value === 'yes' }))}
                                        className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-xs font-bold outline-none cursor-pointer"
                                      >
                                        <option value="no">No</option>
                                        <option value="yes">Yes</option>
                                      </select>
                                    </div>

                                    {/* Revenue Input */}
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Revenue (₹)</label>
                                      <input
                                        type="number"
                                        disabled={!editForm.converted}
                                        placeholder="0"
                                        value={editForm.converted ? editForm.revenue : ''}
                                        onChange={e => setEditForm(f => ({ ...f, revenue: Number(e.target.value) || 0 }))}
                                        className="bg-slate-50 border border-slate-200 text-slate-800 disabled:text-slate-400 disabled:bg-slate-100 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                                      />
                                    </div>
                                  </div>

                                  <div className="flex gap-3 justify-end mt-4 pt-3 border-t border-slate-100">
                                    <button
                                      type="button"
                                      disabled={savingId === lead.id}
                                      onClick={() => handleSaveChanges(lead.id, lead.pain_point)}
                                      className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-black text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-2"
                                    >
                                      {savingId === lead.id ? 'Saving...' : 'Save Changes'}
                                    </button>
                                  </div>
                                </div>

                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
