'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { apiFetch } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

interface Conversation {
  id: string;
  user_id: string;
  type: string;
  status: string;
  updated_at: string;
  profiles?: { name?: string; phone?: string; email?: string; plan?: string; business_name?: string };
  last_message?: { content: string; sender_type: string; created_at: string };
  unread_count: number;
}

interface ChatMessage {
  id: string;
  content: string;
  sender_type: 'user' | 'ai' | 'admin';
  sender_id?: string;
  created_at: string;
}

function timeAgo(dateStr: string) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

function senderLabel(type: string) {
  if (type === 'user') return 'User';
  if (type === 'admin') return 'You';
  return 'AI';
}

export default function AdminChatsPage() {
  const { user } = useAuth();

  // List state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filter, setFilter] = useState<'all' | 'human' | 'ai' | 'resolved'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // AI toggle state
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiToggling, setAiToggling] = useState(false);

  // Detail state
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [convStatus, setConvStatus] = useState('active');

  // AI Website mode
  const [aiMode, setAiMode] = useState(false);
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([]);
  const [aiConvId, setAiConvId] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const data = await apiFetch('/chat/admin/conversations');
      setConversations(data.conversations || []);
    } catch (e) { console.error('Fetch conversations error:', e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchConversations();
    // Fetch AI setting
    apiFetch('/admin/ai-settings').then((d) => setAiEnabled(d.ai_chat_enabled ?? true)).catch(() => {});
    const channel = supabase
      .channel('admin-conversations')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => fetchConversations())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'conversations' }, () => fetchConversations())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchConversations]);

  const filteredConversations = conversations.filter((c) => {
    const name = c.profiles?.name || c.profiles?.phone || '';
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) ||
      (c.profiles?.business_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.profiles?.email || '').toLowerCase().includes(search.toLowerCase());
    if (filter === 'all') return matchesSearch && c.status !== 'archived';
    if (filter === 'human') return matchesSearch && c.type === 'support' && c.status === 'active';
    if (filter === 'ai') return matchesSearch && c.type === 'ai' && c.status === 'active';
    if (filter === 'resolved') return matchesSearch && c.status === 'resolved';
    return matchesSearch;
  });

  const toggleAiChat = async () => {
    if (aiToggling) return;
    setAiToggling(true);
    const next = !aiEnabled;
    try {
      await apiFetch('/admin/ai-settings', { method: 'PUT', body: JSON.stringify({ ai_chat_enabled: next }) });
      setAiEnabled(next);
      toast.success(next ? '🤖 AI Chat enabled' : '🧑‍💼 AI disabled — Human only mode');
    } catch { toast.error('Failed to update AI setting'); }
    finally { setAiToggling(false); }
  };

  // Select conversation
  const selectConversation = async (conv: Conversation) => {
    setSelected(conv);
    setConvStatus(conv.status);
    setAiMode(false);
    setAiMessages([]);
    setAiConvId(null);
    try {
      const data = await apiFetch(`/chat/history/${conv.id}`);
      setMessages(data.messages || []);
      apiFetch(`/chat/admin/mark-read/${conv.id}`, { method: 'POST' }).catch(() => {});
    } catch { setMessages([]); }
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 200);
  };

  // Realtime for selected conv
  useEffect(() => {
    if (!selected) return;
    const channel = supabase
      .channel(`admin-chat-${selected.id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `conversation_id=eq.${selected.id}`,
      }, (payload: any) => {
        const msg = payload.new as ChatMessage;
        setMessages((prev) => prev.find((m) => m.id === msg.id) ? prev : [...prev, msg]);
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 200);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selected]);

  // Send admin reply
  const sendAdminMessage = async () => {
    if (!inputText.trim() || !selected || sending) return;
    const text = inputText.trim();
    setInputText('');
    setSending(true);
    try {
      await apiFetch('/chat/admin/reply', { method: 'POST', body: JSON.stringify({ conversationId: selected.id, message: text }) });
    } catch {
      setMessages((prev) => [...prev, { id: Date.now().toString(), content: text, sender_type: 'admin', sender_id: user?.id, created_at: new Date().toISOString() }]);
    } finally { setSending(false); }
  };

  // Resolve
  const handleResolve = async () => {
    if (!selected) return;
    const newStatus = convStatus === 'resolved' ? 'active' : 'resolved';
    try {
      await apiFetch(`/chat/admin/resolve/${selected.id}`, { method: 'PUT', body: JSON.stringify({ status: newStatus }) });
      setConvStatus(newStatus);
      toast.success(newStatus === 'resolved' ? 'Resolved' : 'Reopened');
    } catch { toast.error('Failed'); }
  };

  // AI Website mode
  const fetchAiHistory = async () => {
    if (!selected) return;
    try {
      const data = await apiFetch(`/chat/admin/website-ai/${selected.user_id}`);
      setAiMessages(data.messages || []);
      if (data.conversationId) setAiConvId(data.conversationId);
    } catch (e) { console.error('Fetch AI history error:', e); }
  };

  const toggleAiMode = () => {
    const entering = !aiMode;
    setAiMode(entering);
    setInputText('');
    if (entering && aiMessages.length === 0) fetchAiHistory();
  };

  const sendAiMessage = async () => {
    if (!inputText.trim() || aiLoading || !selected) return;
    const text = inputText.trim();
    setInputText('');
    setAiLoading(true);
    const tempMsg: ChatMessage = { id: `temp-${Date.now()}`, content: text, sender_type: 'admin', sender_id: user?.id, created_at: new Date().toISOString() };
    setAiMessages((prev) => [...prev, tempMsg]);
    try {
      const data = await apiFetch('/chat/admin/website-ai', { method: 'POST', body: JSON.stringify({ message: text, userId: selected.user_id, conversationId: aiConvId }) });
      if (data.conversationId) setAiConvId(data.conversationId);
      setAiMessages((prev) => [...prev, { id: `ai-${Date.now()}`, content: data.reply, sender_type: 'ai', created_at: new Date().toISOString() }]);
    } catch (e: any) {
      setAiMessages((prev) => [...prev, { id: `err-${Date.now()}`, content: `Error: ${e.message || 'Failed'}`, sender_type: 'ai', created_at: new Date().toISOString() }]);
    } finally { setAiLoading(false); }
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 200);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  // Chat Detail View
  if (selected) {
    const displayMessages = aiMode ? aiMessages : messages;
    const userName = selected.profiles?.name || selected.profiles?.phone || 'User';

    return (
      <div className="flex flex-col h-[calc(100vh-7.5rem)] md:h-[calc(100vh-2rem)]">
        {/* Chat Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-border mb-3">
          <button onClick={() => setSelected(null)} className="text-primary text-sm font-medium flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">{userName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{userName}</p>
            <p className="text-[11px] text-zinc-500">
              {selected.profiles?.plan === 'pro' ? '⭐ Pro' : '🆓 Free'}
              {selected.type ? ` · ${selected.type === 'ai' ? '🤖 AI' : '🧑‍💼 Human'}` : ''}
            </p>
          </div>
          <button onClick={handleResolve} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium ${convStatus === 'resolved' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-green-500/10 text-green-400'}`}>
            {convStatus === 'resolved' ? '↺ Reopen' : '✓ Resolve'}
          </button>
        </div>

        {/* AI/Support Toggle */}
        <div className="flex gap-1 bg-surface rounded-xl p-1 mb-3">
          <button onClick={() => aiMode && toggleAiMode()} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition ${!aiMode ? 'bg-primary text-white' : 'text-zinc-500'}`}>
            💬 Support Chat
          </button>
          <button onClick={() => !aiMode && toggleAiMode()} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition ${aiMode ? 'bg-purple-600 text-white' : 'text-zinc-500'}`}>
            🌐 AI Website
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 pb-2">
          {displayMessages.map((msg) => {
            const isAdmin = msg.sender_type === 'admin';
            const isAI = msg.sender_type === 'ai';
            const isUser = msg.sender_type === 'user';
            return (
              <div key={msg.id} className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center mr-2 flex-shrink-0 mt-5">
                    <span className="text-[10px]">{userName.charAt(0)}</span>
                  </div>
                )}
                <div className="max-w-[75%]">
                  <p className={`text-[10px] text-zinc-500 mb-0.5 ${isUser ? 'text-left' : 'text-right'}`}>
                    {isAdmin ? '👤 You (Admin)' : isAI ? '🤖 AI' : `💬 ${userName}`}
                  </p>
                  <div className={`px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${isAdmin ? 'bg-primary text-white' : isAI ? 'bg-purple-600/20 text-white' : 'bg-surface text-white'}`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p className={`text-[10px] mt-1 ${isAdmin ? 'text-white/60' : 'text-zinc-500'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                {!isUser && (
                  <div className={`w-7 h-7 rounded-lg ${isAI ? 'bg-purple-600/20' : 'bg-primary/20'} flex items-center justify-center ml-2 flex-shrink-0 mt-5`}>
                    <span className="text-[10px]">{isAI ? '🤖' : '👤'}</span>
                  </div>
                )}
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        {/* Input */}
        <div className={`flex items-center gap-2 pt-3 border-t ${aiMode ? 'border-purple-600/40' : 'border-border'}`}>
          {aiMode && <span className="text-purple-500 text-xs">🌐</span>}
          <input
            className="flex-1 bg-surface border border-border rounded-xl px-3.5 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary"
            placeholder={aiMode ? 'Tell AI what to build or change...' : 'Reply as admin...'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), aiMode ? sendAiMessage() : sendAdminMessage())}
          />
          <button
            onClick={aiMode ? sendAiMessage : sendAdminMessage}
            disabled={!inputText.trim() || sending || aiLoading}
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition ${aiMode ? 'bg-purple-600' : 'bg-primary'}`}
          >
            {(sending || aiLoading) ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> :
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>}
          </button>
        </div>
      </div>
    );
  }

  // Conversation List View
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-xl font-extrabold">💬 All Conversations</h1>
          <p className="text-[13px] text-zinc-500 mt-1">{conversations.length} total · {conversations.filter(c => c.unread_count > 0).length} unread</p>
        </div>
        {/* AI Toggle */}
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={toggleAiChat}
            disabled={aiToggling}
            className={`relative flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition ${aiEnabled ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400' : 'bg-yellow-400/10 border-yellow-400/40 text-yellow-400'}`}
          >
            <span>{aiEnabled ? '🤖' : '🧑‍💼'}</span>
            <span>{aiEnabled ? 'AI Active' : 'Human Only'}</span>
            {/* Toggle pill */}
            <span className={`w-8 h-4 rounded-full relative transition-colors ${aiEnabled ? 'bg-indigo-500' : 'bg-zinc-600'}`}>
              <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${aiEnabled ? 'left-4' : 'left-0.5'}`} />
            </span>
          </button>
          <span className="text-[10px] text-zinc-600">{aiEnabled ? 'AI replies automatically' : 'Only admin can reply'}</span>
        </div>
      </div>

      {/* AI Disabled Banner */}
      {!aiEnabled && (
        <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-4 py-2.5 mb-3">
          <span className="text-yellow-400 text-lg">🧑‍💼</span>
          <div>
            <p className="text-yellow-400 text-xs font-bold">Human-Only Mode Active</p>
            <p className="text-yellow-400/70 text-[11px]">AI chatbot is disabled. All user messages will wait for your manual reply.</p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="flex items-center bg-surface border border-border rounded-[14px] px-3 mb-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-500"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input className="flex-1 bg-transparent py-3 ml-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none" placeholder="Search by name, email, business..." value={search} onChange={(e) => setSearch(e.target.value)} />
        {search && <button onClick={() => setSearch('')} className="text-zinc-500">✕</button>}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {([
          { key: 'all', label: '💬 All' },
          { key: 'human', label: '🧑‍💼 Human' },
          { key: 'ai', label: '🤖 AI Chat' },
          { key: 'resolved', label: '✅ Resolved' },
        ] as const).map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${filter === f.key ? 'bg-primary/20 border-primary text-primary' : 'bg-surface border-border text-zinc-500'}`}
          >{f.label}</button>
        ))}
      </div>

      {/* Conversation List */}
      <div className="space-y-2">
        {filteredConversations.length === 0 && (
          <div className="text-center py-16">
            <p className="text-3xl mb-2">💬</p>
            <p className="text-sm text-zinc-500">No conversations found</p>
            <p className="text-xs text-zinc-600 mt-1">{filter !== 'all' ? 'Try changing the filter' : 'Users will appear when they start chatting'}</p>
          </div>
        )}
        {filteredConversations.map((conv) => {
          const name = conv.profiles?.name || conv.profiles?.phone || 'Unknown User';
          const lastMsg = conv.last_message?.content || 'No messages yet';
          const lastSender = conv.last_message ? senderLabel(conv.last_message.sender_type) : '';
          const isHuman = conv.type === 'support';
          const isResolved = conv.status === 'resolved';
          const plan = conv.profiles?.plan || 'free';

          return (
            <button key={conv.id} onClick={() => selectConversation(conv)} className="w-full flex items-center gap-3 p-3 rounded-2xl bg-surface border border-border hover:border-primary/30 transition text-left">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className={`w-11 h-11 rounded-xl ${isHuman ? 'bg-yellow-400/20' : 'bg-primary/20'} flex items-center justify-center`}>
                  <span className="text-sm font-bold text-primary">{name.charAt(0).toUpperCase()}</span>
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[7px] ${isHuman ? 'bg-yellow-400' : 'bg-indigo-500'}`}>
                  {isHuman ? '🧑‍💼' : '🤖'}
                </div>
                {conv.unread_count > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-[9px] text-white font-bold">{conv.unread_count > 9 ? '9+' : conv.unread_count}</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-semibold truncate ${conv.unread_count > 0 ? 'font-extrabold' : ''}`}>{name}</span>
                    {plan === 'pro' && <span className="text-[9px] font-bold text-primary bg-primary/20 px-1.5 py-0.5 rounded">PRO</span>}
                  </div>
                  <span className="text-[11px] text-zinc-500">{timeAgo(conv.last_message?.created_at || conv.updated_at)}</span>
                </div>
                <p className={`text-xs truncate mt-0.5 ${conv.unread_count > 0 ? 'text-white font-semibold' : 'text-zinc-500'}`}>
                  {lastSender ? `${lastSender}: ` : ''}{lastMsg}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {conv.profiles?.business_name && <span className="text-[10px] text-zinc-600">🏢 {conv.profiles.business_name}</span>}
                  {isResolved && <span className="text-[10px] text-green-400">✅ Resolved</span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
