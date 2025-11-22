"use client";

import React, { useEffect, useRef, memo } from "react";

type Props = {
  symbol: string; 
};

function TradingViewWidget({ symbol }: Props) {

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {

    if (!container.current) return;

    container.current.innerHTML = "";

    const script = document.createElement("script");

    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";

    script.type = "text/javascript";

    script.async = true;

    script.innerHTML = JSON.stringify({
      autosize: true, // Chart fills its container
      symbol: symbol, // Which stock to show (from props!)
      interval: "D", // D = Daily candles
      timezone: "Etc/UTC", // Timezone for timestamps
      theme: "light", // Light or dark theme
      style: "1", // Chart style (1 = candles)
      locale: "en", // Language
      allow_symbol_change: true, // User can change symbol in widget
      save_image: true, // Allow screenshot button
      hide_side_toolbar: true, // Cleaner look
    });

    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div
      ref={container} 
      style={{ height: "500px", width: "100%" }}
    />
  );
}

//memo = rerender if props change
export default memo(TradingViewWidget);
