'use client';

import React, { useState } from 'react';

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  status?: 'pending' | 'sent' | 'error';
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsgId = Date.now().toString();
    const newMsg: Message = { id: userMsgId, sender: 'user', text: textToSend, status: 'sent' };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.text || 'Response received.',
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError('Message delivery failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleRetry = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user');
    if (lastUserMsg) {
      sendMessage(lastUserMsg.text);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-2xl mx-auto border border-slate-800 bg-slate-900 rounded-2xl p-4 text-white">
      <div className="pb-3 border-b border-slate-800 mb-4">
        <h2 className="text-xl font-bold">Start a Conversation</h2>
        <p className="text-xs text-slate-400">FE-09 Validated AI Chat Renderer</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 my-auto pt-10">
            Start a conversation by typing below.
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-200 border border-slate-700'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-slate-400 rounded-xl px-4 py-2 text-sm italic border border-slate-700">
              Thinking and streaming tokens...
            </div>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-2 p-3 bg-rose-950/40 border border-rose-800/50 rounded-xl my-2">
            <span className="text-xs text-rose-400 font-medium">{error}</span>
            <button
              onClick={handleRetry}
              type="button"
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Retry Message
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleFormSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your prompt..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white font-semibold text-sm px-5 py-2 rounded-xl transition-all"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatInterface;