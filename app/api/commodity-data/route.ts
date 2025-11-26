/**
 * API Route: Fetch commodity futures data
 *
 * This endpoint fetches historical price data for commodity futures
 * from an external data source and transforms it for chart display.
 *
 * URL: /api/commodity-data?symbol=GC=F&interval=1day (query string after the ?)
 */

import { NextResponse } from 'next/server';

// Convert our app's time intervals to API format
const intervalMap: Record<string, string> = {
  '1h': '1h',
  '4h': '1h', // API doesn't support 4h, use 1h instead
  '1day': '1d',
  '1week': '1wk',
  '1month': '1mo',
};

// How far back to fetch data for each interval
const rangeMap: Record<string, string> = {
  '1h': '5d',      // 5 days of hourly data
  '4h': '1mo',     // 1 month of 4-hour data
  '1day': '6mo',   // 6 months of daily data
  '1week': '2y',   // 2 years of weekly data
  '1month': '5y',  // 5 years of monthly data
};

// This function runs when someone visits /api/commodity-data
export async function GET(request: Request) {
  // Extract parameters from URL (?symbol=GC=F&interval=1day)
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const interval = searchParams.get('interval') || '1day';

  // Symbol is required - return error if missing
  if (!symbol) {
    return NextResponse.json({ error: 'Missing symbol parameter' }, { status: 400 });
  }

  try {
    // Convert our intervals to API format
    const yahooInterval = intervalMap[interval] || '1d';
    const range = rangeMap[interval] || '6mo';

    // Build the API URL with symbol and parameters
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${yahooInterval}&range=${range}`;

    // Fetch data from external API
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0', // Required by API
      },
      next: { revalidate: 120 } // Cache response for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`API returned error status: ${response.status}`);
    }

    const data = await response.json();

    // Check for API errors
    if (data.chart?.error) {
      throw new Error(data.chart.error.description || 'API error');
    }

    // Extract the actual price data
    const result = data.chart?.result?.[0];
    if (!result) {
      throw new Error(`No data available for symbol: ${symbol}`);
    }

    const timestamps = result.timestamp || [];
    const quote = result.indicators?.quote?.[0];

    if (!quote || timestamps.length === 0) {
      throw new Error(`No price data available for symbol: ${symbol}`);
    }

    // Transform API data into chart-friendly format
    // Each data point needs: time, open, high, low, close, value
    const chartData = timestamps.map((timestamp: number, index: number) => ({
      time: timestamp,
      open: quote.open?.[index] || quote.close?.[index] || 0,
      high: quote.high?.[index] || quote.close?.[index] || 0,
      low: quote.low?.[index] || quote.close?.[index] || 0,
      close: quote.close?.[index] || 0,
      value: quote.close?.[index] || 0,
    })).filter((item: any) => item.close > 0); // Remove invalid data points (convert null to 0)

    // Return formatted data to the client
    return NextResponse.json({
      symbol: result.meta?.symbol || symbol,
      currency: result.meta?.currency || 'USD',
      exchange: result.meta?.exchangeName || '',
      interval: yahooInterval,
      data: chartData
    });

  } catch (error) {
    // Log error and return error response
    console.error(`Data fetch error for ${symbol}:`, error);

    return NextResponse.json(
      {
        error: 'Failed to retrieve commodity data',
        details: (error as Error).message,
        symbol
      },
      { status: 500 }
    );
  }
}
