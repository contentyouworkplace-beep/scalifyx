'use client';

import { useAuth } from '../../../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../../../lib/api';
import type { Message } from '@shared/types';

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      conversation_id: conversationId || '',
      sender_id: user?.id || '',
      sender_type: 'user',
      content: input.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const isPro = user?.plan === 'pro' || user?.plan === 'trial';
      const endpoint = isPro ? '/chat/message' : '/chat/sales';
      const body = isPro
        ? { message: userMsg.content, conversationId }
        : { message: userMsg.content };

      const data = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (data?.conversationId) setConversationId(data.conversationId);

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
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-xl bg-card border border-border p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-20">
            <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="13" rx="3"/><circle cx="9" cy="13" r="1.5" fill="currentColor"/><circle cx="15" cy="13" r="1.5" fill="currentColor"/><path d="M8 3v3M16 3v3"/><path d="M9 17h6"/></svg></div>
            <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
            <p className="text-sm text-zinc-500 max-w-md mx-auto">
              Tell me about your business and I&apos;ll create a professional website for you in seconds.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[70%] px-4 py-3 rounded-xl text-sm leading-relaxed ${
                msg.sender_type === 'user'
                  ? 'bg-primary text-white rounded-br-sm'
                  : 'bg-surface text-zinc-200 rounded-bl-sm border border-border'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
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
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
