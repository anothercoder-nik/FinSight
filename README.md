# FinSight — Finance Dashboard

A responsive finance dashboard for tracking income, expenses, and spending patterns. Built with Next.js 16, TypeScript, Tailwind CSS v4, Zustand, and Recharts.

---

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
git clone https://github.com/anothercoder-nik/FinSight.git
cd FinSight
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

The app can be deployed directly to Vercel — just connect the GitHub repo and it handles the rest.

---

## Overview of Approach

### Architecture

I went with a single-page scrollable layout instead of separate routes. The dashboard is primarily a monitoring tool, so keeping everything on one page with smooth scroll navigation between Dashboard, Transactions, and Insights sections felt more natural than forcing page transitions. A sidebar with scroll-spy highlighting shows the user where they are.

### State Management

I used Zustand with two separate stores:

- **`useTransactionStore`** handles the transaction array, filter state, and all CRUD operations. Only the transaction data gets persisted to localStorage — filters intentionally reset on reload so the user starts fresh each session.
- **`useRoleStore`** manages the role toggle (admin/viewer) and dark mode preference. Both are persisted so the UI remembers your choices.

I picked Zustand over Context or Redux because its selector pattern (`useStore(s => s.field)`) prevents re-renders out of the box, and the `persist` middleware handles localStorage without extra wiring.

### Data Layer

Rather than hardcoding data into components, I built a mock API layer (`src/lib/api.ts`) that wraps the data in async calls with simulated delays. This way the loading skeletons and async patterns are real, and swapping in an actual API later would only need changes in that one file — no UI code needs to touch.

### Filtering

All filtering logic lives in a single pure function called `applyFilters` in `utils.ts`. It takes the full transaction array and the current filter state, then returns the filtered and sorted result. The quick filter presets (This Month, ₹5,000+, Income, etc.) just modify the same filter state — no separate codepath, everything stays consistent.

### Component Structure

Components are grouped by feature: `dashboard/`, `transactions/`, `insights/`, `layout/`, and a shared `ui/` folder for reusable primitives like Card, Badge, Toast, and EmptyState. Each feature component pulls its own data from Zustand selectors, keeping them self-contained.

---

## Features

### Dashboard
- Summary cards showing Total Balance, Total Income, and Total Expenses with animated number counters
- Balance Trend chart — multi-line chart showing income, expenses, and net balance across months
- Spending Breakdown — donut chart with category-wise expense distribution and an inline legend

### Transactions
- Full transaction table with date, category, amount, type, and notes
- Text search across categories, notes, and amounts
- Category and type dropdown filters
- Sort by date or amount (ascending/descending)
- Quick filter chips — one-click presets for "This Month", "Last Month", "₹5,000+", "Income Only", "Expenses Only"
- Advanced filters panel with date range picker and min/max amount range
- Active filter count badge showing how many filters are applied
- Export filtered data as CSV or JSON
- Add, edit, and delete transactions with form validation (admin role only)

### Role-Based Access
- **Viewer** — can browse, filter, search, and export. No write access.
- **Admin** — full CRUD access including add, edit, and delete
- Role switch via dropdown in the top bar, persisted to localStorage

### Insights
- Top Expense — highest spending category with a proportional progress bar
- Monthly Trend — month-over-month expense percentage change
- Savings Rate — percentage of income saved, with a health indicator (green above 20%, orange below)
- This Month summary — current month's spending, income, and net balance
- Spending by Category — ranked breakdown with proportional bars and percentages

### Additional
- Dark/light mode toggle with persistent preference
- Data persistence via localStorage
- Loading skeletons during initial data fetch
- Toast notifications on add, edit, and delete actions
- Keyboard shortcuts — `/` to focus search, `N` to add transaction (admin), `Esc` to close modals
- Scroll-spy navigation — sidebar highlights the active section as you scroll
- Relative date labels ("Today", "Yesterday") on recent transactions
- Color-coded row indicators — green border for income, red for expense
- Responsive layout — desktop sidebar collapses to mobile bottom navigation
- Empty state handling when there's no data or no filter results

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand + persist middleware |
| Charts | Recharts |
| Icons | Lucide React |
| Font | Outfit (Google Fonts) |

---

## Author

**Nikunj** — [GitHub](https://github.com/anothercoder-nik)
