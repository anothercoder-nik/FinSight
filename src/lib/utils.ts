import { Transaction, FilterState } from "@/types";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getBalance(transactions: Transaction[]): number {
  return getTotalIncome(transactions) - getTotalExpenses(transactions);
}

export interface CategoryTotal {
  category: string;
  amount: number;
}

export function groupByCategory(transactions: Transaction[]): CategoryTotal[] {
  const expenses = transactions.filter((t) => t.type === "expense");
  const map: Record<string, number> = {};

  for (const t of expenses) {
    map[t.category] = (map[t.category] ?? 0) + t.amount;
  }

  return Object.entries(map)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function getHighestSpendingCategory(
  transactions: Transaction[]
): CategoryTotal | null {
  const grouped = groupByCategory(transactions);
  return grouped.length > 0 ? grouped[0] : null;
}

export interface MonthlyTotal {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export function getMonthlyTotals(transactions: Transaction[]): MonthlyTotal[] {
  const map: Record<string, { income: number; expenses: number }> = {};

  for (const t of transactions) {
    const date = new Date(t.date);
    const key = date.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });

    if (!map[key]) map[key] = { income: 0, expenses: 0 };
    if (t.type === "income") map[key].income += t.amount;
    else map[key].expenses += t.amount;
  }

  return Object.entries(map)
    .map(([month, { income, expenses }]) => ({
      month,
      income,
      expenses,
      balance: income - expenses,
    }))
    .sort(
      (a, b) =>
        new Date("1 " + a.month).getTime() - new Date("1 " + b.month).getTime()
    );
}

export interface MonthlyComparison {
  currentMonth: string;
  previousMonth: string;
  currentExpenses: number;
  previousExpenses: number;
  percentageChange: number;
}

export function getMonthlyComparison(
  transactions: Transaction[]
): MonthlyComparison | null {
  const monthly = getMonthlyTotals(transactions);
  if (monthly.length < 2) return null;

  const current = monthly[monthly.length - 1];
  const previous = monthly[monthly.length - 2];

  const percentageChange =
    previous.expenses === 0
      ? 100
      : ((current.expenses - previous.expenses) / previous.expenses) * 100;

  return {
    currentMonth: current.month,
    previousMonth: previous.month,
    currentExpenses: current.expenses,
    previousExpenses: previous.expenses,
    percentageChange: Math.round(percentageChange * 10) / 10,
  };
}

export function applyFilters(
  transactions: Transaction[],
  filters: FilterState
): Transaction[] {
  let result = [...transactions];

  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.category.toLowerCase().includes(q) ||
        t.note?.toLowerCase().includes(q) ||
        t.amount.toString().includes(q)
    );
  }

  if (filters.category !== "All") {
    result = result.filter((t) => t.category === filters.category);
  }

  if (filters.type !== "All") {
    result = result.filter((t) => t.type === filters.type);
  }

  if (filters.dateFrom) {
    result = result.filter(
      (t) => new Date(t.date) >= new Date(filters.dateFrom)
    );
  }
  if (filters.dateTo) {
    result = result.filter(
      (t) => new Date(t.date) <= new Date(filters.dateTo)
    );
  }

  if (filters.amountMin) {
    const min = Number(filters.amountMin);
    if (!isNaN(min)) result = result.filter((t) => t.amount >= min);
  }
  if (filters.amountMax) {
    const max = Number(filters.amountMax);
    if (!isNaN(max)) result = result.filter((t) => t.amount <= max);
  }

  if (filters.quickFilter !== "all") {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    switch (filters.quickFilter) {
      case "this-month":
        result = result.filter((t) => {
          const d = new Date(t.date);
          return d.getMonth() === month && d.getFullYear() === year;
        });
        break;
      case "last-month": {
        const lm = month === 0 ? 11 : month - 1;
        const ly = month === 0 ? year - 1 : year;
        result = result.filter((t) => {
          const d = new Date(t.date);
          return d.getMonth() === lm && d.getFullYear() === ly;
        });
        break;
      }
      case "high-value":
        result = result.filter((t) => t.amount >= 5000);
        break;
      case "income-only":
        result = result.filter((t) => t.type === "income");
        break;
      case "expense-only":
        result = result.filter((t) => t.type === "expense");
        break;
    }
  }

  result.sort((a, b) => {
    if (filters.sortBy === "date") {
      return filters.sortOrder === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return filters.sortOrder === "asc"
      ? a.amount - b.amount
      : b.amount - a.amount;
  });

  return result;
}

export function getRelativeDate(dateStr: string): string {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000)
    .toISOString()
    .split("T")[0];

  if (dateStr === today) return "Today";
  if (dateStr === yesterday) return "Yesterday";
  return "";
}

export function exportToCSV(transactions: Transaction[]): void {
  const headers = ["Date", "Category", "Type", "Amount", "Note"];
  const rows = transactions.map((t) => [
    t.date,
    t.category,
    t.type,
    t.amount.toString(),
    t.note ?? "",
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `finflow-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportToJSON(transactions: Transaction[]): void {
  const json = JSON.stringify(transactions, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `finflow-${new Date().toISOString().split("T")[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}