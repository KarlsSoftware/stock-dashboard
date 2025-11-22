"use client";
import { useState } from "react";
import TradingViewWidget from "./tradingViewWidget";

export default function StockDashboard() {
  const [symbol, setSymbol] = useState("NASDAQ:AAPL");
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    if (searchInput.trim()) {
      setSymbol(searchInput.toUpperCase());
    }
  };

  return (
    <>
      <header className="flex items-center justify-between px-8 py-4 shadow-sm">
        <h1 className="text-2xl font-semibold">StockDashboard</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. NASDAQ:TSLA"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="px-4 py-2 border rounded-full w-64"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-full"
          >
            Search
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-8">
        <p className="mb-4 text-gray-600">Showing: {symbol}</p>
        <div className="h-[500px] bg-gray-100 rounded-lg overflow-hidden">
          <TradingViewWidget symbol={symbol} />
        </div>
      </main>
    </>
  );
}