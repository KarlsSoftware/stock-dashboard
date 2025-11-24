/**
 * Root Layout
 *
 * Wraps the entire app. Loads fonts and sets up global HTML structure.
 *
 * Fonts:
 * - Inter: Body text (used everywhere)
 * - Playfair Display: Title/header (elegant serif)
 */

import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

// Load Inter font from Google Fonts
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Load Playfair Display font from Google Fonts
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

// Page metadata (shows in browser tab and search engines)
export const metadata: Metadata = {
  title: "Commodities Dashboard",
  description: "Minimalist commodities trading dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
