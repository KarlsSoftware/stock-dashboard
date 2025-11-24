/**
 * News List Component
 *
 * Displays latest news articles from GDELT for the selected commodity.
 * Simple, minimalist list with title and link.
 *
 * Features:
 * - Fetches news based on commodity keywords
 * - Truncates long titles/links with "..."
 * - Loading and error states
 * - Fully responsive
 */

"use client";

import { useEffect, useState } from 'react';

type NewsArticle = {
  title: string;
  url: string;
  source: string;
  publishedAt: string | null;
};

type Props = {
  keywords: string;
  commodityName: string;
};

export default function NewsList({ keywords, commodityName }: Props) {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch news when keywords change
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`/api/gdelt-news?keywords=${encodeURIComponent(keywords)}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        setNews(data.news || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching news:', err);
        setError(err.message || 'Failed to load news');
        setLoading(false);
      });
  }, [keywords]);

  // Truncate text with ellipsis if too long
  const truncate = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-[#F5F5F5] p-3 pt-0">
      <div className="border border-[#D0D0D0] bg-white">
        {/* Header */}
        <div className="border-b border-[#D0D0D0] px-4 py-3">
          <h3 className="text-[13px] uppercase tracking-wide font-medium text-black">
            Latest News · {commodityName}
          </h3>
        </div>

        {/* Content */}
        <div className="px-4 py-3">
          {loading && (
            <div className="flex items-center gap-2 py-4">
              <div className="w-3 h-3 border-2 border-[#D0D0D0] border-t-black animate-spin" />
              <span className="text-[13px] text-[#666666]">Loading news...</span>
            </div>
          )}

          {error && (
            <div className="py-4">
              <span className="text-[13px] text-[#B85C00]">Error: {error}</span>
            </div>
          )}

          {!loading && !error && news.length === 0 && (
            <div className="py-4">
              <span className="text-[13px] text-[#666666]">No news available</span>
            </div>
          )}

          {!loading && !error && news.length > 0 && (
            <div className="space-y-3">
              {news.map((article, index) => (
                <div
                  key={index}
                  className="border-b border-[#D0D0D0] pb-3 last:border-b-0 last:pb-0"
                >
                  {/* Article Title */}
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[13px] font-medium text-black hover:text-[#666666] transition-colors mb-1"
                  >
                    {truncate(article.title, 120)}
                  </a>

                  {/* Source and Link */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-[11px] text-[#666666]">
                      {article.source}
                    </span>
                    <span className="hidden sm:inline text-[11px] text-[#D0D0D0]">·</span>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#666666] hover:text-black transition-colors break-all sm:break-normal"
                    >
                      {truncate(article.url, 60)}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
