'use client';

import React, { useState } from 'react';

type ButtonState = 'idle' | 'loading' | 'success' | 'error';

export function InteractiveButton() {
  const [state, setState] = useState<ButtonState>('idle');
  const [forcedOutcome, setForcedOutcome] = useState<'random' | 'success' | 'error'>('random');

  const handleClick = async () => {
    if (state === 'loading') return;

    setState('loading');

    // Simulate async API call delay (1.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let isSuccess = true;
    if (forcedOutcome === 'success') {
      isSuccess = true;
    } else if (forcedOutcome === 'error') {
      isSuccess = false;
    } else {
      isSuccess = Math.random() > 0.2; // 80% success rate
    }

    if (isSuccess) {
      setState('success');
      setTimeout(() => setState('idle'), 2000);
    } else {
      setState('error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-2xl border border-slate-800 text-white max-w-md mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-bold">FE-AA1: Motion Micro-Interaction</h3>
        <p className="text-xs text-slate-400">Choreographed state transitions with fallback triggers</p>
      </div>

      {/* Trigger Mode Controls */}
      <div className="flex items-center gap-2 text-xs bg-slate-800 p-1.5 rounded-xl border border-slate-700">
        <span className="text-slate-400 pl-2">Force State:</span>
        <button
          onClick={() => setForcedOutcome('random')}
          className={`px-2.5 py-1 rounded-lg transition-all ${
            forcedOutcome === 'random' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400 hover:text-white'
          }`}
        >
          Random (20% Err)
        </button>
        <button
          onClick={() => setForcedOutcome('success')}
          className={`px-2.5 py-1 rounded-lg transition-all ${
            forcedOutcome === 'success' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400 hover:text-white'
          }`}
        >
          Force Success
        </button>
        <button
          onClick={() => setForcedOutcome('error')}
          className={`px-2.5 py-1 rounded-lg transition-all ${
            forcedOutcome === 'error' ? 'bg-red-600 text-white font-medium' : 'text-slate-400 hover:text-white'
          }`}
        >
          Force Error
        </button>
      </div>

      {/* The Core Motion Button */}
      <button
        onClick={handleClick}
        disabled={state === 'loading'}
        aria-label="Send Message AI Motion Button"
        className={`relative group overflow-hidden px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/50 motion-reduce:transition-none motion-reduce:transform-none ${
          state === 'idle'
            ? 'bg-emerald-600 hover:bg-emerald-500 hover:-translate-y-0.5 shadow-lg shadow-emerald-900/30 text-white'
            : state === 'loading'
            ? 'bg-emerald-700 text-emerald-200 cursor-wait'
            : state === 'success'
            ? 'bg-emerald-500 text-white scale-105'
            : 'bg-rose-600 hover:bg-rose-500 text-white animate-shake motion-reduce:animate-none'
        }`}
      >
        <div className="flex items-center justify-center gap-2 min-w-[120px]">
          {/* Idle State */}
          {state === 'idle' && (
            <span className="flex items-center gap-2 transition-opacity duration-200">
              <span>Send Message</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          )}

          {/* Loading State Spinner */}
          {state === 'loading' && (
            <span className="flex items-center gap-2 transition-opacity duration-200">
              <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Sending...</span>
            </span>
          )}

          {/* Success State */}
          {state === 'success' && (
            <span className="flex items-center gap-2 transition-all duration-300 transform scale-100">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              <span>Sent!</span>
            </span>
          )}

          {/* Error / Retry State */}
          {state === 'error' && (
            <span className="flex items-center gap-2 transition-opacity duration-200">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Retry Send</span>
            </span>
          )}
        </div>
      </button>

      {/* Motion Duration & Easing Note */}
      <div className="text-[11px] text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed">
        <p><strong>Motion Architecture Note:</strong> Uses <code className="text-emerald-400">cubic-bezier(0.16, 1, 0.3, 1)</code> easing over 300ms for snappy, natural spring physics. Hover transforms utilize GPU-accelerated <code className="text-emerald-400">translate-y</code> & <code className="text-emerald-400">scale</code> without triggering layout recalculations. Includes <code className="text-emerald-400">motion-reduce</code> safeguards.</p>
      </div>
    </div>
  );
}