'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

interface Comment {
  id: string;
  content: string;
  author_name: string;
  author_role: 'admin' | 'user';
  created_at: string;
}

interface Task {
  key: string;
  phase: number;
  phase_name: string;
  title: string;
  sort: number;
  completed: boolean;
  completed_at: string | null;
  comments: Comment[];
}

function timeAgo(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function WorkPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const load = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await apiFetch(`/work/${user.id}`);
      setTasks(data.tasks || []);
      setTotalTasks(data.totalTasks || 0);
      setCompletedCount(data.completedCount || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { load(); }, [load]);

  const submitComment = async (taskKey: string) => {
    const content = commentText[taskKey]?.trim();
    if (!content || !user?.id) return;
    setSubmitting(taskKey);
    try {
      await apiFetch(`/work/${user.id}/comment`, {
        method: 'POST',
        body: JSON.stringify({ task_key: taskKey, content }),
      });
      setCommentText(prev => ({ ...prev, [taskKey]: '' }));
      await load();
    } catch {
      toast.error('Failed to post comment');
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const phases = Array.from(new Set(tasks.map(t => t.phase))).sort();
  const progress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold">Work Progress</h1>
        <p className="text-sm text-zinc-500 mt-1">Track every step — from setup to SEO</p>
      </div>

      {/* Progress bar */}
      <div className="rounded-2xl bg-surface border border-border p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-white">{completedCount} of {totalTasks} tasks complete</span>
          <span className="text-sm font-extrabold text-primary">{progress}%</span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Phases */}
      {phases.map(phase => {
        const phaseTasks = tasks.filter(t => t.phase === phase);
        const phaseName = phaseTasks[0]?.phase_name || '';
        const phaseCompleted = phaseTasks.filter(t => t.completed).length;

        return (
          <div key={phase} className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-500">
                Phase {phase} — {phaseName}
              </span>
              <span className="text-[11px] text-zinc-600">{phaseCompleted}/{phaseTasks.length}</span>
            </div>

            <div className="rounded-2xl border border-border overflow-hidden">
              {phaseTasks.map((task, i) => {
                const isOpen = expanded === task.key;
                return (
                  <div key={task.key} className={i < phaseTasks.length - 1 ? 'border-b border-border' : ''}>
                    {/* Task row */}
                    <button
                      onClick={() => setExpanded(isOpen ? null : task.key)}
                      className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-surface/60 transition"
                    >
                      {/* Checkbox visual */}
                      <div className={`w-5 h-5 rounded-full flex-shrink-0 border-2 flex items-center justify-center transition ${
                        task.completed
                          ? 'bg-primary border-primary'
                          : 'border-zinc-700'
                      }`}>
                        {task.completed && (
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className={`text-sm font-semibold ${task.completed ? 'text-zinc-500 line-through' : 'text-white'}`}>
                          {task.title}
                        </span>
                        {task.completed && task.completed_at && (
                          <div className="text-[11px] text-zinc-600 mt-0.5">{timeAgo(task.completed_at)}</div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {task.comments.length > 0 && (
                          <span className="text-[10px] text-zinc-600 font-semibold">
                            {task.comments.length} note{task.comments.length !== 1 ? 's' : ''}
                          </span>
                        )}
                        <svg
                          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                          className={`text-zinc-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        >
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </div>
                    </button>

                    {/* Comments drawer */}
                    {isOpen && (
                      <div className="px-4 pb-4 bg-zinc-900/40">
                        {/* Existing comments */}
                        {task.comments.length > 0 && (
                          <div className="mb-3 space-y-2">
                            {task.comments.map(c => (
                              <div key={c.id} className="flex gap-2.5">
                                <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5 ${
                                  c.author_role === 'admin'
                                    ? 'bg-primary/20 text-primary'
                                    : 'bg-zinc-700 text-zinc-300'
                                }`}>
                                  {c.author_name[0]?.toUpperCase() || '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-semibold text-white">{c.author_name}</span>
                                    {c.author_role === 'admin' && (
                                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-bold">TEAM</span>
                                    )}
                                    <span className="text-[10px] text-zinc-600">{timeAgo(c.created_at)}</span>
                                  </div>
                                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{c.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Comment input */}
                        <div className="flex gap-2">
                          <textarea
                            value={commentText[task.key] || ''}
                            onChange={e => setCommentText(prev => ({ ...prev, [task.key]: e.target.value }))}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitComment(task.key); }
                            }}
                            placeholder="Write a note or question…"
                            rows={1}
                            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-primary/50 resize-none"
                          />
                          <button
                            onClick={() => submitComment(task.key)}
                            disabled={!commentText[task.key]?.trim() || submitting === task.key}
                            className="px-3 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/20 transition disabled:opacity-40"
                          >
                            {submitting === task.key ? '…' : 'Send'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
