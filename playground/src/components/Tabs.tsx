'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState<string>(
    defaultTab || tabs[0]?.id || ''
  );
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    tabsRef.current = tabsRef.current.slice(0, tabs.length);
  }, [tabs]);

  return (
    <div className="w-full">
      {/* Tab Navigation Header */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 space-x-2">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabsRef.current[index] = el;
              }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                isActive
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Panel */}
      <div className="py-4">
        {tabs.map((tab) => {
          if (tab.id !== activeTab) return null;
          return (
            <div key={tab.id} className="focus:outline-none">
              {tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Tabs;