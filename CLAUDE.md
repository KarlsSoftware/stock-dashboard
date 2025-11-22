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
- Global styles in `app/globals.css` (minimal - only Tailwind import)
- Typography: Inter font (loaded via next/font)
- Design philosophy: Minimalist, functional, precise
- Responsive design with max-width constraints

## Design System

This project follows a strict minimalist design system. All new components MUST adhere to these guidelines.

### Color Palette

Use only these colors. Never introduce new colors without updating this guide.

```css
/* Neutrals - Primary Palette */
--neutral-00: #FFFFFF   /* Pure white - main backgrounds */
--neutral-05: #F5F5F5   /* Subtle gray - secondary surfaces */
--neutral-10: #E8E8E8   /* Light gray - borders, dividers */
--neutral-40: #999999   /* Medium gray - labels, secondary text */
--neutral-70: #4D4D4D   /* Dark gray - body text */
--neutral-90: #1A1A1A   /* Near black - headings, primary actions */

/* Accents - Use Sparingly */
--accent-hover: #404040      /* Hover state for dark buttons */
--accent-success: #3D7C3D    /* Positive data (price up) */
--accent-warning: #B85C00    /* Alerts, negative data */
```

**Tailwind Classes:**
```
bg-white
bg-[#F5F5F5]
border-[#E8E8E8]
text-[#999999]
text-[#4D4D4D]
text-[#1A1A1A]
```

### Typography

**Font:** Inter (400, 500, 600 weights only)

**Type Scale (use exact px values):**
```
text-[11px]  - Fine print, uppercase labels
text-[13px]  - Button text, secondary info
text-[15px]  - Body text, input text (default)
text-[18px]  - Subheadings, emphasized values
text-[24px]  - Page titles
```

**Font Weights:**
```
font-normal (400)   - Body text
font-medium (500)   - Labels, buttons
font-semibold (600) - Headings (use sparingly)
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
border border-[#E8E8E8]     /* 1px solid border */
border-b border-[#E8E8E8]   /* Bottom border only */
border-l border-[#1A1A1A]   /* Dark left border (button dividers) */
```
- Always 1px width
- Never use thick borders
- Use `#E8E8E8` for light borders, `#1A1A1A` for dark dividers

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
<button className="
  bg-[#1A1A1A] text-white
  hover:bg-[#404040]
  active:bg-[#1A1A1A]
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
<header className="border-b border-[#E8E8E8]">
  <div className="max-w-[1200px] mx-auto px-5 md:px-10">
    <div className="h-16 flex items-center justify-between">
      {/* Content */}
    </div>
  </div>
</header>
```

**Search Input + Button (Unified):**
```tsx
<div className="flex items-stretch gap-0 border border-[#E8E8E8]">
  <input className="w-64 h-10 px-4 text-[15px] text-[#1A1A1A]
                    placeholder:text-[#999999] bg-white border-0
                    outline-none focus:bg-[#F5F5F5]
                    transition-colors duration-150" />
  <button className="h-10 px-6 text-[13px] font-medium tracking-wide
                     uppercase bg-[#1A1A1A] text-white border-l
                     border-[#1A1A1A] hover:bg-[#404040]
                     transition-colors duration-100">
    Search
  </button>
</div>
```

**Content Container:**
```tsx
<div className="bg-[#F5F5F5] p-3">
  <div className="border border-[#E8E8E8] bg-white overflow-hidden">
    {/* Content */}
  </div>
</div>
```

**Label + Value Pattern:**
```tsx
<div className="flex items-baseline gap-3">
  <span className="text-[11px] uppercase tracking-wide text-[#999999] font-medium">
    Label
  </span>
  <span className="text-[18px] font-medium text-[#1A1A1A] tracking-tight">
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
- Inter font only
