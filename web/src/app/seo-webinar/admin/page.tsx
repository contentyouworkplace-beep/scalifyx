'use client';

import { useState, useEffect } from 'react';

const ADMIN_PASSWORD = 'Webinar@2026';

type Lead = {
  id: string;
  name: string;
  whatsapp: string;
  company: string;
  pain_point: string;
  created_at: string;
};

export default function WebinarAdmin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) { setAuthed(true); setError(''); }
    else setError('Incorrect password.');
  }

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    fetch('/api/seo-webinar/registrations')
      .then(r => r.json())
      .then(d => { setLeads(d.leads || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [authed]);

  function exportCsv() {
    const header = 'Name,WhatsApp,Company,Pain Point,Date\n';
    const rows = leads.map(l =>
      `"${l.name}","${l.whatsapp}","${l.company}","${l.pain_point.replace(/"/g, '""')}","${new Date(l.created_at).toLocaleString('en-IN')}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'webinar-leads.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.company.toLowerCase().includes(search.toLowerCase()) ||
    l.whatsapp.includes(search)
  );

  const s: Record<string, React.CSSProperties> = {
    page: { minHeight: '100vh', background: '#f0f5f2', fontFamily: "'Plus Jakarta Sans','Poppins',system-ui,sans-serif", color: '#1C1C1C' },
    topbar: { background: '#0D4A35', padding: '0 28px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    container: { maxWidth: 1100, margin: '0 auto', padding: '32px 20px' },
    card: { background: '#fff', borderRadius: 16, border: '1px solid #e2ede8', overflow: 'hidden', boxShadow: '0 2px 12px rgba(13,74,53,0.06)' },
    th: { padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#5a6a62', textTransform: 'uppercase' as const, letterSpacing: '0.06em', textAlign: 'left' as const, background: '#f7faf9', borderBottom: '1px solid #e2ede8' },
    td: { padding: '14px 16px', fontSize: 14, borderBottom: '1px solid #f0f5f2', verticalAlign: 'top' as const },
  };

  if (!authed) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0D4A35, #0a3828)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Plus Jakarta Sans','Poppins',system-ui,sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
      <div style={{ background: '#fff', borderRadius: 24, padding: '44px 40px', width: '100%', maxWidth: 400, boxShadow: '0 32px 80px rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔐</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0D4A35' }}>Admin Panel</h1>
          <p style={{ color: '#5a6a62', fontSize: 14, marginTop: 6 }}>SEO Webinar · Leads Dashboard</p>
        </div>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#0D4A35', marginBottom: 6 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter admin password" style={{ width: '100%', padding: '13px 16px', border: '1.5px solid #d0ddd8', borderRadius: 12, fontSize: 15, fontFamily: 'inherit', outline: 'none' }} />
          </div>
          {error && <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 12, background: '#fef0ef', borderRadius: 8, padding: '8px 12px' }}>{error}</p>}
          <button type="submit" style={{ width: '100%', background: '#FF6B35', color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Login →
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } tr:hover td { background: #f7faf9; }`}</style>

      <div style={s.topbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>📊 Webinar Leads</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ background: 'rgba(255,107,53,0.2)', color: '#FF6B35', borderRadius: 50, padding: '4px 14px', fontSize: 13, fontWeight: 700 }}>
            {leads.length} Registrations
          </span>
          <button onClick={exportCsv} style={{ background: '#FF6B35', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            ↓ Export CSV
          </button>
        </div>
      </div>

      <div style={s.container}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total Registrations', val: leads.length, icon: '👥' },
            { label: 'Today', val: leads.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length, icon: '📅' },
            { label: 'This Week', val: leads.filter(l => Date.now() - new Date(l.created_at).getTime() < 7 * 86400000).length, icon: '📈' },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2ede8', padding: '20px 22px' }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{stat.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#0D4A35' }}>{stat.val}</div>
              <div style={{ fontSize: 13, color: '#5a6a62', fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ marginBottom: 16 }}>
          <input type="text" placeholder="Search by name, company or number..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 380, padding: '11px 16px', border: '1.5px solid #d0ddd8', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', width: '100%' }} />
        </div>

        <div style={s.card}>
          {loading ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#5a6a62' }}>Loading leads...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#5a6a62' }}>No registrations yet.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={s.th}>#</th>
                  <th style={s.th}>Name</th>
                  <th style={s.th}>WhatsApp</th>
                  <th style={s.th}>Company</th>
                  <th style={s.th}>Pain Point</th>
                  <th style={s.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, i) => (
                  <>
                    <tr key={lead.id} style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}>
                      <td style={{ ...s.td, color: '#5a6a62', fontWeight: 600 }}>{i + 1}</td>
                      <td style={{ ...s.td, fontWeight: 700, color: '#0D4A35' }}>{lead.name}</td>
                      <td style={s.td}>
                        <a href={`https://wa.me/91${lead.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', fontWeight: 600, textDecoration: 'none' }} onClick={e => e.stopPropagation()}>
                          📱 {lead.whatsapp}
                        </a>
                      </td>
                      <td style={s.td}>{lead.company}</td>
                      <td style={{ ...s.td, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#5a6a62' }}>
                        {lead.pain_point}
                      </td>
                      <td style={{ ...s.td, color: '#5a6a62', fontSize: 12, whiteSpace: 'nowrap' }}>
                        {new Date(lead.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                    {expanded === lead.id && (
                      <tr key={`${lead.id}-exp`}>
                        <td colSpan={6} style={{ padding: '16px 20px', background: '#f0faf5', borderBottom: '1px solid #e2ede8' }}>
                          <strong style={{ color: '#0D4A35', fontSize: 13 }}>Pain Point:</strong>
                          <p style={{ fontSize: 14, color: '#1C1C1C', marginTop: 4, lineHeight: 1.6 }}>{lead.pain_point}</p>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
