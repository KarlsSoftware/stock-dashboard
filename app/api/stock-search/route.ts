import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Extract query parameter from URL
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    // Validate query parameter
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    // Fetch from Yahoo Finance search API
    const yahooUrl = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}`;

    const response = await fetch(yahooUrl, {
      next: { revalidate: 300 } // Cache for 5 minutes (same as other APIs)
    });

    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }

    const data = await response.json();

    // Filter results to stocks only (EQUITY type)
    const quotes = data.quotes || [];
    const stocks = quotes
      .filter((item: any) => item.quoteType === 'EQUITY')
      .map((item: any) => ({
        symbol: item.symbol,
        name: item.longname || item.shortname || item.symbol,
        exchange: item.exchDisp || item.exchange || 'N/A',
        type: item.quoteType
      }));

    // Prioritize US exchanges (NASDAQ, NYSE, AMEX)
    const usExchanges = ['NMS', 'NYQ', 'ASE', 'NASDAQ', 'NYSE', 'AMEX'];
    const sortedStocks = stocks.sort((a: any, b: any) => {
      const aIsUS = usExchanges.includes(a.exchange);
      const bIsUS = usExchanges.includes(b.exchange);

      if (aIsUS && !bIsUS) return -1;
      if (!aIsUS && bIsUS) return 1;
      return 0;
    });

    return NextResponse.json({
      query,
      count: sortedStocks.length,
      results: sortedStocks
    });

  } catch (error) {
    console.error('Stock search error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock search results' },
      { status: 500 }
    );
  }
}
