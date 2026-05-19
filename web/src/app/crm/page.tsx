'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../lib/api';

interface Client { id: string; name: string; created_at: string }
interface Work { id: string; client_id: string; title: string; deadline: string | null; done: boolean }
interface Task { id: string; work_id: string; title: string; done: boolean; created_at: string }
interface DashWork extends Work { crm_clients: { name: string } | null }

function fmtDeadline(d: string | null) {
  if (!d) return null;
  const date = new Date(d);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((date.getTime() - today.getTime()) / 86400000);
  const dateLabel = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const timeLabel = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0;
  return { dateLabel, timeLabel, hasTime, diff };
}

function DeadlineBadge({ deadline }: { deadline: string | null }) {
  const d = fmtDeadline(deadline);
  if (!d) return null;
  const color = d.diff < 0 ? '#EF4444' : d.diff <= 1 ? '#F59E0B' : d.diff <= 4 ? '#6366F1' : '#10B981';
  const urgency = d.diff < 0 ? `${Math.abs(d.diff)}d overdue` : d.diff === 0 ? 'Today' : d.diff === 1 ? 'Tomorrow' : `${d.diff}d left`;
  return (
    <div className="flex flex-col items-end gap-0.5">
      <span className="text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
        style={{ background: color + '20', color, border: `1px solid ${color}40` }}>
        {urgency}
      </span>
      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        {d.dateLabel}{d.hasTime ? ` · ${d.timeLabel}` : ''}
      </span>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ refreshKey }: { refreshKey: number }) {
  const [urgent, setUrgent] = useState<DashWork[]>([]);
  const [stressFree, setStressFree] = useState<DashWork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetch('/crm/dashboard')
      .then(d => { setUrgent(d.urgent); setStressFree(d.stressFree); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const DashCard = ({ w, rank, accent }: { w: DashWork; rank: number; accent: string }) => {
    const d = fmtDeadline(w.deadline);
    return (
      <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: 'var(--card)' }}>
        <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ background: accent + '20', color: accent }}>
          {rank}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{w.title}</p>
          <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>{w.crm_clients?.name || '—'}</p>
        </div>
        {d && (
          <span className="text-xs font-medium whitespace-nowrap" style={{ color: d.diff < 0 ? '#EF4444' : d.diff <= 1 ? '#F59E0B' : 'var(--text-secondary)' }}>
            {d.diff < 0 ? `${Math.abs(d.diff)}d late` : d.diff === 0 ? 'Today' : `${d.diff}d`}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
      <div className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🔥</span>
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Do First</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Urgent · {urgent.length} works</p>
          </div>
        </div>
        {loading
          ? <div className="h-16 flex items-center justify-center"><div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--primary) transparent transparent transparent' }} /></div>
          : urgent.length === 0
            ? <p className="text-xs text-center py-4 rounded-xl" style={{ background: 'var(--card)', color: 'var(--text-secondary)' }}>All clear — you're ahead!</p>
            : <div className="flex flex-col gap-2">{urgent.map((w, i) => <DashCard key={w.id} w={w} rank={i + 1} accent="#EF4444" />)}</div>
        }
      </div>

      <div className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">😌</span>
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Do Later</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Stress Free · {stressFree.length} works</p>
          </div>
        </div>
        {loading
          ? <div className="h-16 flex items-center justify-center"><div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--primary) transparent transparent transparent' }} /></div>
          : stressFree.length === 0
            ? <p className="text-xs text-center py-4 rounded-xl" style={{ background: 'var(--card)', color: 'var(--text-secondary)' }}>Nothing else for now!</p>
            : <div className="flex flex-col gap-2">{stressFree.map((w, i) => <DashCard key={w.id} w={w} rank={i + 6} accent="#10B981" />)}</div>
        }
      </div>
    </div>
  );
}

// ── Task row ──────────────────────────────────────────────────────────────────
function TaskRow({ task, onToggle, onDelete }: {
  task: Task; onToggle: (id: string, done: boolean) => void; onDelete: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl group active:opacity-70"
      style={{ background: task.done ? 'transparent' : 'var(--surface)' }}>
      <button onClick={() => onToggle(task.id, !task.done)}
        className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
        style={{ background: task.done ? 'var(--primary)' : 'transparent', borderColor: task.done ? 'var(--primary)' : 'var(--border)' }}>
        {task.done && (
          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 10 8" stroke="white" strokeWidth="2">
            <path d="M1 4l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <span className="flex-1 text-sm" style={{ color: task.done ? 'var(--text-secondary)' : 'var(--text)', textDecoration: task.done ? 'line-through' : 'none' }}>
        {task.title}
      </span>
      <button onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center rounded-full"
        style={{ color: '#EF4444', background: '#EF444415' }}>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2">
          <path d="M2 2l8 8M10 2l-8 8" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

// ── Work accordion ────────────────────────────────────────────────────────────
function WorkCard({ work, onDelete, onToggleDone }: {
  work: Work; onDelete: (id: string) => void; onToggleDone: (id: string, done: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [adding, setAdding] = useState(false);

  const loadTasks = useCallback(async () => {
    if (loaded) return;
    const d = await apiFetch(`/crm/tasks?work_id=${work.id}`);
    setTasks(d.tasks);
    setLoaded(true);
  }, [work.id, loaded]);

  const toggle = () => { if (!open) loadTasks(); setOpen(v => !v); };

  const addTask = async () => {
    if (!newTask.trim()) return;
    setAdding(true);
    try {
      const d = await apiFetch('/crm/tasks', { method: 'POST', body: JSON.stringify({ work_id: work.id, title: newTask }) });
      setTasks(t => [...t, d.task]);
      setNewTask('');
    } finally { setAdding(false); }
  };

  const toggleTask = async (id: string, done: boolean) => {
    await apiFetch('/crm/tasks', { method: 'PATCH', body: JSON.stringify({ id, done }) });
    setTasks(t => t.map(x => x.id === id ? { ...x, done } : x));
  };

  const deleteTask = async (id: string) => {
    await apiFetch('/crm/tasks', { method: 'DELETE', body: JSON.stringify({ id }) });
    setTasks(t => t.filter(x => x.id !== id));
  };

  const done = work.done;
  const completedCount = tasks.filter(t => t.done).length;

  return (
    <div className="rounded-2xl overflow-hidden transition-opacity" style={{ background: 'var(--card)', border: '1px solid var(--border)', opacity: done ? 0.55 : 1 }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer select-none" onClick={toggle}>
        <button onClick={e => { e.stopPropagation(); onToggleDone(work.id, !done); }}
          className="w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
          style={{ background: done ? 'var(--primary)' : 'transparent', borderColor: done ? 'var(--primary)' : 'var(--border)' }}>
          {done && <svg className="w-3 h-3" fill="none" viewBox="0 0 10 8" stroke="white" strokeWidth="2"><path d="M1 4l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)', textDecoration: done ? 'line-through' : 'none' }}>
            {work.title}
          </p>
          {loaded && tasks.length > 0 && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {completedCount}/{tasks.length} tasks done
            </p>
          )}
        </div>

        <DeadlineBadge deadline={work.deadline} />

        <button onClick={e => { e.stopPropagation(); onDelete(work.id); }}
          className="w-7 h-7 flex items-center justify-center rounded-full flex-shrink-0 opacity-30 hover:opacity-100 transition-opacity"
          style={{ color: '#EF4444', background: '#EF444415' }}>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2">
            <path d="M2 2l8 8M10 2l-8 8" strokeLinecap="round" />
          </svg>
        </button>

        <svg className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
          style={{ color: 'var(--text-secondary)', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Tasks */}
      {open && (
        <div className="px-3 pb-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="mt-2 flex flex-col gap-1">
            {tasks.length === 0
              ? <p className="text-xs text-center py-3" style={{ color: 'var(--text-secondary)' }}>No tasks yet</p>
              : tasks.map(t => <TaskRow key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} />)
            }
          </div>
          <div className="flex gap-2 mt-2">
            <input
              className="flex-1 text-sm px-3 py-2.5 rounded-xl outline-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
              placeholder="New task..."
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask()}
            />
            <button onClick={addTask} disabled={adding || !newTask.trim()}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-40"
              style={{ background: 'var(--primary)', color: '#fff' }}>
              {adding ? '…' : 'Add'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Add Work form ─────────────────────────────────────────────────────────────
function AddWorkForm({ onAdd }: { onAdd: (title: string, deadline: string) => Promise<void> }) {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const submit = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try { await onAdd(title, deadline); setTitle(''); setDeadline(''); setOpen(false); }
    finally { setLoading(false); }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium transition-colors"
        style={{ border: '1.5px dashed var(--border)', color: 'var(--text-secondary)' }}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add Work
      </button>
    );
  }

  return (
    <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--primary)40' }}>
      <input
        autoFocus
        className="w-full text-sm px-0 py-1 outline-none bg-transparent font-medium mb-3"
        style={{ color: 'var(--text)', borderBottom: '1px solid var(--border)' }}
        placeholder="Work title..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && submit()}
      />
      <div className="mb-3">
        <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Deadline (date & time)</label>
        <input
          type="datetime-local"
          className="w-full text-sm px-3 py-2.5 rounded-xl outline-none"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <button onClick={() => setOpen(false)}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium"
          style={{ background: 'var(--surface)', color: 'var(--text-secondary)' }}>
          Cancel
        </button>
        <button onClick={submit} disabled={loading || !title.trim()}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-40"
          style={{ background: 'var(--primary)', color: '#fff' }}>
          {loading ? '…' : 'Save Work'}
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CrmPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selected, setSelected] = useState<Client | null>(null);
  const [works, setWorks] = useState<Work[]>([]);
  const [newClient, setNewClient] = useState('');
  const [addingClient, setAddingClient] = useState(false);
  const [loadingWorks, setLoadingWorks] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [dashKey, setDashKey] = useState(0);
  // On mobile: 'list' or 'detail'
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

  useEffect(() => {
    apiFetch('/crm/clients').then(d => {
      setClients(d.clients);
      if (d.clients.length > 0) setSelected(d.clients[0]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoadingWorks(true);
    apiFetch(`/crm/works?client_id=${selected.id}`)
      .then(d => setWorks(d.works))
      .catch(() => {})
      .finally(() => setLoadingWorks(false));
  }, [selected]);

  const selectClient = (c: Client) => { setSelected(c); setMobileView('detail'); };

  const addClient = async () => {
    if (!newClient.trim()) return;
    setAddingClient(true);
    try {
      const d = await apiFetch('/crm/clients', { method: 'POST', body: JSON.stringify({ name: newClient }) });
      setClients(c => [d.client, ...c]);
      setNewClient('');
      setShowClientForm(false);
      selectClient(d.client);
    } finally { setAddingClient(false); }
  };

  const deleteClient = async (id: string) => {
    await apiFetch('/crm/clients', { method: 'DELETE', body: JSON.stringify({ id }) });
    const updated = clients.filter(c => c.id !== id);
    setClients(updated);
    if (selected?.id === id) { setSelected(updated[0] || null); setMobileView('list'); }
  };

  const addWork = async (title: string, deadline: string) => {
    if (!selected) return;
    const d = await apiFetch('/crm/works', {
      method: 'POST',
      body: JSON.stringify({ client_id: selected.id, title, deadline: deadline || null }),
    });
    setWorks(w => [...w, d.work]);
    setDashKey(k => k + 1);
  };

  const deleteWork = async (id: string) => {
    await apiFetch('/crm/works', { method: 'DELETE', body: JSON.stringify({ id }) });
    setWorks(w => w.filter(x => x.id !== id));
    setDashKey(k => k + 1);
  };

  const toggleWorkDone = async (id: string, done: boolean) => {
    await apiFetch('/crm/works', { method: 'PATCH', body: JSON.stringify({ id, done }) });
    setWorks(w => w.map(x => x.id === id ? { ...x, done } : x));
    setDashKey(k => k + 1);
  };

  const pendingWorks = works.filter(w => !w.done);
  const doneWorks = works.filter(w => w.done);

  // ── Sidebar / client list ──────────────────────────────────────────────────
  const ClientList = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold tracking-widest" style={{ color: 'var(--text-secondary)' }}>CLIENTS</p>
        <button onClick={() => setShowClientForm(v => !v)}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
          style={{ background: showClientForm ? 'var(--primary)' : 'var(--border)', color: showClientForm ? '#fff' : 'var(--text)' }}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={showClientForm ? 'M6 18L18 6M6 6l12 12' : 'M12 4v16m8-8H4'} />
          </svg>
        </button>
      </div>

      {showClientForm && (
        <div className="mb-3 flex gap-2">
          <input autoFocus
            className="flex-1 text-sm px-3 py-2 rounded-xl outline-none"
            style={{ background: 'var(--card)', border: '1px solid var(--primary)60', color: 'var(--text)' }}
            placeholder="Client name..."
            value={newClient}
            onChange={e => setNewClient(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addClient()}
          />
          <button onClick={addClient} disabled={addingClient || !newClient.trim()}
            className="px-3 py-2 rounded-xl text-sm font-semibold disabled:opacity-40"
            style={{ background: 'var(--primary)', color: '#fff' }}>
            {addingClient ? '…' : 'Add'}
          </button>
        </div>
      )}

      <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
        {clients.length === 0 && (
          <p className="text-xs text-center py-6" style={{ color: 'var(--text-secondary)' }}>No clients yet</p>
        )}
        {clients.map(c => (
          <div key={c.id} className="flex items-center gap-1 group">
            <button onClick={() => selectClient(c)}
              className="flex-1 text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all truncate"
              style={{
                background: selected?.id === c.id ? 'var(--primary)' : 'transparent',
                color: selected?.id === c.id ? '#fff' : 'var(--text)',
              }}>
              {c.name}
            </button>
            <button onClick={() => deleteClient(c.id)}
              className="opacity-0 group-hover:opacity-70 hover:!opacity-100 w-7 h-7 flex items-center justify-center rounded-full flex-shrink-0 transition-opacity"
              style={{ color: '#EF4444' }}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2}>
                <path d="M2 2l8 8M10 2l-8 8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Work detail panel ──────────────────────────────────────────────────────
  const WorkDetail = () => (
    <div>
      <div className="flex items-center gap-3 mb-5">
        {/* Back button — mobile only */}
        <button onClick={() => setMobileView('list')}
          className="md:hidden w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--surface)', color: 'var(--text)' }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>{selected?.name}</h2>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{pendingWorks.length} pending · {doneWorks.length} done</p>
        </div>
      </div>

      <AddWorkForm onAdd={addWork} />

      {loadingWorks ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--primary) transparent transparent transparent' }} />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 mt-3">
            {pendingWorks.length === 0 && (
              <div className="text-center py-10 rounded-2xl" style={{ border: '1.5px dashed var(--border)' }}>
                <p className="text-2xl mb-2">📋</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No work yet</p>
              </div>
            )}
            {pendingWorks.map(w => <WorkCard key={w.id} work={w} onDelete={deleteWork} onToggleDone={toggleWorkDone} />)}
          </div>

          {doneWorks.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-bold tracking-widest mb-2" style={{ color: 'var(--text-secondary)' }}>COMPLETED</p>
              <div className="flex flex-col gap-2">
                {doneWorks.map(w => <WorkCard key={w.id} work={w} onDelete={deleteWork} onToggleDone={toggleWorkDone} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--text)' }}>
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold gradient-text">My CRM</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Clients · Work · Tasks</p>
        </div>

        {/* Dashboard */}
        <Dashboard refreshKey={dashKey} />

        {/* Desktop: two-column | Mobile: single view */}
        <div className="flex gap-4">

          {/* Client sidebar — hidden on mobile when in detail view */}
          <div className={`w-52 flex-shrink-0 ${mobileView === 'detail' ? 'hidden md:block' : 'block'}`}>
            <div className="rounded-2xl p-3 sticky top-4 h-fit" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <ClientList />
            </div>
          </div>

          {/* Work detail — hidden on mobile when in list view */}
          <div className={`flex-1 min-w-0 ${mobileView === 'list' ? 'hidden md:block' : 'block'}`}>
            {!selected
              ? <div className="flex flex-col items-center justify-center h-48 rounded-2xl" style={{ border: '1.5px dashed var(--border)' }}>
                  <p className="text-2xl mb-2">👈</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Select a client to start</p>
                </div>
              : <WorkDetail />
            }
          </div>
        </div>
      </div>
    </div>
  );
}
