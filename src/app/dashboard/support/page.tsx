'use client';

import { useState, useRef, useEffect } from 'react';
import { apiFetch } from '../../../lib/api';
import type { Message } from '@shared/types';

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      conversation_id: '',
      sender_id: 'user',
      sender_type: 'user',
      content: input.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      await apiFetch('/chat/notify-admin', {
        method: 'POST',
        body: JSON.stringify({ message: userMsg.content }),
      });

      const reply: Message = {
        id: (Date.now() + 1).toString(),
        conversation_id: '',
        sender_id: 'support',
        sender_type: 'admin',
        content: 'Your message has been sent to our support team. We\'ll get back to you shortly!',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, reply]);
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        conversation_id: '',
        sender_id: 'support',
        sender_type: 'admin',
        content: 'Failed to send message. Please try again.',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="mb-4">
        <h1 className="text-xl font-bold">Support</h1>
        <p className="text-sm text-zinc-500">Get help from our support team</p>
      </div>

      <div className="flex-1 overflow-y-auto rounded-xl bg-card border border-border p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-20">
            <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/><path d="M8 10h8M8 14h4"/></svg></div>
            <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-zinc-500 max-w-md mx-auto">
              Send us a message and our support team will get back to you shortly.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] px-4 py-3 rounded-xl text-sm ${
              msg.sender_type === 'user'
                ? 'bg-primary text-white rounded-br-sm'
                : 'bg-surface text-zinc-200 rounded-bl-sm border border-border'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <div className="mt-4 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
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
