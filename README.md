# FinFlow — Finance Dashboard

A responsive finance dashboard for tracking income, expenses, and spending patterns. Built with Next.js 16, TypeScript, Tailwind CSS v4, Zustand, and Recharts.

Supports role-based access (admin/viewer), real-time filtering, dark mode, and data export.

## Setup

```bash
git clone https://github.com/yourusername/finance-dashboard.git
cd finance-dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For production:

```bash
npm run build
npm start
```

## How It Works

The app is a single-page scrollable layout with three sections — Dashboard, Transactions, and Insights — navigated through a sidebar with scroll-spy highlighting.

### State management

Two Zustand stores handle the state:

- **`useTransactionStore`** — transactions array + filter state. Only the transaction array gets persisted to localStorage; filters reset on reload so the user always starts clean.
- **`useRoleStore`** — role selection (admin/viewer) and dark mode toggle. Both persisted.

I picked Zustand over Context because the selector pattern (`useStore(s => s.field)`) avoids unnecessary re-renders, and the `persist` middleware handles localStorage without extra boilerplate.

### Data layer

All CRUD operations go through a mock API (`src/lib/api.ts`) with async delays. This simulates real network behavior and lets me show loading skeletons. The idea is that swapping in a real backend later won't require touching any UI code.

### Filtering

There's a single `applyFilters` function in `utils.ts` that takes the full transaction list and the current filter state, returns the filtered result. Quick filter presets (This Month, High Value, etc.) just set the same filter state under the hood — no separate logic.

## Features

- Summary cards with animated counters (balance, income, expenses)
- Balance trend chart (income vs expenses vs net) and spending breakdown donut
- Transaction table with search, category/type dropdowns, sort, and date/amount range filters
- Quick filter chips for common views
- Add/edit/delete transactions (admin only) with form validation
- CSV and JSON export of filtered data
- Dark/light mode with persistent toggle
- Role switcher (viewer = read-only, admin = full CRUD)
- Keyboard shortcuts: `/` for search, `N` for new transaction, `Esc` to close modals
- Toast notifications for actions
- Responsive — sidebar on desktop, bottom nav on mobile

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

## Project Structure

```
src/
├── app/                    # Root layout, page, global styles
├── components/
│   ├── dashboard/          # Summary cards, charts, greeting
│   ├── transactions/       # Table, filters, modal
│   ├── insights/           # Derived metrics and category breakdown
│   ├── layout/             # Sidebar, topbar, data provider
│   └── ui/                 # Reusable primitives (Card, Badge, Toast, EmptyState)
├── hooks/                  # useAnimatedCounter, useScrollSpy
├── store/                  # Zustand stores
├── lib/                    # Mock API, utils, cn helper
├── data/                   # Mock transaction dataset
└── types/                  # TypeScript definitions
```

## Author

**Nikunj**
