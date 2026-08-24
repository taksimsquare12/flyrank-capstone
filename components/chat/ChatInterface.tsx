'use client';

import React, { useState, useRef, useEffect } from 'react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (userPrompt: string, isRetry = false) => {
    if (!userPrompt.trim() || isLoading) return;

    setErrorState(null);

    let updatedMessages = messages;
    if (!isRetry) {
      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: userPrompt.trim(),
      };
      updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setInput('');
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages.filter((m) => !m.isError) }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev.filter((m) => !m.isError),
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.text || 'Response completed.',
        },
      ]);
    } catch (err: any) {
      setErrorState(err.message || 'Network request failed');
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '⚠️ Message delivery failed. Please check your network connection or try again.',
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMessage) {
      setMessages((prev) => prev.filter((m) => !m.isError));
      sendMessage(lastUserMessage.content, true);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] w-full max-w-3xl mx-auto border rounded-2xl bg-white shadow-xl dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-emerald-600 text-white flex justify-between items-center">
        <h2 className="font-semibold text-lg">AI Capstone Assistant</h2>
        <span className="text-xs bg-emerald-700 px-2.5 py-1 rounded-full font-mono">
          FE-08 Error & Edge Protected
        </span>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {/* Designed Empty State */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 px-4">
            <div className="p-4 bg-emerald-100 dark:bg-emerald-950/60 rounded-full mb-3 text-emerald-600 dark:text-emerald-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              Start a Conversation
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mb-6">
              Ask questions about your project, request code reviews, or evaluate an audit score.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                'Show audit score breakdown',
                'Analyze frontend code architecture',
                'Test API error handling',
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(suggestion)}
                  className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-500 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages Rendering */}
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.isError
                  ? 'bg-red-50 text-red-900 border border-red-200 dark:bg-red-950/40 dark:border-red-800 dark:text-red-200'
                  : m.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none'
                  : 'bg-white text-gray-900 border border-gray-200 shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-bl-none'
              }`}
            >
              {m.content}

              {/* Retry Button for Failed State */}
              {m.isError && (
                <div className="mt-3">
                  <button
                    onClick={handleRetry}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md transition-colors"
                  >
                    🔄 Retry Message
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 border rounded-2xl px-4 py-3 text-sm text-gray-500 animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-600 rounded-full animate-ping"></span>
              Thinking and streaming tokens...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="p-3 border-t bg-white dark:bg-gray-950 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
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