/**
 * TradingView Top Stories Widget
 *
 * Embeds TradingView's Top Stories news feed.
 * Shows latest financial market news from TradingView.
 *
 * Features:
 * - Auto-updating news feed
 * - Symbol filtering (if supported by widget)
 * - Clean, minimalist design
 * - Matches dashboard style
 */

"use client";

import { useEffect, useRef } from 'react';

type Props = {
  commodityName: string;
  symbol: string; // Yahoo Finance symbol (e.g., "GC=F")
};

// Map Yahoo Finance symbols to TradingView symbols
const mapToTradingViewSymbol = (yahooSymbol: string): string => {
  const symbolMap: Record<string, string> = {
    // Precious Metals
    'GC=F': 'COMEX:GC1!',
    'SI=F': 'COMEX:SI1!',
    'PL=F': 'NYMEX:PL1!',
    'PA=F': 'NYMEX:PA1!',

    // Energy
    'CL=F': 'NYMEX:CL1!',
    'BZ=F': 'NYMEX:BZ1!',
    'NG=F': 'NYMEX:NG1!',
    'HO=F': 'NYMEX:HO1!',
    'RB=F': 'NYMEX:RB1!',

    // Grains
    'ZC=F': 'CBOT:ZC1!',
    'ZW=F': 'CBOT:ZW1!',
    'ZS=F': 'CBOT:ZS1!',
    'ZO=F': 'CBOT:ZO1!',

    // Soft Commodities
    'KC=F': 'ICEUS:KC1!',
    'SB=F': 'ICEUS:SB1!',
    'CT=F': 'ICEUS:CT1!',
    'CC=F': 'ICEUS:CC1!',
    'OJ=F': 'ICEUS:OJ1!',

    // Industrial Metals
    'HG=F': 'COMEX:HG1!',

    // Livestock
    'LE=F': 'CME:LE1!',
    'HE=F': 'CME:HE1!',
    'GF=F': 'CME:GF1!',
  };

  return symbolMap[yahooSymbol] || yahooSymbol;
};

export default function TradingViewStories({ commodityName, symbol }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget
    containerRef.current.innerHTML = '';

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container__widget';
    containerRef.current.appendChild(widgetContainer);

    // Create and configure script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
    script.async = true;

    // Widget configuration
    // Note: symbol parameter may or may not be supported by free widget
    // Testing both feedMode: "symbol" and explicit symbol parameter
    const tradingViewSymbol = mapToTradingViewSymbol(symbol);

    script.innerHTML = JSON.stringify({
      feedMode: "symbol", // Try symbol-specific mode
      symbol: tradingViewSymbol, // Pass TradingView symbol
      colorTheme: "light",
      isTransparent: true,
      displayMode: "regular",
      width: "100%",
      height: "550",
      locale: "en"
    });

    containerRef.current.appendChild(script);

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol]); // Re-initialize when symbol changes

  return (
    <div className="bg-[#F5F5F5] p-3">
      <div className="border border-[#D0D0D0] bg-white">
        {/* Header */}
        <div className="border-b border-[#D0D0D0] px-4 py-3">
          <h3 className="text-[13px] uppercase tracking-wide font-medium text-black">
            Market News · TradingView
          </h3>
        </div>

        {/* TradingView Widget */}
        <div className="tradingview-widget-container" ref={containerRef}>
          <div className="tradingview-widget-container__widget"></div>
        </div>
      </div>
    </div>
  );
}
