/**
 * Stock Dashboard Component
 *
 * Main dashboard that displays:
 * - Category and commodity selector dropdowns
 * - Price chart with timeframe controls
 * - Tabbed news section (Commodity News + Market News)
 * - Legal disclaimer footer
 *
 * State management:
 * - selectedCategory: Which commodity category (e.g., "Precious Metals")
 * - selectedCommodity: Which specific commodity (e.g., Gold)
 */

"use client";
import { useState, useMemo } from 'react';
import LightweightChart from "./lightweightChart";
import CustomSelect from "./CustomSelect";
import NewsSection from "./NewsSection";
import { commodityCategories } from "./commodityConfig";

export default function StockDashboard() {
  // Track which category and commodity are currently selected
  const [selectedCategory, setSelectedCategory] = useState(commodityCategories[0].name);
  const [selectedCommodity, setSelectedCommodity] = useState(commodityCategories[0].commodities[0]);

  // Get list of commodities for the selected category
  // useMemo prevents recalculation unless selectedCategory changes
  const currentCommodities = useMemo(() => {
    const category = commodityCategories.find(cat => cat.name === selectedCategory);
    return category ? category.commodities : [];
  }, [selectedCategory]);

  // Symbol to pass to chart component (e.g., "GC=F")
  const tickerToDisplay = selectedCommodity.symbol;

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-[#D0D0D0]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <div className="h-16 flex items-center">
            <h4 className="font-[family-name:var(--font-playfair)] text-[20px] font-semibold tracking-wide uppercase text-black">
              Commodities Dashboard
            </h4>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-5 md:px-10 py-8">

        {/* Commodity Selectors */}
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
              }
            }}
          />
        </div>

        <h2 className="text-xl font-semibold mb-4 text-black">{selectedCommodity.name} ({tickerToDisplay})</h2>

        {/* Main Chart Area */}
        <LightweightChart
          symbol={tickerToDisplay}
          commodityName={selectedCommodity.name}
        />

        {/* News Section with Tabs */}
        <NewsSection
          keywords={selectedCommodity.keywords}
          commodityName={selectedCommodity.name}
          symbol={selectedCommodity.symbol}
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