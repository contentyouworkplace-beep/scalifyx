'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { apiFetch } from '../lib/api';

interface Message {
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

interface TaskChatProps {
  userId: string;
  currentRole: 'admin' | 'user';
}

export default function TaskChat({ userId, currentRole }: TaskChatProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSeenKey = `task_chat_seen_${userId}`;

  const fetchMessages = useCallback(async () => {
    try {
      const data = await apiFetch(`/work/${userId}/chat`);
      const msgs: Message[] = data.messages || [];
      setMessages(msgs);

      if (!open) {
        const lastSeen = localStorage.getItem(lastSeenKey) || '';
        const newCount = msgs.filter(m =>
          m.author_role !== currentRole && m.created_at > lastSeen
        ).length;
        setUnread(newCount);
      }
    } catch {
      // silent
    }
  }, [userId, open, currentRole, lastSeenKey]);

  // Poll every 5s when open, every 15s when closed
  useEffect(() => {
    fetchMessages();
    const interval = open ? 5000 : 15000;
    pollingRef.current = setInterval(fetchMessages, interval);
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [fetchMessages, open]);

  // Mark as read and scroll to bottom when opened
  useEffect(() => {
    if (open) {
      setUnread(0);
      if (messages.length > 0) {
        localStorage.setItem(lastSeenKey, messages[messages.length - 1].created_at);
      }
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }, [open, messages, lastSeenKey]);

  const send = async () => {
    const content = text.trim();
    if (!content || sending) return;
    setSending(true);
    try {
      await apiFetch(`/work/${userId}/chat`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
      setText('');
      await fetchMessages();
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    } catch {
      // silent
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95"
        aria-label="Open chat"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl border border-border bg-zinc-900 shadow-2xl flex flex-col overflow-hidden"
          style={{ maxHeight: '70vh' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
            <div>
              <p className="text-sm font-bold text-white">
                {currentRole === 'admin' ? 'Chat with Client' : 'Chat with Scalify Team'}
              </p>
              <p className="text-[11px] text-zinc-500">
                {currentRole === 'admin' ? 'Your replies are visible to the user' : 'Ask us anything about your project'}
              </p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-400" title="Online" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-zinc-600 text-xs">
                No messages yet.<br />
                {currentRole === 'user' ? 'Ask the team anything!' : 'Start a conversation with the client.'}
              </div>
            ) : (
              messages.map(m => {
                const isMe = m.author_role === currentRole;
                return (
                  <div key={m.id} className={`flex flex-col gap-0.5 ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-primary text-white rounded-br-sm'
                        : 'bg-zinc-800 text-zinc-100 rounded-bl-sm'
                    }`}>
                      {m.content}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-zinc-600">
                      {!isMe && <span className="font-medium">{m.author_name}</span>}
                      {!isMe && m.author_role === 'admin' && (
                        <span className="px-1 py-0.5 rounded bg-primary/15 text-primary font-bold text-[9px]">TEAM</span>
                      )}
                      <span>{timeAgo(m.created_at)}</span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-border bg-surface flex gap-2">
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Type a message…"
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-primary/50"
            />
            <button
              onClick={send}
              disabled={!text.trim() || sending}
              className="px-3 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition disabled:opacity-40 flex items-center justify-center"
            >
              {sending ? (
                <div className="w-3 h-3 border border-white/50 border-t-white rounded-full animate-spin" />
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
