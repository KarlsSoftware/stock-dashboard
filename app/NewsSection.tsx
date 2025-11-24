/**
 * News Section with Tabs
 *
 * Displays news from two sources in a tabbed interface:
 * - GDELT: Commodity-specific news based on keywords
 * - TradingView: General market news and top stories
 *
 * Features:
 * - Clean tab switching
 * - Honey yellow accent for active tab (Dieter Rams style)
 * - Fully responsive
 */

"use client";

import { useState } from 'react';
import NewsList from './NewsList';
import TradingViewStories from './TradingViewStories';

type Props = {
  keywords: string;
  commodityName: string;
  symbol: string; // Yahoo Finance symbol for TradingView mapping
};

type TabType = 'commodity' | 'market';

export default function NewsSection({ keywords, commodityName, symbol }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('commodity');

  return (
    <div className="mt-8">
      {/* Tab Navigation */}
      <div className="bg-[#F5F5F5] p-3 pb-0">
        <div className="flex gap-1 border-b border-[#D0D0D0]">
          <button
            onClick={() => setActiveTab('commodity')}
            className={`
              px-4 py-2 text-[13px] font-medium uppercase tracking-wide
              transition-colors relative
              ${activeTab === 'commodity'
                ? 'bg-[#ed8008] text-black'
                : 'bg-white text-black hover:bg-[#F5F5F5]'
              }
            `}
          >
            Commodity News
            {activeTab === 'commodity' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ed8008]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('market')}
            className={`
              px-4 py-2 text-[13px] font-medium uppercase tracking-wide
              transition-colors relative
              ${activeTab === 'market'
                ? 'bg-[#ed8008] text-black'
                : 'bg-white text-black hover:bg-[#F5F5F5]'
              }
            `}
          >
            Market News
            {activeTab === 'market' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ed8008]" />
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-0">
        {activeTab === 'commodity' && (
          <NewsList keywords={keywords} commodityName={commodityName} />
        )}
        {activeTab === 'market' && (
          <TradingViewStories commodityName={commodityName} symbol={symbol} />
        )}
      </div>
    </div>
  );
}
