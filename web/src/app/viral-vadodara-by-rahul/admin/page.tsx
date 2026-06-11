'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function ViralVadodaraAdminPage() {
  const { user, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isLoading) {
      if (!user) router.replace('/login');
      else if (!isAdmin) router.replace('/dashboard');
    }
  }, [user, isLoading, isAdmin, router]);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('viral_vadodara_leads')
      .select('*')
      .order('created_at', { ascending: false });
    setLeads(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { if (user && isAdmin) fetchLeads(); }, [user, isAdmin, fetchLeads]);

  if (isLoading || !user || !isAdmin) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #10B981', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const filtered = leads.filter(l =>
    l.person_name.toLowerCase().includes(search.toLowerCase()) ||
    l.company_name.toLowerCase().includes(search.toLowerCase()) ||
    l.whatsapp.includes(search)
  );

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", minHeight: '100vh', background: '#0A0A0F', color: '#fff', padding: '0 0 40px' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #F97316 100%)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#FACC15', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>Admin Panel</div>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: 0 }}>🎬 Viral Vadodara Leads</h1>
        </div>
        <Link href="/viral-vadodara-by-rahul" style={{ background: '#FACC15', color: '#1A1A2E', fontWeight: 700, fontSize: 12, padding: '8px 16px', borderRadius: 10, textDecoration: 'none' }}>
          ← View Landing Page
        </Link>
      </div>

      <div style={{ padding: '24px 20px', maxWidth: 900, margin: '0 auto' }}>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ background: '#141419', border: '1px solid #27272A', borderRadius: 14, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: '#fff' }}>{leads.length}</span>
            <span style={{ fontSize: 13, color: '#71717A' }}>Total Leads</span>
          </div>
          <div style={{ background: '#141419', border: '1px solid #27272A', borderRadius: 14, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: '#10B981' }}>{500 - leads.length}</span>
            <span style={{ fontSize: 13, color: '#71717A' }}>Spots Remaining</span>
          </div>
          <div style={{ background: '#141419', border: '1px solid #27272A', borderRadius: 14, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: '#F97316' }}>{Math.round((leads.length / 500) * 100)}%</span>
            <span style={{ fontSize: 13, color: '#71717A' }}>Filled</span>
          </div>
        </div>

        {/* Search + Refresh */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Search by name, shop or number..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, background: '#141419', border: '1px solid #27272A', borderRadius: 12, padding: '10px 16px', fontSize: 13, color: '#fff', fontFamily: 'inherit', outline: 'none' }}
          />
          <button
            onClick={fetchLeads}
            style={{ background: '#141419', border: '1px solid #27272A', borderRadius: 12, padding: '10px 16px', fontSize: 13, color: '#71717A', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Refresh
          </button>
        </div>

        {/* Table */}
        <div style={{ background: '#141419', border: '1px solid #27272A', borderRadius: 16, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
              <div style={{ width: 28, height: 28, border: '3px solid #10B981', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#71717A', fontSize: 14 }}>
              {search ? 'No results match your search.' : 'No leads yet.'}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #27272A' }}>
                    {['#', 'Person', 'Shop / Company', 'WhatsApp', 'Website', 'Date'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#71717A', textTransform: 'uppercase', letterSpacing: 1, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead, i) => (
                    <tr key={lead.id} style={{ borderBottom: '1px solid #27272A' }}>
                      <td style={{ padding: '14px 16px', color: '#71717A' }}>{i + 1}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 600, color: '#fff' }}>{lead.person_name}</td>
                      <td style={{ padding: '14px 16px', color: '#D4D4D8' }}>{lead.company_name}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <a
                          href={`https://wa.me/91${lead.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#10B981', fontWeight: 600, textDecoration: 'none' }}
                        >
                          {lead.whatsapp}
                        </a>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {lead.website ? (
                          <a
                            href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#71717A', textDecoration: 'none', maxWidth: 140, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                          >
                            {lead.website}
                          </a>
                        ) : (
                          <span style={{ color: '#3F3F46' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#71717A', whiteSpace: 'nowrap' }}>{fmtDate(lead.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
