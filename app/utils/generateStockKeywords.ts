/**
 * Generate GDELT search keywords from company name and stock symbol
 *
 * @param companyName - Full company name (e.g., "Apple Inc.", "Tesla, Inc.")
 * @param symbol - Stock symbol (e.g., "AAPL", "TSLA")
 * @returns Keyword string formatted for GDELT API (e.g., "Apple" OR AAPL OR "Apple stock")
 *
 * @example
 * generateStockKeywords("Apple Inc.", "AAPL")
 * // Returns: "Apple" OR AAPL OR "Apple stock" OR "Apple shares" OR "AAPL stock"
 */
export function generateStockKeywords(companyName: string, symbol: string): string {
  // Remove common company suffixes to get cleaner keywords
  // Matches: Inc., Corp., Corporation, Ltd., Limited, Co., Company, PLC, LLC
  const baseName = companyName
    .replace(/\s+(Inc\.|Corp\.|Corporation|Ltd\.|Limited|Co\.|Company|PLC|LLC)$/i, '')
    .replace(/,/g, '') // Remove commas (e.g., "Tesla, Inc." → "Tesla Inc.")
    .trim();

  // Check if symbol contains special characters (period, hyphen, etc.)
  const hasSpecialChars = /[.\-]/.test(symbol);

  // Build keyword variations for comprehensive news coverage
  const keywords = [
    `"${baseName}"`,              // "Apple" - exact company name match
    `"${baseName} stock"`,         // "Apple stock" - common news phrasing
    `"${baseName} shares"`,        // "Apple shares" - alternative phrasing
  ];

  // For symbols without special characters, add symbol variations
  // For symbols with special characters (like BRK.B, SIKA.SG), only add quoted form
  if (!hasSpecialChars) {
    keywords.push(symbol);              // AAPL - stock symbol
    keywords.push(`"${symbol} stock"`); // "AAPL stock" - symbol-based articles
  } else {
    keywords.push(`"${symbol}"`);       // "BRK.B" or "SIKA.SG" - quoted to avoid GDELT issues
  }

  // Join with OR for GDELT boolean search
  return keywords.join(' OR ');
}
