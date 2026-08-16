import React, { useState, useRef, KeyboardEvent } from 'react';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultTabId?: string;
}

export const Tabs: React.FC<TabsProps> = ({ items, defaultTabId }) => {
  const [activeTabId, setActiveTabId] = useState<string>(
    defaultTabId || items[0]?.id || ''
  );
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;

    if (event.key === 'ArrowRight') {
      nextIndex = (index + 1) % items.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + items.length) % items.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = items.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextTab = items[nextIndex];
    setActiveTabId(nextTab.id);
    tabRefs.current[nextTab.id]?.focus();
  };

  return (
    <div className="w-full">
      <div role="tablist" aria-label="Accessible Tabs Example" className="flex border-b border-gray-200 gap-2">
        {items.map((item, index) => {
          const isSelected = item.id === activeTabId;
          return (
            <button
              key={item.id}
              ref={(el) => (tabRefs.current[item.id] = el)}
              role="tab"
              aria-selected={isSelected}
              aria-controls={`panel-${item.id}`}
              id={`tab-${item.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setActiveTabId(item.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`px-4 py-2 text-sm font-medium focus:outline-none border-b-2 ${
                isSelected
                  ? 'border-emerald-600 text-emerald-600 font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => {
        const isSelected = item.id === activeTabId;
        return (
          <div
            key={item.id}
            id={`panel-${item.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${item.id}`}
            hidden={!isSelected}
            tabIndex={0}
            className="p-4 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
};