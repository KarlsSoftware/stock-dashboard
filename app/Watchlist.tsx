'use client';

import { useState, useEffect } from 'react';
import { useWatchlist, WatchlistItem } from './hooks/useWatchlist';

interface WatchlistProps {
  onSelectItem: (item: WatchlistItem) => void;
}

export default function Watchlist({ onSelectItem }: WatchlistProps) {
  const { watchlist, removeFromWatchlist, loading } = useWatchlist();
  const [isExpanded, setIsExpanded] = useState(true);

  // Load collapse state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('watchlist-expanded');
    if (stored !== null) {
      setIsExpanded(stored === 'true');
    }
  }, []);

  // Save collapse state to localStorage
  useEffect(() => {
    localStorage.setItem('watchlist-expanded', String(isExpanded));
  }, [isExpanded]);

  if (loading) {
    return (
      <div className="text-[13px] text-[#666666] p-3">
        Loading watchlist...
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div className="text-[13px] text-[#666666] p-3">
        No items in watchlist. Add favorites to see them here.
      </div>
    );
  }

  return (
    <div className="border-t border-[#D0D0D0]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 text-[11px] uppercase tracking-wide text-[#666666] font-medium hover:bg-[#F5F5F5] transition-colors duration-100 text-left flex items-center justify-between"
      >
        <span>Watchlist ({watchlist.length})</span>
        <span className="text-[13px]">{isExpanded ? '▼' : '▶'}</span>
      </button>
      {isExpanded && (
        <div className="flex flex-col gap-0">
          {watchlist.map((item) => (
            <div
              key={item.symbol}
              className="flex items-center justify-between px-3 py-2 border-t border-[#D0D0D0] hover:bg-[#F5F5F5] transition-colors duration-100"
            >
              <button
                onClick={() => onSelectItem(item)}
                className="flex-1 text-left"
              >
                <div className="text-[13px] font-medium text-black">
                  {item.name} ({item.symbol})
                </div>
                <div className="text-[11px] text-[#666666]">
                  {item.type === 'stock' && item.exchange
                    ? `Stock · ${item.exchange}`
                    : 'Commodity'}
                </div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromWatchlist(item.symbol);
                }}
                className="ml-2 text-[#666666] hover:text-black text-[16px] leading-none transition-colors duration-100"
                aria-label="Remove from watchlist"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
