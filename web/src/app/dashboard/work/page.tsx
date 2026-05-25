'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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

interface ChatMessage {
  id: string;
  content: string;
  author_name: string;
  author_role: 'admin' | 'user';
  created_at: string;
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
  const [tab, setTab] = useState<'tasks' | 'chat'>('tasks');

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatText, setChatText] = useState('');
  const [chatSending, setChatSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const lastSeenKey = `work_chat_seen_${user?.id}`;

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

  const fetchChat = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await apiFetch(`/work/${user.id}/chat`);
      const msgs: ChatMessage[] = data.messages || [];
      setMessages(msgs);
      if (tab !== 'chat') {
        const lastSeen = localStorage.getItem(lastSeenKey) || '';
        const newCount = msgs.filter(m => m.author_role === 'admin' && m.created_at > lastSeen).length;
        setUnread(newCount);
      }
    } catch { /* silent */ }
  }, [user?.id, tab, lastSeenKey]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    fetchChat();
    const interval = setInterval(fetchChat, tab === 'chat' ? 5000 : 15000);
    return () => clearInterval(interval);
  }, [fetchChat, tab]);

  // Mark chat as read + scroll when switching to chat tab
  useEffect(() => {
    if (tab === 'chat') {
      setUnread(0);
      if (messages.length > 0) {
        localStorage.setItem(lastSeenKey, messages[messages.length - 1].created_at);
      }
      setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
    }
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const sendChat = async () => {
    const content = chatText.trim();
    if (!content || !user?.id || chatSending) return;
    setChatSending(true);
    try {
      await apiFetch(`/work/${user.id}/chat`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
      setChatText('');
      await fetchChat();
      setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    } catch {
      toast.error('Failed to send message');
    } finally {
      setChatSending(false);
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
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold">Work Progress</h1>
        <p className="text-sm text-zinc-500 mt-1">Track every step — from setup to SEO</p>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-1 bg-zinc-800/60 rounded-xl p-1 mb-6">
        <button
          onClick={() => setTab('tasks')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition ${
            tab === 'tasks' ? 'bg-surface text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          Tasks
          <span className={`text-xs px-1.5 py-0.5 rounded-md ${tab === 'tasks' ? 'bg-primary/20 text-primary' : 'bg-zinc-700 text-zinc-500'}`}>
            {completedCount}/{totalTasks}
          </span>
        </button>
        <button
          onClick={() => setTab('chat')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition ${
            tab === 'chat' ? 'bg-surface text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Chat
          {unread > 0 && (
            <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>
      </div>

      {/* ── TASKS TAB ── */}
      {tab === 'tasks' && (
        <>
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
                        <button
                          onClick={() => setExpanded(isOpen ? null : task.key)}
                          className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-surface/60 transition"
                        >
                          <div className={`w-5 h-5 rounded-full flex-shrink-0 border-2 flex items-center justify-center transition ${
                            task.completed ? 'bg-primary border-primary' : 'border-zinc-700'
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

                        {isOpen && (
                          <div className="px-4 pb-4 bg-zinc-900/40">
                            {task.comments.length > 0 && (
                              <div className="mb-3 space-y-2">
                                {task.comments.map(c => (
                                  <div key={c.id} className="flex gap-2.5">
                                    <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5 ${
                                      c.author_role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-zinc-700 text-zinc-300'
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
        </>
      )}

      {/* ── CHAT TAB ── */}
      {tab === 'chat' && (
        <div className="rounded-2xl border border-border bg-zinc-900 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 220px)', minHeight: '400px' }}>
          {/* Chat header */}
          <div className="px-4 py-3 border-b border-border bg-surface flex items-center justify-between flex-shrink-0">
            <div>
              <p className="text-sm font-bold text-white">Scalify Team</p>
              <p className="text-[11px] text-zinc-500">Ask us anything about your project</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-[11px] text-zinc-500">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <p className="text-sm font-semibold text-zinc-400">No messages yet</p>
                <p className="text-xs text-zinc-600 mt-1">Send a message to the Scalify team</p>
              </div>
            ) : (
              messages.map(m => {
                const isMe = m.author_role === 'user';
                return (
                  <div key={m.id} className={`flex flex-col gap-0.5 ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? 'bg-primary text-white rounded-br-sm'
                        : 'bg-zinc-800 text-zinc-100 rounded-bl-sm'
                    }`}>
                      {m.content}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-zinc-600 px-1">
                      {!isMe && (
                        <>
                          <span className="font-medium text-zinc-500">{m.author_name}</span>
                          <span className="px-1 py-0.5 rounded bg-primary/15 text-primary font-bold text-[9px]">TEAM</span>
                        </>
                      )}
                      <span>{timeAgo(m.created_at)}</span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-border bg-surface flex gap-2 flex-shrink-0">
            <input
              type="text"
              value={chatText}
              onChange={e => setChatText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
              placeholder="Type a message…"
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary/50"
            />
            <button
              onClick={sendChat}
              disabled={!chatText.trim() || chatSending}
              className="px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-40 flex items-center justify-center"
            >
              {chatSending ? (
                <div className="w-4 h-4 border border-white/50 border-t-white rounded-full animate-spin" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
