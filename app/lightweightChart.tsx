/**
 * Lightweight Chart Component
 *
 * Displays an interactive price chart for a commodity using the
 * Lightweight Charts library (by TradingView).
 *
 * Features:
 * - Multiple timeframes (1H, 4H, 1D, 1W, 1M)
 * - Responsive design
 * - Auto-resize on window resize
 * - Shows symbol info and currency
 *
 * Data flow:
 * 1. Component mounts → initialize chart
 * 2. Chart ready → fetch data from API
 * 3. Data received → display on chart
 * 4. User changes timeframe → re-fetch data
 */

"use client";

import { useEffect, useRef, useState } from 'react';

type Props = {
  symbol: string;        // e.g., "GC=F" or "AAPL"
  commodityName: string; // e.g., "Gold" or "Apple Inc."
  isStock?: boolean;     // true if stock, false/undefined if commodity
  exchange?: string;     // Exchange name for stocks (e.g., "NASDAQ")
  // Watchlist props
  isInWatchlist: boolean;
  onAddToWatchlist: () => void;
  onRemoveFromWatchlist: () => void;
};

type Timeframe = '1day' | '1week' | '1month' | '1h' | '4h' | '1year' | '3year' | '5year' | '10year';

// Available timeframe options
const timeframes: { label: string; value: Timeframe }[] = [
  { label: '1H', value: '1h' },
  { label: '4H', value: '4h' },
  { label: '1D', value: '1day' },
  { label: '1W', value: '1week' },
  { label: '1M', value: '1month' },
  { label: '1Y', value: '1year' },
  { label: '3Y', value: '3year' },
  { label: '5Y', value: '5year' },
  { label: '10Y', value: '10year' },
];

export default function LightweightChart({
  symbol,
  commodityName,
  isStock = false,
  exchange,
  isInWatchlist,
  onAddToWatchlist,
  onRemoveFromWatchlist
}: Props) {
  // Refs to access DOM element and chart instance
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);

  // Component state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartReady, setChartReady] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1day');
  const [currency, setCurrency] = useState<string>('USD');

  // Initialize chart on component mount
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Async function to load chart library and create chart
    const initChart = async () => {
      // Dynamic import - only loads library when needed
      const LightweightCharts = await import('lightweight-charts');

      if (!chartContainerRef.current) return;

      // Create chart with configuration
      const chart = LightweightCharts.createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          background: { color: '#FFFFFF' },
          textColor: '#1A1A1A',
          attributionLogo: false,
        },
        grid: {
          vertLines: { color: '#E8E8E8' },
          horzLines: { color: '#E8E8E8' },
        },
        timeScale: {
          borderColor: '#E8E8E8',
          timeVisible: true,
        },
        rightPriceScale: {
          borderColor: '#E8E8E8',
        },
        handleScroll: {
          mouseWheel: false,
          pressedMouseMove: true,
          horzTouchDrag: true,
          vertTouchDrag: true,
        },
        handleScale: {
          mouseWheel: false,
          pinch: true,
          axisPressedMouseMove: true,
          axisDoubleClickReset: true,
        },
      });

      chartRef.current = chart;

      // Create area series (v5 API)
      const areaSeries = chart.addSeries(LightweightCharts.AreaSeries, {
        lineColor: '#ed8008',
        topColor: 'rgba(26, 26, 26, 0.4)',
        bottomColor: 'rgba(26, 26, 26, 0.0)',
        lineWidth: 2,
      });

      seriesRef.current = areaSeries;
      setChartReady(true);
    };

    initChart();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, []);

  // Fetch data when symbol or timeframe changes (only after chart is ready)
  useEffect(() => {
    if (!chartReady || !seriesRef.current) return;

    setLoading(true);
    setError(null);

    // Call our API to get price data
    fetch(`/api/commodity-data?symbol=${encodeURIComponent(symbol)}&interval=${selectedTimeframe}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }

        if (seriesRef.current && data.data && data.data.length > 0) {
          seriesRef.current.setData(data.data);
          if (chartRef.current) {
            chartRef.current.timeScale().fitContent();
          }
        }
        if (data.currency) {
          setCurrency(data.currency);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(`Error fetching commodity data for ${symbol}:`, err);
        setError(`${symbol}: ${err.message || 'Failed to load data'}`);
        setLoading(false);
      });
  }, [symbol, chartReady, selectedTimeframe]);

  return (
    <div className="bg-[#F5F5F5] p-3">
      <div className="border border-[#D0D0D0] bg-white overflow-hidden">
        {/* Chart Header */}
        <div className="min-h-12 border-b border-[#D0D0D0] px-3 md:px-4 py-2 md:py-0 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[13px] uppercase tracking-wide font-medium text-black">
                {commodityName}
              </h3>
              <span className="text-[11px] text-[#666666] hidden sm:inline">·</span>
              <span className="text-[11px] text-[#666666]">
                {isStock && exchange ? (
                  `${symbol} · ${exchange} · ${currency}`
                ) : (
                  `${symbol} · Front Month Futures · ${currency}`
                )}
              </span>
            </div>

            {/* Timeframe Selector */}
            <div className="flex items-center gap-1 flex-wrap">
              {timeframes.map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => setSelectedTimeframe(tf.value)}
                  className={`
                    px-2 py-1 text-[11px] font-medium uppercase tracking-wide
                    border transition-colors
                    ${selectedTimeframe === tf.value
                      ? 'bg-[#ed8008] text-black border-[#ed8008]'
                      : 'bg-white text-black border-[#D0D0D0] hover:bg-[#F5F5F5]'
                    }
                  `}
                  disabled={loading}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {loading && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-[#D0D0D0] border-t-black animate-spin" />
                <span className="text-[11px] text-[#666666]">Loading...</span>
              </div>
            )}
            {error && (
              <span className="text-[13px] text-[#B85C00]">{error}</span>
            )}

            {/* Watchlist Button */}
            <button
              onClick={() => {
                if (isInWatchlist) {
                  onRemoveFromWatchlist();
                } else {
                  onAddToWatchlist();
                }
              }}
              className={`flex flex-col items-start gap-0 px-2 py-1 border transition-colors duration-100 ${
                isInWatchlist
                  ? 'bg-[#ed8008] text-black border-[#ed8008]'
                  : 'bg-white text-[#666666] border-[#D0D0D0] hover:bg-[#F5F5F5]'
              }`}
              aria-label={isInWatchlist ? "Remove from browser storage" : "Save to browser storage"}
            >
              <div className="flex items-center gap-1">
                <span className="text-[13px]">{isInWatchlist ? '★' : '☆'}</span>
                <span className="text-[11px] font-medium uppercase tracking-wide">
                  {isInWatchlist ? 'Saved' : 'Save'}
                </span>
              </div>
              <span className="text-[9px] text-[#666666]">
                Browser Storage
              </span>
            </button>
          </div>
        </div>

        {/* Chart Container */}
        <div ref={chartContainerRef} className="w-full" style={{ height: '400px' }} />
      </div>
    </div>
  );
}
