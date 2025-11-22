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
      <header className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-8 py-4 shadow-sm gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold">StockDashboard</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="e.g. NASDAQ:TSLA"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="px-4 py-2 border rounded-full w-full sm:w-auto sm:w-64"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-full"
          >
            Search
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8">
        <p className="mb-4 text-gray-600">Showing: {symbol}</p>
        <div className="h-[500px] bg-gray-100 rounded-lg overflow-hidden">
          <TradingViewWidget symbol={symbol} />
        </div>
      </main>
    </>
  );
}