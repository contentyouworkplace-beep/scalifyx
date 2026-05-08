'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const MOCK_CONVERSATIONS = [
  {
    id: '1',
    name: 'E-Commerce Platform',
    lastMessage: 'We've completed the design mockups. Please review and provide feedback.',
    timestamp: '2 hours ago',
    unread: true,
  },
  {
    id: '2',
    name: 'Restaurant Website',
    lastMessage: 'Perfect! We'll start development next week.',
    timestamp: '1 day ago',
    unread: false,
  },
  {
    id: '3',
    name: 'Portfolio Website',
    lastMessage: 'Your website is live! Check it out at yourwebsite.com',
    timestamp: '3 days ago',
    unread: false,
  },
];

const MOCK_MESSAGES = [
  {
    id: '1',
    sender: 'You',
    text: 'Hi! When can we start working on the design?',
    timestamp: '2026-05-05 10:30',
    isYours: true,
  },
  {
    id: '2',
    sender: 'Design Team',
    text: 'Great question! We can start tomorrow. We\'ll begin with the discovery meeting.',
    timestamp: '2026-05-05 11:15',
    isYours: false,
  },
  {
    id: '3',
    sender: 'Design Team',
    text: 'We\'ve completed the design mockups. Please review and provide feedback.',
    timestamp: '2026-05-07 14:30',
    isYours: false,
  },
];

export default function MessagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
    if (MOCK_CONVERSATIONS.length > 0 && !selectedConversation) {
      setSelectedConversation(MOCK_CONVERSATIONS[0].id);
    }
  }, [user, loading, router, selectedConversation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-zinc-700 border-t-green-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const currentConversation = MOCK_CONVERSATIONS.find((c) => c.id === selectedConversation);

  return (
    <div className="min-h-screen bg-bg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 max-w-7xl mx-auto">
        {/* Conversations List */}
        <div className="md:col-span-1 border-r border-border bg-card/50 h-screen md:h-auto overflow-y-auto">
          <div className="p-4 border-b border-border">
            <h2 className="text-xl font-bold text-white">Messages</h2>
          </div>
          <div className="divide-y divide-border">
            {MOCK_CONVERSATIONS.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`w-full text-left p-4 transition ${
                  selectedConversation === conversation.id
                    ? 'bg-green-500/10 border-l-2 border-l-green-500'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-white text-sm">{conversation.name}</h3>
                  {conversation.unread && (
                    <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-zinc-400 line-clamp-1 mb-2">{conversation.lastMessage}</p>
                <p className="text-xs text-zinc-500">{conversation.timestamp}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 flex flex-col h-screen">
          {currentConversation ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-border bg-card/50">
                <h3 className="font-bold text-white">{currentConversation.name}</h3>
                <p className="text-xs text-zinc-400">Project Discussion</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {MOCK_MESSAGES.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isYours ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs rounded-lg px-4 py-2 ${
                        msg.isYours
                          ? 'bg-green-500/20 border border-green-500/30 text-white'
                          : 'bg-zinc-800 border border-border text-zinc-200'
                      }`}
                    >
                      <p className="text-xs font-semibold text-zinc-400 mb-1">{msg.sender}</p>
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs text-zinc-500 mt-1">{msg.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border bg-card/50">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-lg border border-border bg-inputBg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-green-500/50 focus:outline-none transition"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && messageText.trim()) {
                        setMessageText('');
                      }
                    }}
                  />
                  <button
                    disabled={!messageText.trim()}
                    className="px-4 py-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-400 transition disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-zinc-400">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
