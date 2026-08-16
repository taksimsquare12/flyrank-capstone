import React, { useState, useId } from 'react';

interface DisclosureProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const Disclosure: React.FC<DisclosureProps> = ({
  title,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const contentId = useId();
  const buttonId = useId();

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden mb-2">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex justify-between items-center p-4 text-left font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <span>{title}</span>
          <span className="ml-2 transform transition-transform duration-200">
            {isOpen ? '▲' : '▼'}
          </span>
        </button>
      </h3>
      <div
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        className="p-4 bg-white text-gray-700"
      >
        {children}
      </div>
    </div>
  );
};