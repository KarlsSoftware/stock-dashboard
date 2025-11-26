"use client";

import { useState, useRef, useEffect } from 'react';

type Option = {
  label: string; // Text shown to user (e.g., "Gold")
  value: string; // Value we store (e.g., "Gold")
};

type CustomSelectProps = {
  label: string;           // Label above dropdown (e.g., "Category")
  options: Option[];       // List of choices
  value: string;           // Currently selected value
  onChange: (value: string) => void;  // Function to call when selection changes
  id: string;             // HTML id for accessibility
};

export default function CustomSelect({ label, options, value, onChange, id }: CustomSelectProps) {

  // STATE 1: Is the dropdown open or closed?
  const [isOpen, setIsOpen] = useState(false);

  // REF: Reference to the dropdown container (for click-outside detection)
  const containerRef = useRef<HTMLDivElement>(null);

  // HELPER: Find which option is currently selected
  const selectedOption = options.find(opt => opt.value === value);

  // EFFECT: Close dropdown when user clicks outside
  useEffect(() => {
    // This function checks if click was outside dropdown
    const handleClickOutside = (event: MouseEvent) => {
      // If click is outside our container, close dropdown
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Listen for all clicks on the page
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup: Remove listener when component unmounts
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // HANDLER: What happens when user clicks an option
  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);  // Tell parent component about the change
    setIsOpen(false);       // Close the dropdown
  };

  return (
    <div className="flex-1">

      {/* LABEL: Text above the dropdown */}
      <label
        htmlFor={id}
        className="block text-[13px] font-medium text-black mb-2 uppercase tracking-wide"
      >
        {label}
      </label>

      {/* DROPDOWN CONTAINER: Holds button and options list */}
      <div ref={containerRef} className="relative">

        {/* BUTTON: Shows selected value, click to open/close */}
        <button
          id={id}
          type="button"
          onClick={() => setIsOpen(!isOpen)}  // Toggle open/closed
          className="block w-full px-3 py-2 text-[13px] border border-[#D0D0D0] bg-white text-black text-left focus:outline-none focus:border-black transition-colors touch-manipulation"
        >
          <div className="flex items-center justify-between">
            {/* Show selected option label */}
            <span>{selectedOption?.label}</span>

            {/* Arrow icon (points down when closed, up when open) */}
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* OPTIONS LIST: Only show when isOpen is true */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-[#D0D0D0] max-h-[300px] overflow-auto">

            {/* Loop through all options and create clickable items */}
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={`
                  px-3 py-2 min-h-[44px] flex items-center text-[13px] cursor-pointer transition-colors
                  ${option.value === value
                    ? 'bg-[#ed8008] text-black'    // Selected: Honey yellow background
                    : 'text-black hover:bg-[#F5F5F5]'  // Not selected: Gray on hover
                  }
                `}
              >
                {option.label}
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}

