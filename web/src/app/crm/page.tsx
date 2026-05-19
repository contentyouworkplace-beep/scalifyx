'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../lib/api';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Client { id: string; name: string; created_at: string }
interface Work { id: string; client_id: string; title: string; deadline: string | null; done: boolean }
interface Task { id: string; work_id: string; title: string; done: boolean; created_at: string }
interface DashWork extends Work { crm_clients: { name: string } | null }

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtDeadline(d: string | null) {
  if (!d) return null;
  const date = new Date(d);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((date.getTime() - today.getTime()) / 86400000);
  const label = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  return { label, diff };
}

function DeadlineBadge({ deadline }: { deadline: string | null }) {
  const d = fmtDeadline(deadline);
  if (!d) return null;
  const color = d.diff < 0 ? '#EF4444' : d.diff <= 2 ? '#F59E0B' : d.diff <= 5 ? '#6366F1' : '#10B981';
  const text = d.diff < 0 ? `${Math.abs(d.diff)}d overdue` : d.diff === 0 ? 'Today' : d.diff === 1 ? 'Tomorrow' : `${d.diff}d left`;
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: color + '22', color }}>
      {d.label} · {text}
    </span>
  );
}

// ── Dashboard top section ─────────────────────────────────────────────────────
function Dashboard() {
  const [urgent, setUrgent] = useState<DashWork[]>([]);
  const [stressFree, setStressFree] = useState<DashWork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/crm/dashboard')
      .then(d => { setUrgent(d.urgent); setStressFree(d.stressFree); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-32 flex items-center justify-center text-sm" style={{ color: 'var(--text-secondary)' }}>Loading...</div>;

  const WorkCard = ({ w, rank }: { w: DashWork; rank: number }) => (
    <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <span className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: 'var(--border)', color: 'var(--text-secondary)' }}>
        {rank}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{w.title}</p>
        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
          {w.crm_clients?.name || '—'}
        </p>
      </div>
      <DeadlineBadge deadline={w.deadline} />
    </div>
  );

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Urgent 5 */}
        <div className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🔥</span>
            <h2 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Urgent — Do First</h2>
            <span className="text-xs ml-auto" style={{ color: 'var(--text-secondary)' }}>{urgent.length} works</span>
          </div>
          {urgent.length === 0
            ? <p className="text-xs text-center py-4" style={{ color: 'var(--text-secondary)' }}>No urgent work. You're good!</p>
            : <div className="flex flex-col gap-2">{urgent.map((w, i) => <WorkCard key={w.id} w={w} rank={i + 1} />)}</div>
          }
        </div>

        {/* Stress Free 5 */}
        <div className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">😌</span>
            <h2 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Stress Free — Do Later</h2>
            <span className="text-xs ml-auto" style={{ color: 'var(--text-secondary)' }}>{stressFree.length} works</span>
          </div>
          {stressFree.length === 0
            ? <p className="text-xs text-center py-4" style={{ color: 'var(--text-secondary)' }}>Nothing else pending. Great job!</p>
            : <div className="flex flex-col gap-2">{stressFree.map((w, i) => <WorkCard key={w.id} w={w} rank={i + 6} />)}</div>
          }
        </div>
      </div>
    </div>
  );
}

// ── Task row ──────────────────────────────────────────────────────────────────
function TaskRow({ task, onToggle, onDelete }: {
  task: Task;
  onToggle: (id: string, done: boolean) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 py-1.5 px-2 rounded-lg group hover:bg-white/5 transition-colors">
      <button
        onClick={() => onToggle(task.id, !task.done)}
        className="w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors"
        style={{
          background: task.done ? 'var(--primary)' : 'transparent',
          borderColor: task.done ? 'var(--primary)' : 'var(--border)',
        }}
      >
        {task.done && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </button>
      <span className="flex-1 text-sm" style={{ color: task.done ? 'var(--text-secondary)' : 'var(--text)', textDecoration: task.done ? 'line-through' : 'none' }}>
        {task.title}
      </span>
      <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-secondary)' }}>
        {new Date(task.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
      </span>
      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-1"
        style={{ color: '#EF4444' }}
      >✕</button>
    </div>
  );
}

// ── Work accordion card ───────────────────────────────────────────────────────
function WorkCard({ work, onDelete, onToggleDone }: {
  work: Work;
  onDelete: (id: string) => void;
  onToggleDone: (id: string, done: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [adding, setAdding] = useState(false);

  const loadTasks = useCallback(async () => {
    if (tasksLoaded) return;
    const d = await apiFetch(`/crm/tasks?work_id=${work.id}`);
    setTasks(d.tasks);
    setTasksLoaded(true);
  }, [work.id, tasksLoaded]);

  const toggle = () => {
    if (!open) loadTasks();
    setOpen(v => !v);
  };

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
    <div className="rounded-xl overflow-hidden transition-all" style={{ border: `1px solid ${done ? 'var(--border)' : 'var(--border)'}`, background: 'var(--card)', opacity: done ? 0.6 : 1 }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none" onClick={toggle}>
        <button
          onClick={e => { e.stopPropagation(); onToggleDone(work.id, !done); }}
          className="w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors"
          style={{ background: done ? 'var(--primary)' : 'transparent', borderColor: done ? 'var(--primary)' : 'var(--border)' }}
        >
          {done && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        </button>

        <span className="flex-1 font-medium text-sm" style={{ color: 'var(--text)', textDecoration: done ? 'line-through' : 'none' }}>
          {work.title}
        </span>

        {tasksLoaded && tasks.length > 0 && (
          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'var(--border)', color: 'var(--text-secondary)' }}>
            {completedCount}/{tasks.length}
          </span>
        )}

        <DeadlineBadge deadline={work.deadline} />

        <button
          onClick={e => { e.stopPropagation(); onDelete(work.id); }}
          className="text-xs ml-1 hover:opacity-100 opacity-30 transition-opacity"
          style={{ color: '#EF4444' }}
        >✕</button>

        <svg
          className="w-4 h-4 flex-shrink-0 transition-transform"
          style={{ color: 'var(--text-secondary)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Tasks panel */}
      {open && (
        <div className="px-4 pb-3 pt-0" style={{ borderTop: '1px solid var(--border)' }}>
          {tasks.length === 0 && !adding
            ? <p className="text-xs py-3 text-center" style={{ color: 'var(--text-secondary)' }}>No tasks yet. Add one below.</p>
            : <div className="mt-2 flex flex-col gap-0.5">
                {tasks.map(t => (
                  <TaskRow key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} />
                ))}
              </div>
          }
          <div className="flex items-center gap-2 mt-2">
            <input
              className="flex-1 text-sm px-3 py-1.5 rounded-lg outline-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
              placeholder="Add task..."
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask()}
            />
            <button
              onClick={addTask}
              disabled={adding || !newTask.trim()}
              className="text-sm px-3 py-1.5 rounded-lg font-medium transition-opacity disabled:opacity-40"
              style={{ background: 'var(--primary)', color: '#fff' }}
            >
              {adding ? '...' : 'Add'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CrmPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [works, setWorks] = useState<Work[]>([]);
  const [newClient, setNewClient] = useState('');
  const [newWork, setNewWork] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [addingClient, setAddingClient] = useState(false);
  const [addingWork, setAddingWork] = useState(false);
  const [loadingWorks, setLoadingWorks] = useState(false);

  // Load clients
  useEffect(() => {
    apiFetch('/crm/clients').then(d => {
      setClients(d.clients);
      if (d.clients.length > 0) setSelectedClient(d.clients[0]);
    }).catch(() => {});
  }, []);

  // Load works when client changes
  useEffect(() => {
    if (!selectedClient) return;
    setLoadingWorks(true);
    apiFetch(`/crm/works?client_id=${selectedClient.id}`)
      .then(d => setWorks(d.works))
      .catch(() => {})
      .finally(() => setLoadingWorks(false));
  }, [selectedClient]);

  const addClient = async () => {
    if (!newClient.trim()) return;
    setAddingClient(true);
    try {
      const d = await apiFetch('/crm/clients', { method: 'POST', body: JSON.stringify({ name: newClient }) });
      setClients(c => [d.client, ...c]);
      setSelectedClient(d.client);
      setNewClient('');
    } finally { setAddingClient(false); }
  };

  const deleteClient = async (id: string) => {
    await apiFetch('/crm/clients', { method: 'DELETE', body: JSON.stringify({ id }) });
    const updated = clients.filter(c => c.id !== id);
    setClients(updated);
    if (selectedClient?.id === id) setSelectedClient(updated[0] || null);
  };

  const addWork = async () => {
    if (!newWork.trim() || !selectedClient) return;
    setAddingWork(true);
    try {
      const d = await apiFetch('/crm/works', {
        method: 'POST',
        body: JSON.stringify({ client_id: selectedClient.id, title: newWork, deadline: newDeadline || null }),
      });
      setWorks(w => [...w, d.work]);
      setNewWork('');
      setNewDeadline('');
    } finally { setAddingWork(false); }
  };

  const deleteWork = async (id: string) => {
    await apiFetch('/crm/works', { method: 'DELETE', body: JSON.stringify({ id }) });
    setWorks(w => w.filter(x => x.id !== id));
  };

  const toggleWorkDone = async (id: string, done: boolean) => {
    await apiFetch('/crm/works', { method: 'PATCH', body: JSON.stringify({ id, done }) });
    setWorks(w => w.map(x => x.id === id ? { ...x, done } : x));
  };

  const pendingWorks = works.filter(w => !w.done);
  const doneWorks = works.filter(w => w.done);

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--text)' }}>
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold gradient-text">Rahul's CRM</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>Your clients, work & tasks — all in one place</p>
        </div>

        {/* Dashboard: Urgent + Stress Free */}
        <Dashboard />

        {/* Main layout */}
        <div className="flex gap-4">

          {/* Left: Client list */}
          <div className="w-56 flex-shrink-0">
            <div className="rounded-2xl p-3 sticky top-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <p className="text-xs font-bold mb-3 px-1" style={{ color: 'var(--text-secondary)' }}>CLIENTS</p>

              <div className="flex flex-col gap-1 mb-3">
                {clients.map(c => (
                  <div
                    key={c.id}
                    className="flex items-center gap-1 group"
                  >
                    <button
                      onClick={() => setSelectedClient(c)}
                      className="flex-1 text-left px-3 py-2 rounded-xl text-sm font-medium transition-all truncate"
                      style={{
                        background: selectedClient?.id === c.id ? 'var(--primary)' : 'transparent',
                        color: selectedClient?.id === c.id ? '#fff' : 'var(--text)',
                      }}
                    >
                      {c.name}
                    </button>
                    <button
                      onClick={() => deleteClient(c.id)}
                      className="opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity text-xs px-1"
                      style={{ color: '#EF4444' }}
                    >✕</button>
                  </div>
                ))}
                {clients.length === 0 && (
                  <p className="text-xs px-1 py-2" style={{ color: 'var(--text-secondary)' }}>No clients yet</p>
                )}
              </div>

              {/* Add client */}
              <div className="flex flex-col gap-1">
                <input
                  className="w-full text-xs px-3 py-2 rounded-lg outline-none"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  placeholder="Client name..."
                  value={newClient}
                  onChange={e => setNewClient(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addClient()}
                />
                <button
                  onClick={addClient}
                  disabled={addingClient || !newClient.trim()}
                  className="text-xs py-1.5 rounded-lg font-semibold transition-opacity disabled:opacity-40"
                  style={{ background: 'var(--primary)', color: '#fff' }}
                >
                  {addingClient ? 'Adding...' : '+ Add Client'}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Works */}
          <div className="flex-1 min-w-0">
            {!selectedClient ? (
              <div className="flex flex-col items-center justify-center h-48 rounded-2xl" style={{ border: '1px dashed var(--border)' }}>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Select or add a client to get started</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="font-bold text-lg" style={{ color: 'var(--text)' }}>{selectedClient.name}</h2>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--border)', color: 'var(--text-secondary)' }}>
                    {pendingWorks.length} pending
                  </span>
                </div>

                {/* Add work */}
                <div className="flex gap-2 mb-4">
                  <input
                    className="flex-1 text-sm px-4 py-2.5 rounded-xl outline-none"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                    placeholder="Work title (e.g. Website Redesign)..."
                    value={newWork}
                    onChange={e => setNewWork(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addWork()}
                  />
                  <input
                    type="date"
                    className="text-sm px-3 py-2.5 rounded-xl outline-none"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                    value={newDeadline}
                    onChange={e => setNewDeadline(e.target.value)}
                  />
                  <button
                    onClick={addWork}
                    disabled={addingWork || !newWork.trim()}
                    className="text-sm px-4 py-2.5 rounded-xl font-semibold transition-opacity disabled:opacity-40"
                    style={{ background: 'var(--primary)', color: '#fff' }}
                  >
                    {addingWork ? '...' : '+ Add'}
                  </button>
                </div>

                {loadingWorks ? (
                  <div className="flex items-center justify-center h-24" style={{ color: 'var(--text-secondary)' }}>
                    <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--primary) transparent transparent transparent' }} />
                  </div>
                ) : (
                  <>
                    {/* Pending works */}
                    <div className="flex flex-col gap-2">
                      {pendingWorks.length === 0 && (
                        <div className="text-center py-8 rounded-2xl" style={{ border: '1px dashed var(--border)' }}>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No work yet. Add your first one above.</p>
                        </div>
                      )}
                      {pendingWorks.map(w => (
                        <WorkCard key={w.id} work={w} onDelete={deleteWork} onToggleDone={toggleWorkDone} />
                      ))}
                    </div>

                    {/* Done works */}
                    {doneWorks.length > 0 && (
                      <div className="mt-6">
                        <p className="text-xs font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>COMPLETED</p>
                        <div className="flex flex-col gap-2">
                          {doneWorks.map(w => (
                            <WorkCard key={w.id} work={w} onDelete={deleteWork} onToggleDone={toggleWorkDone} />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
