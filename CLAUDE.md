# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A minimalist commodities trading dashboard built with Next.js that displays interactive price charts for commodity futures. Users can browse 60+ commodities across 6 categories (Precious Metals, Energy, Grains, Soft Commodities, Industrial Metals, Livestock) with multiple timeframe options (1H, 4H, 1D, 1W, 1M).

This is an educational hobby project with no guarantees of data accuracy or completeness. Not financial advice.

## Technology Stack

- **Framework**: Next.js 16.0.3 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5.x with strict mode enabled
- **Styling**: Tailwind CSS v4
- **Charting Library**: Lightweight Charts v5.0.9 (by TradingView)
- **Data Source**: Yahoo Finance (unofficial API for commodity futures data)
- **Fonts**: Inter (body text), Playfair Display (title/headers)

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

### File Structure

```
app/
├── page.tsx                        # Home page (entry point)
├── layout.tsx                      # Root layout (fonts, metadata)
├── globals.css                     # Global styles (minimal)
├── stockDashboard.tsx              # Main dashboard (Client Component)
├── lightweightChart.tsx            # Chart component (Client Component)
├── CustomSelect.tsx                # Custom dropdown (Client Component)
├── commodityConfig.js              # Commodity configuration
└── api/
    └── commodity-data/
        └── route.ts                # API route for fetching Yahoo Finance data
```

### Component Hierarchy

```
app/page.tsx (Home - Server Component)
  └── app/stockDashboard.tsx (StockDashboard - Client Component)
        ├── app/CustomSelect.tsx (Category dropdown - Client Component)
        ├── app/CustomSelect.tsx (Commodity dropdown - Client Component)
        └── app/lightweightChart.tsx (Price Chart - Client Component)
```

### Key Components

**StockDashboard** (`app/stockDashboard.tsx`)
- Main dashboard component managing state and layout
- State: `selectedCategory` (e.g., "Precious Metals"), `selectedCommodity` (e.g., Gold object)
- Uses `useMemo` to get commodities for selected category
- Renders header, dropdowns, chart, and legal disclaimer footer
- Client-side rendering (`"use client"`)

**LightweightChart** (`app/lightweightChart.tsx`)
- Interactive price chart using Lightweight Charts library
- Props: `symbol` (e.g., "GC=F"), `commodityName` (e.g., "Gold")
- Features:
  - Multiple timeframes (1H, 4H, 1D, 1W, 1M) with loading states
  - Responsive design (adjusts to window resize)
  - Area series chart (line + filled area)
  - Shows symbol info, currency, and futures explanation
- Data flow:
  1. Component mounts → initialize chart
  2. Chart ready → fetch data from API
  3. Display data on chart
  4. User changes timeframe → re-fetch and update

**CustomSelect** (`app/CustomSelect.tsx`)
- Fully custom dropdown component replacing native `<select>`
- Props: `label`, `options`, `value`, `onChange`, `id`
- Features:
  - Keyboard navigation (Arrow keys, Enter, Escape)
  - Click outside to close
  - Touch-friendly (44px minimum touch targets)
  - ARIA accessibility labels
  - Full styling control matching design system

**CommodityConfig** (`app/commodityConfig.js`)
- Configuration file defining all available commodities
- Structure: Array of categories, each with array of commodities
- Commodity object: `{ name: "Gold", symbol: "GC=F" }`
- 6 categories: Precious Metals, Energy, Grains, Soft Commodities, Industrial Metals, Livestock

**API Route** (`app/api/commodity-data/route.ts`)
- Fetches commodity futures data from Yahoo Finance
- Endpoint: `/api/commodity-data?symbol=GC=F&interval=1day`
- Query parameters:
  - `symbol` (required): Yahoo Finance symbol (e.g., "GC=F")
  - `interval` (optional): "1h", "4h", "1day", "1week", "1month"
- Response: JSON with `{ symbol, currency, exchange, interval, data: [...] }`
- Data transformation: Yahoo Finance response → Lightweight Charts format
- Caching: 5-minute revalidation via Next.js `fetch` cache

**Layout** (`app/layout.tsx`)
- Root layout wrapping entire app
- Loads fonts: Inter (body), Playfair Display (title)
- Sets page metadata (title, description)
- Applies font CSS variables

### Data Flow

1. **User selects commodity**:
   - StockDashboard updates `selectedCommodity` state
   - Passes `symbol` prop to LightweightChart

2. **Chart fetches data**:
   - LightweightChart calls `/api/commodity-data?symbol=GC=F&interval=1day`
   - API route fetches from Yahoo Finance
   - API transforms data to chart format
   - Returns JSON response

3. **Chart displays data**:
   - LightweightChart receives data
   - Sets data on chart series
   - Auto-fits chart to show all data

4. **User changes timeframe**:
   - LightweightChart updates `selectedTimeframe` state
   - Re-fetches data with new interval
   - Updates chart with new data

### Commodity Symbol Format

All commodity symbols use Yahoo Finance futures format with "=F" suffix:
- Format: `ABC=F` where:
  - `ABC` = commodity code (e.g., `GC` for Gold, `CL` for WTI Crude Oil)
  - `=F` = front month futures contract (automatically rolls to next contract at expiration)
- Examples:
  - Gold: `GC=F`
  - Silver: `SI=F`
  - WTI Crude Oil: `CL=F`
  - Natural Gas: `NG=F`
- Configuration: `app/commodityConfig.js` contains all 60+ commodities

### Styling

- Tailwind CSS v4 with PostCSS
- Global styles in `app/globals.css` (minimal - Tailwind import + focus styles)
- Typography: Inter (body text), Playfair Display (elegant serif for title)
- Design philosophy: Minimalist, functional, precise (Dieter Rams-inspired)
- Color palette: Monochromatic grays (#FFFFFF, #F5F5F5, #E8E8E8, #999999, #1A1A1A)
- Responsive design with breakpoints (sm: 640px, md: 768px, lg: 1024px)
- 8px spacing grid for all layout

### TypeScript Configuration

- Path alias: `@/*` maps to project root
- Strict mode enabled
- JSX runtime: `react-jsx` (automatic runtime)
- Module resolution: `bundler`

## Important Implementation Details

### Lightweight Charts Integration

The chart is initialized using dynamic import to reduce initial bundle size:

```typescript
const LightweightCharts = await import('lightweight-charts');
const chart = LightweightCharts.createChart(containerRef.current, { /* config */ });
const series = chart.addSeries(LightweightCharts.AreaSeries, { /* config */ });
```

**Important**: Data fetching only starts after chart is ready (`chartReady` state). This prevents race conditions.

### Yahoo Finance API Integration

The API route (`app/api/commodity-data/route.ts`) fetches from Yahoo Finance:
- URL: `https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval={interval}&range={range}`
- Interval mapping: `{ '1h': '1h', '4h': '1h', '1day': '1d', '1week': '1wk', '1month': '1mo' }`
- Range mapping: `{ '1h': '5d', '4h': '1mo', '1day': '6mo', '1week': '2y', '1month': '5y' }`
- Data transformation: Extracts `timestamp`, `open`, `high`, `low`, `close` arrays and converts to chart-friendly format
- Error handling: Returns 400/500 responses with error details

**Note**: For 4H timeframe, we fetch 1h data because Yahoo Finance doesn't support 4h interval directly.

### Custom Dropdown Implementation

We built a custom dropdown (`CustomSelect.tsx`) instead of using native `<select>` because:
- Native `<select>` has limited styling options
- Browsers override CSS for `<option>` elements
- Custom component gives full control over appearance and behavior
- Better mobile UX with touch-friendly targets
- Keyboard navigation built-in

### Responsive Design

All components are mobile-first responsive:
- Header: Flexible layout with proper spacing
- Chart header: `flex-col` on mobile, `flex-row` on desktop
- Dropdowns: Stack vertically on mobile, horizontal on desktop
- Chart: Auto-resizes on window resize
- Touch targets: Minimum 44px height for mobile usability

## Design System

This project follows a strict minimalist design system. All new components MUST adhere to these guidelines.

### Color Palette

Use only these colors. Never introduce new colors without updating this guide.

Inspired by Dieter Rams' Braun design philosophy: functional color usage with maximum readability.

```css
/* Neutrals - Primary Palette */
--neutral-00: #FFFFFF   /* Pure white - main backgrounds */
--neutral-05: #F5F5F5   /* Subtle gray - secondary surfaces */
--neutral-15: #D0D0D0   /* Medium gray - borders, dividers (improved visibility) */
--neutral-50: #666666   /* Dark gray - labels, secondary text (improved readability) */
--neutral-100: #000000  /* True black - all primary text, headings (maximum contrast) */

/* Accents - Functional Use Only (Dieter Rams Principle) */
--accent-primary: #ed8008     /* Honey yellow - selected states, active elements (Braun signature) */
--accent-hover: #404040       /* Dark gray - hover state for buttons */
--accent-success: #3D7C3D     /* Green - positive data (price up) */
--accent-warning: #B85C00     /* Orange - alerts, negative data */
```

**Tailwind Classes:**
```
/* Backgrounds */
bg-white
bg-[#F5F5F5]

/* Borders */
border-[#D0D0D0]

/* Text */
text-black              /* Primary text, headings (true black #000000) */
text-[#666666]          /* Secondary labels, metadata */

/* Accents */
bg-[#ed8008]            /* Honey yellow - selected/active states */
text-[#ed8008]          /* Honey yellow text (use sparingly) */
bg-[#404040]            /* Dark hover states */
text-[#3D7C3D]          /* Success/positive */
text-[#B85C00]          /* Warning/error */
```

**Functional Color Usage (Dieter Rams Principle):**
- **Honey Yellow (#ed8008)**: Only for functional elements that indicate active/selected state (timeframe buttons, dropdown selections)
- **DO NOT** use accent colors decoratively - they must communicate state or function
- Maintain monochromatic base with single functional accent

### Typography

**Fonts:**
- **Inter** (400, 500, 600 weights) - Body text, UI elements
- **Playfair Display** (400, 600, 700 weights) - Page titles, headers (elegant serif)

**Type Scale (use exact px values):**
```
text-[11px]  - Fine print, uppercase labels
text-[13px]  - Button text, secondary info
text-[15px]  - Body text, input text (default)
text-[18px]  - Subheadings, emphasized values
text-[20px]  - Page titles (Playfair Display)
text-[24px]  - Large headings (use sparingly)
```

**Font Weights:**
```
font-normal (400)   - Body text
font-medium (500)   - Labels, buttons
font-semibold (600) - Headings (use sparingly)
font-bold (700)     - Playfair Display headers only
```

**Font Usage:**
```tsx
/* Page title - Playfair Display */
<h1 className="font-[family-name:var(--font-playfair)] text-[20px] font-semibold">
  Commodities Dashboard
</h1>

/* Body text - Inter (default) */
<p className="text-[15px] font-normal">
  Regular text content
</p>
```

**Additional Typography Rules:**
```
tracking-tight (-0.01em)   - Large numbers, headings
tracking-normal (0)        - Body text
tracking-wide (0.02em)     - Uppercase labels

leading-normal (1.5)       - Default line height

uppercase                  - Labels, page titles, buttons
```

**Example:**
```tsx
<span className="text-[11px] uppercase tracking-wide text-[#999999] font-medium">
  Symbol
</span>
<span className="text-[18px] font-medium text-[#1A1A1A] tracking-tight">
  NASDAQ:AAPL
</span>
```

### Spacing System

**8px Base Grid** - All spacing MUST be multiples of 8px.

```
p-1 or gap-1    = 8px
p-2 or gap-2    = 16px
p-3 or gap-3    = 24px
p-4 or gap-4    = 32px
p-5 or gap-5    = 40px
p-6 or gap-6    = 48px
p-8 or gap-8    = 64px

px-5 md:px-10   = Responsive horizontal padding
py-8            = Vertical section spacing
mb-6            = 24px margin bottom
```

**Never use arbitrary spacing values that don't align to 8px grid.**

### Component Styling Rules

**Borders:**
```
border border-[#D0D0D0]     /* 1px solid border (improved visibility) */
border-b border-[#D0D0D0]   /* Bottom border only */
border-l border-black       /* Dark left border (button dividers) */
```
- Always 1px width
- Never use thick borders
- Use `#D0D0D0` for standard borders (better contrast than old `#E8E8E8`)
- Use `black` for dark dividers and emphasis

**Corners:**
```
/* Default: NO border-radius (square edges preferred) */
/* Only if technically necessary: */
rounded-none  /* 0px - preferred */
rounded-sm    /* 2px - maximum allowed */
```
- Avoid rounded corners unless absolutely necessary
- Never use `rounded-lg`, `rounded-full`, etc.

**Shadows:**
```
/* Default: NO shadows */
/* Only for rare elevated states: */
shadow-sm     /* Minimal shadow if required */
```
- Avoid shadows
- Use borders to define boundaries instead

**Heights (aligned to 8px grid):**
```
h-10   = 40px  /* Input fields, small buttons */
h-16   = 64px  /* Header height */
h-[560px]      /* Chart container (70 × 8px) */
```

### Layout Guidelines

**Container Widths:**
```
max-w-[1200px]              /* Main content container */
mx-auto                     /* Center container */
px-5 md:px-10              /* Responsive padding */
```

**Responsive Breakpoints:**
```
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
```

**Example Layout:**
```tsx
<div className="max-w-[1200px] mx-auto px-5 md:px-10 py-8">
  {/* Content */}
</div>
```

### Interaction Patterns

**Transitions:**
```
transition-colors duration-100    /* Quick feedback (buttons) */
transition-colors duration-150    /* Subtle changes (inputs) */
```
- Use color transitions ONLY
- Never use transform, scale, rotate, or slide animations
- Keep durations minimal (100-150ms)

**Button States:**
```tsx
/* Standard dark button */
<button className="
  bg-black text-white
  hover:bg-[#404040]
  active:bg-black
  transition-colors duration-100
">

/* Honey yellow accent button (selected/active state) */
<button className="
  bg-[#ed8008] text-black
  hover:bg-[#cc6f07]
  transition-colors duration-100
">
```

**Input States:**
```tsx
<input className="
  bg-white
  focus:bg-[#F5F5F5]
  outline-none
  transition-colors duration-150
">
```

**Disabled States:**
```
opacity-50 cursor-not-allowed
```

### Component Examples

**Header:**
```tsx
<header className="border-b border-[#D0D0D0]">
  <div className="max-w-[1200px] mx-auto px-5 md:px-10">
    <div className="h-16 flex items-center justify-between">
      {/* Content */}
    </div>
  </div>
</header>
```

**Search Input + Button (Unified):**
```tsx
<div className="flex items-stretch gap-0 border border-[#D0D0D0]">
  <input className="w-64 h-10 px-4 text-[15px] text-black
                    placeholder:text-[#666666] bg-white border-0
                    outline-none focus:bg-[#F5F5F5]
                    transition-colors duration-150" />
  <button className="h-10 px-6 text-[13px] font-medium tracking-wide
                     uppercase bg-black text-white border-l
                     border-black hover:bg-[#404040]
                     transition-colors duration-100">
    Search
  </button>
</div>
```

**Content Container:**
```tsx
<div className="bg-[#F5F5F5] p-3">
  <div className="border border-[#D0D0D0] bg-white overflow-hidden">
    {/* Content */}
  </div>
</div>
```

**Label + Value Pattern:**
```tsx
<div className="flex items-baseline gap-3">
  <span className="text-[11px] uppercase tracking-wide text-[#666666] font-medium">
    Label
  </span>
  <span className="text-[18px] font-medium text-black tracking-tight">
    Value
  </span>
</div>
```

### Design Principles

When creating new components, follow these principles:

1. **Minimalism** - Remove everything unnecessary
2. **Functionality** - Every element must serve a purpose
3. **Precision** - Align to 8px grid, use exact color values
4. **Clarity** - Clear visual hierarchy through size and color
5. **Restraint** - No decorative elements, gradients, or effects
6. **Consistency** - Reuse existing patterns, never invent new styles
7. **Honesty** - Borders show structure, no fake depth with shadows

### What NOT to Do

❌ Never use these:
- `rounded-lg`, `rounded-full`, `rounded-xl` (too rounded)
- `shadow-md`, `shadow-lg` (decorative shadows)
- Bright colors like `blue-500`, `green-500`, `red-500`
- Transform animations (`scale`, `rotate`, `translate`)
- Gradient backgrounds
- Arbitrary spacing not on 8px grid
- Multiple font families

✅ Instead use:
- Square edges or minimal `rounded-sm`
- Borders for structure
- Monochromatic grays
- Subtle color transitions
- Solid backgrounds
- 8px-aligned spacing (8, 16, 24, 32, 40, 48, 64px)
- Inter (body) and Playfair Display (titles) only
