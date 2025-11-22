"use client";
import { useState } from "react";
import TradingViewWidget from "./tradingViewWidget";

export default function StockDashboard() {
  const [currentSymbol, setCurrentSymbol] = useState("NASDAQ:AAPL");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#E8E8E8]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <div className="h-16 flex items-center">
            <h1 className="text-[15px] font-medium tracking-wide uppercase text-[#1A1A1A]">
              Stock Dashboard
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-5 md:px-10 py-8">
        {/* Chart */}
        <div className="bg-[#F5F5F5] p-3">
          <div className="border border-[#E8E8E8] bg-white h-[560px] overflow-hidden">
            <TradingViewWidget symbol={currentSymbol} />
          </div>
        </div>
      </main>
    </div>
  );
}