"use client";

import { Search, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTransactionStore } from "@/store/useTransactionStore";
import { Category, QuickFilter, TransactionType } from "@/types";

const CATEGORIES: (Category | "All")[] = [
  "All", "Salary", "Freelance", "Grocery",
  "Travel", "Shopping", "Bills", "Food", "Other",
];

const QUICK_FILTERS: { key: QuickFilter; label: string; emoji: string }[] = [
  { key: "all", label: "All Time", emoji: "📋" },
  { key: "this-month", label: "This Month", emoji: "📅" },
  { key: "last-month", label: "Last Month", emoji: "🗓" },
  { key: "high-value", label: "₹5,000+", emoji: "💰" },
  { key: "income-only", label: "Income", emoji: "📈" },
  { key: "expense-only", label: "Expenses", emoji: "📉" },
];

export default function TransactionFilters() {
  const { filters, setFilter, resetFilters } = useTransactionStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const activeCount = [
    filters.search !== "",
    filters.category !== "All",
    filters.type !== "All",
    filters.dateFrom !== "",
    filters.dateTo !== "",
    filters.amountMin !== "",
    filters.amountMax !== "",
    filters.quickFilter !== "all",
  ].filter(Boolean).length;

  const isFiltered = activeCount > 0;

  function handleQuickFilter(key: QuickFilter) {
    setFilter("quickFilter", filters.quickFilter === key ? "all" : key);
  }

  const inputClass =
    "w-full border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-3 py-2 text-sm bg-white dark:bg-[#111] text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-shadow";

  const selectClass =
    "text-sm border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-3 py-2 bg-white dark:bg-[#111] text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer transition-shadow";

  return (
    <div className="mb-4">
      {/* Quick Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b border-gray-100 dark:border-[#2a2a2a]">
        {QUICK_FILTERS.map((qf) => (
          <button
            key={qf.key}
            onClick={() => handleQuickFilter(qf.key)}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 btn-press
              ${
                filters.quickFilter === qf.key
                  ? "bg-orange-500 text-white chip-active"
                  : "bg-gray-50 dark:bg-[#222] text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
              }`}
          >
            <span className="text-[13px]">{qf.emoji}</span>
            {qf.label}
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
        <div className="relative w-full sm:flex-1 sm:min-w-[200px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            id="transaction-search"
            type="text"
            placeholder="Search by category, note or amount…"
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
            className="w-full pl-9 pr-12 py-2 text-sm border border-gray-200 dark:border-[#2a2a2a] rounded-xl bg-white dark:bg-[#111] focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-600 transition-shadow"
          />
          <kbd className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-300 dark:text-gray-600 border border-gray-200 dark:border-[#333] rounded px-1.5 py-0.5 font-mono select-none">
            /
          </kbd>
        </div>

        <div className="grid grid-cols-2 sm:flex gap-3">
          <select
            value={filters.category}
            onChange={(e) =>
              setFilter("category", e.target.value as Category | "All")
            }
            className={selectClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Categories" : c}
              </option>
            ))}
          </select>

          <select
            value={filters.type}
            onChange={(e) =>
              setFilter(
                "type",
                e.target.value as TransactionType | "All"
              )
            }
            className={selectClass}
          >
            <option value="All">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split("-") as [
                "date" | "amount",
                "asc" | "desc"
              ];
              setFilter("sortBy", sortBy);
              setFilter("sortOrder", sortOrder);
            }}
            className={`${selectClass} col-span-2 sm:col-span-1`}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>

        {/* Advanced Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl transition-all border btn-press
            ${
              showAdvanced
                ? "border-orange-200 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400"
                : "border-gray-200 dark:border-[#2a2a2a] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-[#3a3a3a]"
            }`}
        >
          <SlidersHorizontal size={13} />
          <span className="hidden sm:inline">Advanced</span>
          {activeCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center leading-none animate-count-pop">
              {activeCount}
            </span>
          )}
          <ChevronDown
            size={12}
            className={`transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`}
          />
        </button>

        {isFiltered && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition px-2 py-2 btn-press"
          >
            <X size={13} />
            Reset
          </button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          showAdvanced
            ? "grid-rows-[1fr] opacity-100 mt-3"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-3 bg-gray-50 dark:bg-[#151515] rounded-xl border border-gray-100 dark:border-[#2a2a2a]">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Refine Results
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-gray-400 font-medium mb-1 block">
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilter("dateFrom", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-medium mb-1 block">
                  To Date
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilter("dateTo", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-medium mb-1 block">
                  Min Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={filters.amountMin}
                  onChange={(e) => setFilter("amountMin", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-medium mb-1 block">
                  Max Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="∞"
                  min="0"
                  value={filters.amountMax}
                  onChange={(e) => setFilter("amountMax", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}