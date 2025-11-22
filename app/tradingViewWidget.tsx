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
      autosize: true,
      symbol: symbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      save_image: false,
      hide_side_toolbar: true,
      hide_top_toolbar: false,
      toolbar_bg: "#FFFFFF",
      gridLineColor: "#E8E8E8",
      backgroundColor: "#FFFFFF",
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
