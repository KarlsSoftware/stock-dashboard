# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js-based stock market dashboard that integrates TradingView widgets to display real-time stock charts. Users can search for stocks using exchange-prefixed symbols (e.g., NASDAQ:AAPL, NASDAQ:TSLA) and view interactive charts.

## Technology Stack

- **Framework**: Next.js 16.0.3 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5.x with strict mode enabled
- **Styling**: Tailwind CSS v4
- **External Integration**: TradingView Embed Widget (client-side script injection)

## Development Commands

```bash
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture

### Component Hierarchy

```
app/page.tsx (Home)
  └── app/stockDashboard.tsx (StockDashboard - Client Component)
        └── app/tradingViewWidget.tsx (TradingViewWidget - Client Component)
```

### Key Components

**StockDashboard** (`app/stockDashboard.tsx`)
- Main dashboard component with search functionality
- Manages stock symbol state (`symbol` and `searchInput`)
- Handles user input for stock symbol searches
- Expects symbols in format: `EXCHANGE:TICKER` (e.g., NASDAQ:AAPL)
- Uses client-side rendering (`"use client"`)

**TradingViewWidget** (`app/tradingViewWidget.tsx`)
- Wrapper for TradingView's external charting widget
- Dynamically injects TradingView script via `useEffect`
- Memoized component that only re-renders when `symbol` prop changes
- Clears and rebuilds the widget container on symbol change
- Chart configuration: Daily interval (D), UTC timezone, light theme, candlestick style

### Component Pattern

The codebase uses a **client component pattern** where:
1. The root page (`page.tsx`) is a Server Component that renders the client components
2. Interactive components are marked with `"use client"` directive
3. External script injection is handled via `useRef` and `useEffect` hooks
4. State management uses React hooks (`useState`)

### TypeScript Configuration

- Path alias: `@/*` maps to project root
- Strict mode enabled
- JSX runtime: `react-jsx` (automatic runtime)
- Module resolution: `bundler`

## Important Implementation Details

### TradingView Integration

The TradingView widget is loaded by:
1. Creating a script element in the DOM
2. Setting the source to TradingView's external embed URL
3. Passing configuration as stringified JSON in `script.innerHTML`
4. Appending the script to a ref'd container element

**Note**: The container must be cleared before re-adding the script on symbol changes to prevent duplicate widgets.

### Stock Symbol Format

All stock symbols must include the exchange prefix (e.g., `NASDAQ:AAPL`, not just `AAPL`). The `handleSearch` function in `StockDashboard` automatically converts input to uppercase.

### Styling

- Uses Tailwind CSS v4 with PostCSS
- Global styles in `app/globals.css`
- Custom fonts: Geist Sans and Geist Mono (loaded via next/font)
- Responsive design with max-width constraints
