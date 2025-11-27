'use client';

import { useState, useEffect, useRef } from 'react';

// TypeScript: Define what a stock result looks like
interface Stock {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
}

// TypeScript: Define what props this component accepts
interface StockSearchProps {
  onStockSelect: (stock: Stock) => void;  // Function called when user selects a stock
}

/**
 * StockSearch Component
 *
 * Autocomplete search input that lets users search for stocks by company name.
 * Features:
 * - Debounced search (waits 300ms after typing stops before searching)
 * - Dropdown results with company name + symbol
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Click outside to close
 * - Loading/error/empty states
 */
export default function StockSearch({ onStockSelect }: StockSearchProps) {
  // STATE 1: What the user has typed in the search box
  const [query, setQuery] = useState('');

  // STATE 2: Array of stock results from the API
  const [results, setResults] = useState<Stock[]>([]);

  // STATE 3: Is the search currently loading?
  const [loading, setLoading] = useState(false);

  // STATE 4: Is the dropdown open?
  const [isOpen, setIsOpen] = useState(false);

  // STATE 5: Which result is highlighted (for keyboard navigation)
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // STATE 6: Error message if search fails
  const [error, setError] = useState<string | null>(null);

  // REF: Reference to the container (for click-outside detection)
  const containerRef = useRef<HTMLDivElement>(null);

  // REF: Reference to the input element
  const inputRef = useRef<HTMLInputElement>(null);

  // EFFECT 1: Debounced search (wait 300ms after user stops typing)
  useEffect(() => {
    // Don't search if query is too short
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      setError(null);
      return;
    }

    // Set loading state immediately
    setLoading(true);
    setError(null);

    // Wait 300ms before searching (debounce)
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/stock-search?q=${encodeURIComponent(query)}`);

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();

        setResults(data.results || []);
        setIsOpen(true);
        setHighlightedIndex(0);
        setLoading(false);

      } catch (err) {
        console.error('Stock search error:', err);
        setError('Search failed. Please try again.');
        setResults([]);
        setLoading(false);
      }
    }, 300);

    // Cleanup: Cancel the timer if user types again before 300ms
    return () => clearTimeout(timer);
  }, [query]);

  // EFFECT 2: Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // HANDLER: Keyboard navigation (Arrow keys, Enter, Escape)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % results.length);
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + results.length) % results.length);
        break;

      case 'Enter':
        e.preventDefault();
        if (results[highlightedIndex]) {
          handleStockSelect(results[highlightedIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  // HANDLER: What happens when user selects a stock
  const handleStockSelect = (stock: Stock) => {
    onStockSelect(stock);
    setQuery(''); // Clear search input
    setResults([]); // Clear results
    setIsOpen(false); // Close dropdown
    setError(null);
  };

  return (
    <div className="mb-8" ref={containerRef}>
      {/* Label */}
      <label className="block text-[11px] uppercase tracking-wide text-[#666666] font-medium mb-2">
        Stock Search
      </label>

      {/* Search Input Container */}
      <div className="relative">
        <div className="flex items-stretch gap-0 border border-[#D0D0D0]">
          {/* Search Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search stocks by company name (e.g., Tesla, Apple)..."
            className="flex-1 h-10 px-4 text-[15px] text-black
                       placeholder:text-[#666666] bg-white border-0
                       outline-none focus:bg-[#F5F5F5]
                       transition-colors duration-150"
          />
        </div>

        {/* Dropdown Results */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-[#D0D0D0] max-h-[320px] overflow-y-auto">
            {/* Loading State */}
            {loading && (
              <div className="px-4 py-3 text-[13px] text-[#666666]">
                Searching...
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="px-4 py-3 text-[13px] text-[#B85C00]">
                {error}
              </div>
            )}

            {/* No Results */}
            {!loading && !error && results.length === 0 && query.length >= 2 && (
              <div className="px-4 py-3 text-[13px] text-[#666666]">
                No stocks found for &quot;{query}&quot;
              </div>
            )}

            {/* Results List */}
            {!loading && !error && results.length > 0 && results.map((stock, index) => (
              <button
                key={stock.symbol}
                onClick={() => handleStockSelect(stock)}
                className={`w-full px-4 py-3 text-left transition-colors duration-100 border-b border-[#D0D0D0] last:border-b-0
                  ${index === highlightedIndex
                    ? 'bg-[#ed8008] text-black'
                    : 'bg-white text-black hover:bg-[#F5F5F5]'
                  }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[15px] font-medium">
                    {stock.name}
                  </span>
                  <span className="text-[13px] text-[#666666]">
                    {stock.symbol}
                  </span>
                </div>
                <div className="text-[11px] text-[#666666] mt-1">
                  {stock.exchange}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Helper Text */}
      <p className="mt-2 text-[11px] text-[#666666]">
        Type at least 2 characters to search for stocks.
      </p>
    </div>
  );
}
