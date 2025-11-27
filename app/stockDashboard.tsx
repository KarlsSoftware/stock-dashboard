/**
 * Stock Dashboard Component
 *
 * Main dashboard that displays:
 * - Stock search with autocomplete
 * - Category and commodity selector dropdowns (commodity mode)
 * - Price chart with timeframe controls
 * - News section with GDELT articles
 * - Legal disclaimer footer
 *
 * State management:
 * - mode: 'commodity' or 'stock' (determines which UI to show)
 * - selectedCategory: Which commodity category (e.g., "Precious Metals")
 * - selectedCommodity: Which specific commodity (e.g., Gold)
 * - selectedStock: Which stock is selected (e.g., { symbol: "AAPL", name: "Apple Inc." })
 */

"use client";
import { useState, useMemo } from 'react';
import LightweightChart from "./lightweightChart";
import CustomSelect from "./CustomSelect";
import NewsList from "./NewsList";
import StockSearch from "./StockSearch";
import Watchlist from "./Watchlist";
import { WatchlistProvider, useWatchlist } from './hooks/useWatchlist';
import { commodityCategories } from "./commodityConfig";
import { generateStockKeywords } from "./utils/generateStockKeywords";

// TypeScript: Define mode type
type Mode = 'commodity' | 'stock';

function StockDashboardContent() {
  // STATE 1: Mode (are we viewing a commodity or a stock?)
  const [mode, setMode] = useState<Mode>('commodity');

  // STATE 2: Track which category and commodity are currently selected
  const [selectedCategory, setSelectedCategory] = useState(commodityCategories[0].name);
  const [selectedCommodity, setSelectedCommodity] = useState(commodityCategories[0].commodities[0]);

  // STATE 3: Track which stock is selected (null when in commodity mode)
  const [selectedStock, setSelectedStock] = useState<{
    symbol: string;
    name: string;
    exchange: string;
  } | null>(null);

  // Watchlist hook for add/remove/check operations
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  // Get list of commodities for the selected category
  // useMemo prevents recalculation unless selectedCategory changes
  const currentCommodities = useMemo(() => {
    const category = commodityCategories.find(cat => cat.name === selectedCategory);
    return category ? category.commodities : [];
  }, [selectedCategory]);

  // COMPUTED VALUES: Determine what to display based on mode
  // If stock mode → use stock data
  // If commodity mode → use commodity data
  const displaySymbol = mode === 'stock' && selectedStock
    ? selectedStock.symbol
    : selectedCommodity.symbol;

  const displayName = mode === 'stock' && selectedStock
    ? selectedStock.name
    : selectedCommodity.name;

  const displayKeywords = mode === 'stock' && selectedStock
    ? generateStockKeywords(selectedStock.name, selectedStock.symbol)
    : selectedCommodity.keywords;

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-[#D0D0D0]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <div className="h-16 flex items-center">
            <h4 className="font-[family-name:var(--font-playfair)] text-[20px] font-semibold tracking-wide uppercase text-black">
              Commodities & Stocks Dashboard
            </h4>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-5 md:px-10 py-8">

        {/* Stock Search (always visible) */}
        <StockSearch
          onStockSelect={(stock) => {
            setSelectedStock({
              symbol: stock.symbol,
              name: stock.name,
              exchange: stock.exchange
            });
            setMode('stock');
          }}
        />

        {/* Commodity Selectors (always visible) */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 border border-[#D0D0D0] bg-[#F5F5F5]">
            {/* Category dropdown (e.g., Precious Metals, Energy) */}
            <CustomSelect
              id="category-select"
              label="Category"
              value={selectedCategory}
              options={commodityCategories.map(cat => ({
                label: cat.name,
                value: cat.name,
              }))}
              onChange={(newCategoryName) => {
                setSelectedCategory(newCategoryName);
                // When category changes, auto-select first commodity in that category
                const newCategory = commodityCategories.find(cat => cat.name === newCategoryName);
                if (newCategory && newCategory.commodities.length > 0) {
                  setSelectedCommodity(newCategory.commodities[0]);
                }
              }}
            />

            {/* Commodity dropdown (e.g., Gold, Silver) */}
            <CustomSelect
              id="commodity-select"
              label="Commodity"
              value={selectedCommodity.name}
              options={currentCommodities.map(commodity => ({
                label: commodity.name,
                value: commodity.name,
              }))}
              onChange={(commodityName) => {
                const newCommodity = currentCommodities.find(c => c.name === commodityName);
                if (newCommodity) {
                  setSelectedCommodity(newCommodity);
                  setMode('commodity'); // Switch back to commodity mode
                }
              }}
            />
        </div>

        {/* Watchlist */}
        <div className="bg-[#F5F5F5] p-3 mb-8">
          <div className="border border-[#D0D0D0] bg-white overflow-hidden">
            <Watchlist
              onSelectItem={(item) => {
                if (item.type === 'commodity') {
                  // Find the commodity in the config by symbol
                  for (const category of commodityCategories) {
                    const commodity = category.commodities.find(c => c.symbol === item.symbol);
                    if (commodity) {
                      setSelectedCategory(category.name);
                      setSelectedCommodity(commodity);
                      setMode('commodity');
                      break;
                    }
                  }
                } else {
                  // Stock mode
                  setSelectedStock({
                    symbol: item.symbol,
                    name: item.name,
                    exchange: item.exchange || ''
                  });
                  setMode('stock');
                }
              }}
            />
          </div>
        </div>

        {/* Main Chart Area */}
        <LightweightChart
          symbol={displaySymbol}
          commodityName={displayName}
          isStock={mode === 'stock'}
          exchange={mode === 'stock' && selectedStock ? selectedStock.exchange : undefined}
          isInWatchlist={isInWatchlist(displaySymbol)}
          onAddToWatchlist={() => {
            addToWatchlist({
              symbol: displaySymbol,
              name: displayName,
              type: mode,
              exchange: mode === 'stock' && selectedStock ? selectedStock.exchange : undefined
            });
          }}
          onRemoveFromWatchlist={() => removeFromWatchlist(displaySymbol)}
        />

        {/* News Section */}
        <NewsList
          keywords={displayKeywords}
          commodityName={displayName}
        />
      </main>

      {/* Legal Disclaimer Footer */}
      <footer className="border-t border-[#D0D0D0] bg-[#F5F5F5]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-6">
          <p className="text-[11px] text-[#666666] text-center leading-relaxed">
            Educational hobby project. Data provided as-is with no guarantees of accuracy or completeness.
            Not financial advice. Use at your own risk.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function StockDashboard() {
  return (
    <WatchlistProvider>
      <StockDashboardContent />
    </WatchlistProvider>
  );
}