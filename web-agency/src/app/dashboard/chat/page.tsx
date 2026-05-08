'use client';

import { useAuth } from '../../../context/AuthContext';
import { useState, useEffect, useRef, useCallback } from 'react';
import { apiFetch } from '../../../lib/api';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

type SenderType = 'user' | 'ai' | 'admin';
type ChatMode = 'ai' | 'human';

interface Message {
  id?: string;
  sender_type: SenderType;
  content: string;
  created_at?: string;
}

interface Website {
  id: string;
  business_name: string;
  deployed_url: string;
  status: string;
}

// ─── Helpers ─────────────────────────────────────────────────
function fmt(text: string) {
  return text.split('\n').map((line, i, arr) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <span key={i}>
        {parts.map((p, j) =>
          p.startsWith('**') && p.endsWith('**')
            ? <strong key={j} className="font-semibold">{p.slice(2, -2)}</strong>
            : <span key={j}>{p}</span>
        )}
        {i < arr.length - 1 && <br />}
      </span>
    );
  });
}

function ts(dateStr?: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─── FREE USER ────────────────────────────────────────────────
const FAQ_REPLIES: [RegExp, string, string[]][] = [
  [/^(hi|hello|hey|hii|namaste)/i, "Hey! 👋 Welcome to Scalify!\n\nI can help you get a **professional website + SEO** for your business — starting at just **₹1,499/month**.\n\nWhat would you like to know?", ['How much does it cost?', 'What do I get?', 'How does it work?', 'Will I rank on Google?']],
  [/price|cost|kitna|₹|pay|plan|1499/i, "Scalify Pro is **₹1,499/month** (regular ₹2,499 — you save ₹1,000!).\n\n✅ AI-built website\n✅ Full SEO setup\n✅ WhatsApp lead capture\n✅ Free hosting + SSL\n✅ Priority support", ['Can I cancel anytime?', 'How does it work?', 'Will I rank on Google?']],
  [/how.*work|process|step|start/i, "Super simple! 🚀\n\n1️⃣ Subscribe — ₹1,499/month\n2️⃣ Chat with AI — describe your business\n3️⃣ Website live in minutes!\n4️⃣ Leads come on WhatsApp", ['How much does it cost?', 'Will I rank on Google?', 'Can I use my own domain?']],
  [/seo|google|rank|search/i, "Your website is built for Google from day 1! 📈\n\n• On-page & technical SEO\n• Google Search Console setup\n• Local SEO (near me searches)\n• Monthly SEO reports", ['How long to rank?', 'What is local SEO?', 'How much does it cost?']],
  [/domain|url|\.com|\.in/i, "You get a free subdomain (yourbusiness.scalifyapp.com).\n\nWant your own domain like yourbusiness.com? You can connect it — domain registration is separate (₹500–800/year from any registrar).", ['Is hosting included?', 'How much does it cost?', 'How does it work?']],
];

function faqReply(msg: string): { reply: string; suggestions: string[] } {
  for (const [re, reply, suggestions] of FAQ_REPLIES) {
    if (re.test(msg)) return { reply, suggestions };
  }
  return { reply: "I can help with:\n• **Pricing** — ₹1,499/month\n• **Features** — What's included\n• **SEO** — How we rank you on Google\n• **Getting started** — How it works\n\nAsk me anything! 😊", suggestions: ['How much does it cost?', 'What do I get?', 'How does it work?', 'Will people find me on Google?'] };
}

function FreeChat() {
  const [msgs, setMsgs] = useState([{ sender_type: 'ai' as SenderType, content: "Hey! 👋 Welcome to Scalify!\n\nI'm your pre-sales assistant. Subscribe to **Scalify Pro at ₹1,499/month** to get your AI-built website.\n\nAsk me anything below 👇" }]);
  const [chips, setChips] = useState(['How much does it cost?', 'What do I get?', 'How does it work?', 'Will I rank on Google?']);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const send = (text: string) => {
    if (!text.trim()) return;
    const { reply, suggestions } = faqReply(text);
    setMsgs(prev => [...prev, { sender_type: 'user', content: text }, { sender_type: 'ai', content: reply }]);
    setChips(suggestions);
    setInput('');
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 space-y-3">
        {msgs.map((m, i) => (
          <div key={i} className={`flex items-end gap-2 ${m.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.sender_type !== 'user' && (
              <div className="w-7 h-7 rounded-full bg-primary/20 text-primary text-[10px] font-black flex items-center justify-center flex-shrink-0">S</div>
            )}
            <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              m.sender_type === 'user'
                ? 'bg-primary text-white rounded-br-md'
                : 'bg-zinc-800 text-zinc-100 rounded-bl-md'
            }`}>
              {fmt(m.content)}
            </div>
          </div>
        ))}
        {/* Suggestion chips */}
        <div className="flex flex-wrap gap-2 pt-1 pl-9">
          {chips.map((s, i) => (
            <button key={i} onClick={() => send(s)} className="px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 hover:border-primary/50 hover:text-primary transition-all">
              {s}
            </button>
          ))}
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Upgrade CTA */}
      <div className="px-4 pb-3 pt-2 border-t border-zinc-800">
        <Link href="/dashboard/plans" className="flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-primary/10 border border-primary/30 hover:bg-primary/15 transition group mb-3">
          <div>
            <p className="text-xs font-bold text-primary">Get your website — ₹1,499/mo</p>
            <p className="text-[11px] text-zinc-500">AI builds it in minutes · No coding needed</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary flex-shrink-0 group-hover:translate-x-0.5 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
        <div className="flex gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-2.5">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send(input)}
            placeholder="Ask anything about Scalify..."
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder-zinc-600"
          />
          <button onClick={() => send(input)} className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-primary/90 transition">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PRO USER ─────────────────────────────────────────────────
function ProChat() {
  const { user } = useAuth();
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [website, setWebsite] = useState<Website | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [mode, setMode] = useState<ChatMode>('ai');
  const bottomRef = useRef<HTMLDivElement>(null);

  const scroll = () => setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch('/chat/website');
      setMsgs(data.messages || []);
      setWebsite(data.website || null);
      scroll();
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Realtime updates from admin replies
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel(`user-chat-${user.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload: any) => {
        const msg = payload?.new as Message;
        if (msg && msg.sender_type === 'admin') {
          setMsgs(prev => (prev && prev.find(m => m?.id === msg.id)) ? prev : [...(prev || []), msg]);
          scroll();
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  const send = async () => {
    if (!input.trim() || sending) return;
    const text = input.trim();
    setInput('');
    const userMsg: Message = { sender_type: 'user', content: text, created_at: new Date().toISOString() };
    setMsgs(prev => [...prev, userMsg]);
    scroll();
    setSending(true);
    try {
      const data = await apiFetch('/chat/website', { method: 'POST', body: JSON.stringify({ message: text, mode }) });
      setMsgs(prev => [...prev, { sender_type: data.senderType || 'ai', content: data.reply, created_at: new Date().toISOString() }]);
      if (data.action?.website) setWebsite(data.action.website);
      else if (data.action?.type === 'WEBSITE_CREATED') load();
      scroll();
    } catch (e: any) {
      setMsgs(prev => [...prev, { sender_type: 'ai', content: '❌ ' + (e.message || 'Something went wrong'), created_at: new Date().toISOString() }]);
    } finally { setSending(false); }
  };

  const switchMode = (next: ChatMode) => {
    if (next === mode) return;
    setMode(next);
    const notice: Message = {
      sender_type: 'ai',
      content: next === 'human'
        ? '👨‍💼 Connected to **human support**. Our team will reply shortly — usually within a few hours.'
        : '🤖 Back to **AI Builder**. Ask me anything about your website!',
      created_at: new Date().toISOString(),
    };
    setMsgs(prev => [...prev, notice]);
    scroll();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Website live bar */}
      {website && (
        <div className="mx-4 mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/8 border border-green-500/15">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
          <span className="text-xs font-semibold text-green-400 truncate flex-1">{website.business_name}</span>
          <a href={`https://${website.deployed_url}`} target="_blank" rel="noopener noreferrer" className="text-[11px] text-green-400/70 hover:text-green-400 transition flex-shrink-0">
            View ↗
          </a>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 space-y-2.5">
        {msgs.filter(Boolean).map((m, i) => {
          const isUser = m.sender_type === 'user';
          const isAdmin = m.sender_type === 'admin';
          return (
            <div key={i} className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className={`w-7 h-7 rounded-full text-[10px] font-black flex items-center justify-center flex-shrink-0 ${
                  isAdmin ? 'bg-zinc-700 text-zinc-300' : 'bg-primary/20 text-primary'
                }`}>
                  {isAdmin ? '👨' : 'AI'}
                </div>
              )}
              <div className="max-w-[80%]">
                {isAdmin && <p className="text-[10px] text-zinc-500 mb-0.5 ml-1">Support team</p>}
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isUser ? 'bg-primary text-white rounded-br-md' :
                  isAdmin ? 'bg-zinc-700 text-zinc-100 rounded-bl-md' :
                  'bg-zinc-800 text-zinc-100 rounded-bl-md'
                }`}>
                  {fmt(m.content)}
                </div>
                {m.created_at && (
                  <p className={`text-[10px] text-zinc-600 mt-0.5 ${isUser ? 'text-right' : 'ml-1'}`}>{ts(m.created_at)}</p>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {sending && (
          <div className="flex items-end gap-2 justify-start">
            <div className="w-7 h-7 rounded-full bg-primary/20 text-primary text-[10px] font-black flex items-center justify-center flex-shrink-0">
              {mode === 'human' ? '👨' : 'AI'}
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-zinc-800 border border-zinc-700">
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="px-4 pb-4 pt-2">
        {mode === 'human' && (
          <p className="text-[11px] text-zinc-600 text-center mb-2">Replies within a few hours · All messages saved</p>
        )}
        <div className={`flex gap-2 items-center rounded-2xl px-3 py-2 border transition-all ${
          mode === 'human' ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-900 border-zinc-800 focus-within:border-primary/30'
        }`}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
            placeholder={
              mode === 'human' ? 'Message support team...' :
              website ? 'Ask to make changes...' :
              'Tell me about your business...'
            }
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder-zinc-600 py-1"
            disabled={sending}
          />
          <button
            onClick={send}
            disabled={sending || !input.trim()}
            className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition disabled:opacity-30 ${
              mode === 'human' ? 'bg-zinc-600 hover:bg-zinc-500' : 'bg-primary hover:bg-primary/90'
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Mode toggle — floating at the bottom center, always visible */}
      <div className="pb-4 flex justify-center">
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-full p-0.5 gap-0.5">
          <button
            onClick={() => switchMode('ai')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              mode === 'ai' ? 'bg-primary text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${mode === 'ai' ? 'bg-white' : 'bg-zinc-600'}`} />
            AI Builder
          </button>
          <button
            onClick={() => switchMode('human')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              mode === 'human' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${mode === 'human' ? 'bg-green-400' : 'bg-zinc-600'}`} />
            Support
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page shell ───────────────────────────────────────────────
export default function ChatPage() {
  const { user } = useAuth();
  const isPro = user?.plan === 'pro';

  return (
    <div className="flex flex-col bg-bg" style={{ height: 'calc(100dvh - 112px)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
          isPro ? 'bg-primary/15 text-primary' : 'bg-zinc-800 text-zinc-300'
        }`}>
          {isPro ? 'AI' : 'S'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold">{isPro ? 'Scalify AI Builder' : 'Scalify Assistant'}</p>
          <p className="text-[11px] text-zinc-500">
            {isPro ? 'Your website · All chats saved' : 'Questions? Ask me anything'}
          </p>
        </div>
        {isPro && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-[11px] font-semibold text-primary">Pro</span>
          </div>
        )}
      </div>

      {/* Chat body */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {isPro ? <ProChat /> : <FreeChat />}
      </div>
    </div>
  );
}
