/**
 * API Route: Fetch commodity news from GDELT
 *
 * GDELT is a free news database that provides real-time news articles
 * from around the world. This endpoint searches for commodity-related news.
 *
 * URL: /api/gdelt-news?keywords=gold+prices+OR+gold+market
 */

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Extract keywords from URL query parameters
  const { searchParams } = new URL(request.url);
  const keywords = searchParams.get('keywords');

  // Keywords are required
  if (!keywords) {
    return NextResponse.json({ error: 'Missing keywords parameter' }, { status: 400 });
  }

  try {
    // Build GDELT API URL with query parameters
    // IMPORTANT: GDELT requires OR'd terms to be wrapped in parentheses
    const gdeltUrl = new URL('https://api.gdeltproject.org/api/v2/doc/doc');
    gdeltUrl.searchParams.set('query', `(${keywords})`);
    gdeltUrl.searchParams.set('sourcelang', 'English');
    gdeltUrl.searchParams.set('mode', 'ArtList');
    gdeltUrl.searchParams.set('maxrecords', '30'); // Fetch 30 articles for scrollable view
    gdeltUrl.searchParams.set('format', 'JSON');

    console.log('Fetching GDELT news with URL:', gdeltUrl.toString());

    // Fetch news from GDELT
    const response = await fetch(gdeltUrl.toString(), {
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GDELT API error response:', errorText);
      throw new Error(`GDELT API returned status: ${response.status}`);
    }

    const text = await response.text();
    console.log('GDELT raw response:', text.substring(0, 500)); // Log first 500 chars

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Invalid JSON response from GDELT');
    }

    console.log('GDELT parsed data keys:', Object.keys(data));

    // Extract articles from response
    const articles = data.articles || [];
    console.log('Found articles count:', articles.length);

    // Transform to simplified format for frontend
    const news = articles.map((article: any) => ({
      title: article.title || 'Untitled',
      url: article.url || '#',
      source: article.domain || 'Unknown',
      publishedAt: article.seendate || null,
    }));

    return NextResponse.json({ news });

  } catch (error) {
    console.error('GDELT news fetch error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch news',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
