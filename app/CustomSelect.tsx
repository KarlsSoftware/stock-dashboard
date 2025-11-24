/**
 * Custom Select Dropdown Component
 *
 * A fully custom dropdown that replaces native <select>.
 * Built for full styling control and better mobile UX.
 *
 * Features:
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Click outside to close
 * - Touch-friendly (44px min touch targets)
 * - Fully accessible (ARIA labels)
 * - Matches minimalist design system
 */

"use client";

import { useState, useRef, useEffect } from 'react';

type Option = {
  label: string; // What user sees
  value: string; // Actual value
};

type CustomSelectProps = {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  id: string;
};

export default function CustomSelect({ label, options, value, onChange, id }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlight when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  // Handle keyboard navigation (Arrow keys, Enter, Escape)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
      e.preventDefault();
      setIsOpen(true);
      return;
    }

    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < options.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          onChange(options[highlightedIndex].value);
          setIsOpen(false);
        }
        break;
    }
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="flex-1">
      <label htmlFor={id} className="block text-[13px] font-medium text-black mb-2 uppercase tracking-wide">
        {label}
      </label>

      <div ref={containerRef} className="relative">
        <button
          id={id}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className="block w-full px-3 py-2 text-[13px] border border-[#D0D0D0] bg-white text-black text-left focus:outline-none focus:border-black transition-colors touch-manipulation"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="flex items-center justify-between">
            <span>{selectedOption?.label}</span>
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {isOpen && (
          <div
            className="absolute z-50 w-full mt-1 bg-white border border-[#D0D0D0] max-h-[300px] overflow-auto"
            role="listbox"
          >
            {options.map((option, index) => (
              <div
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`
                  px-3 py-2 min-h-[44px] flex items-center text-[13px] cursor-pointer transition-colors
                  ${option.value === value ? 'bg-[#ed8008] text-black' : 'text-black'}
                  ${highlightedIndex === index && option.value !== value ? 'bg-[#F5F5F5]' : ''}
                  ${option.value !== value ? 'hover:bg-[#F5F5F5]' : ''}
                `}
                role="option"
                aria-selected={option.value === value}
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
