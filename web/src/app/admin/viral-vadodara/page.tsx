'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface Lead {
  id: string;
  person_name: string;
  company_name: string;
  whatsapp: string;
  website: string | null;
  created_at: string;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function ViralVadodaraAdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('viral_vadodara_leads')
      .select('*')
      .order('created_at', { ascending: false });
    setLeads(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const filtered = leads.filter(l =>
    l.person_name.toLowerCase().includes(search.toLowerCase()) ||
    l.company_name.toLowerCase().includes(search.toLowerCase()) ||
    l.whatsapp.includes(search)
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">Viral Vadodara Leads</h1>
        <p className="text-zinc-400 text-sm">Free influencer video campaign submissions</p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-surface border border-border rounded-xl px-5 py-3 flex items-center gap-3">
          <span className="text-2xl font-extrabold text-white">{leads.length}</span>
          <span className="text-sm text-zinc-400">Total Leads</span>
        </div>
        <div className="bg-surface border border-border rounded-xl px-5 py-3 flex items-center gap-3">
          <span className="text-2xl font-extrabold text-primary">{500 - leads.length}</span>
          <span className="text-sm text-zinc-400">Spots Remaining</span>
        </div>
      </div>

      {/* Search + Refresh */}
      <div className="flex items-center gap-3 mb-5">
        <input
          type="text"
          placeholder="Search by name, shop or number..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary/60"
        />
        <button
          onClick={fetchLeads}
          className="bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-zinc-400 hover:text-white transition"
        >
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 text-sm">
            {search ? 'No results match your search.' : 'No leads yet.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-zinc-500 text-xs font-bold uppercase tracking-wide">
                  <th className="text-left px-5 py-3">#</th>
                  <th className="text-left px-5 py-3">Person</th>
                  <th className="text-left px-5 py-3">Shop / Company</th>
                  <th className="text-left px-5 py-3">WhatsApp</th>
                  <th className="text-left px-5 py-3">Website</th>
                  <th className="text-left px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, i) => (
                  <tr key={lead.id} className="border-b border-border last:border-0 hover:bg-zinc-800/40 transition">
                    <td className="px-5 py-3 text-zinc-500">{i + 1}</td>
                    <td className="px-5 py-3 font-semibold text-white">{lead.person_name}</td>
                    <td className="px-5 py-3 text-zinc-300">{lead.company_name}</td>
                    <td className="px-5 py-3">
                      <a
                        href={`https://wa.me/91${lead.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium"
                      >
                        {lead.whatsapp}
                      </a>
                    </td>
                    <td className="px-5 py-3">
                      {lead.website ? (
                        <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition truncate max-w-[140px] block">
                          {lead.website}
                        </a>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-zinc-500 whitespace-nowrap">{fmtDate(lead.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
