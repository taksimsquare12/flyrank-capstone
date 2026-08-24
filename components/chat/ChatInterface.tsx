'use client';

import React, { useState, useRef, useEffect } from 'react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();

      if (response.ok && data.text) {
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), role: 'assistant', content: data.text },
        ]);
      } else {
        throw new Error(data.error || 'Failed to fetch response');
      }
    } catch (error) {
      console.error('Chat submit error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '⚠️ Response generate nahi ho saka. Key ya network check karein.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] w-full max-w-3xl mx-auto border rounded-2xl bg-white shadow-xl dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
      <div className="p-4 border-b bg-emerald-600 text-white flex justify-between items-center">
        <h2 className="font-semibold text-lg">AI Capstone Assistant</h2>
        <span className="text-xs bg-emerald-700 px-2.5 py-1 rounded-full font-mono">
          Gemini 1.5 Flash
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none'
                  : 'bg-white text-gray-900 border border-gray-200 shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-bl-none'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border rounded-2xl px-4 py-3 text-sm animate-pulse">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t bg-white dark:bg-gray-950 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 px-4 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:bg-gray-900 dark:text-white"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-5 py-2 bg-emerald-600 text-white text-sm rounded-xl hover:bg-emerald-700 disabled:opacity-50 font-medium"
        >
          Send
        </button>
      </form>
    </div>
  );
}