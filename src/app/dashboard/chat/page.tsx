'use client';

import { useAuth } from '../../../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../../../lib/api';
interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_type: 'user' | 'ai' | 'admin';
  content: string;
  created_at: string;
}

// Simple markdown-like rendering for bold text
function formatMessage(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [aiDisabled, setAiDisabled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPro = user?.plan === 'pro' || user?.plan === 'trial';

  useEffect(() => {
    // Load existing conversations
    apiFetch('/chat/conversations')
      .then((data) => {
        if (data?.conversations?.length > 0) {
          const conv = data.conversations[0];
          setConversationId(conv.id);
          loadMessages(conv.id);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async (convId: string) => {
    try {
      const data = await apiFetch(`/chat/history/${convId}`);
      if (data?.messages) setMessages(data.messages);
    } catch {}
  };

  const sendMessage = async (directMessage?: string) => {
    const msg = directMessage || input.trim();
    if (!msg || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      conversation_id: conversationId || '',
      sender_id: user?.id || '',
      sender_type: 'user',
      content: msg,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setSuggestions([]);

    try {
      const endpoint = isPro ? '/chat/message' : '/chat/sales';
      const body = isPro
        ? { message: userMsg.content, conversationId }
        : { message: userMsg.content };

      const data = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (data?.conversationId) setConversationId(data.conversationId);
      if (data?.suggestions) setSuggestions(data.suggestions);
      if (data?.ai_disabled) setAiDisabled(true);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        conversation_id: data?.conversationId || '',
        sender_id: 'ai',
        sender_type: 'ai',
        content: data?.reply || data?.message || 'Sorry, something went wrong.',
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        conversation_id: '',
        sender_id: 'ai',
        sender_type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)] md:h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold">AI Chat</h1>
          <p className="text-xs md:text-sm text-zinc-500">Chat with our AI to create or edit your website</p>
        </div>
        {aiDisabled && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400/10 border border-yellow-400/30 rounded-full text-yellow-400 text-xs font-bold">
            🧑‍💼 Human Support
          </span>
        )}
      </div>

      {/* Human-only notice */}
      {aiDisabled && (
        <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-4 py-2.5 mb-3 text-yellow-400">
          <span className="text-base">🧑‍💼</span>
          <p className="text-xs">Our support team will reply to your messages manually. Response time: a few hours.</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-xl bg-card border border-border p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="13" rx="3"/><circle cx="9" cy="13" r="1.5" fill="currentColor"/><circle cx="15" cy="13" r="1.5" fill="currentColor"/><path d="M8 3v3M16 3v3"/><path d="M9 17h6"/></svg></div>
            <h3 className="text-lg font-semibold mb-2">
              {isPro ? 'Start building your website' : 'Hey! 👋 Ask me anything'}
            </h3>
            <p className="text-sm text-zinc-500 max-w-md mx-auto mb-6">
              {isPro
                ? "Tell me about your business and I'll create a professional website for you in seconds."
                : 'Learn about ScalifyX, pricing, features, and how we can help your business grow online.'}
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
              {(isPro
                ? ['I want to create a website', 'I have a restaurant', 'I run a salon', 'Help me edit my site']
                : ['How much does it cost?', 'What do I get in the plan?', 'How does it work?', 'Will my site rank on Google?']
              ).map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="px-3 py-1.5 text-xs rounded-full bg-surface border border-border text-zinc-300 hover:border-primary hover:text-primary transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-xl text-sm leading-relaxed ${
                msg.sender_type === 'user'
                  ? 'bg-primary text-white rounded-br-sm'
                  : 'bg-surface text-zinc-200 rounded-bl-sm border border-border'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.sender_type === 'ai' ? formatMessage(msg.content) : msg.content}</div>
              <div className={`text-xs mt-1 ${msg.sender_type === 'user' ? 'text-primary-light' : 'text-zinc-600'}`}>
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-xl bg-surface border border-border">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Suggestion chips after AI response */}
        {!loading && suggestions.length > 0 && messages.length > 0 && (
          <div className="flex flex-wrap gap-2 pl-1">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="px-3 py-1.5 text-xs rounded-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="Describe your business or ask me anything..."
          className="flex-1 px-4 py-3 bg-card border border-border rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-primary transition"
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
