"use client";

import Card from "@/components/ui/Card";
import { useTransactionStore } from "@/store/useTransactionStore";
import {
  getHighestSpendingCategory,
  getMonthlyComparison,
  getMonthlyTotals,
  getTotalExpenses,
  getTotalIncome,
  formatCurrency,
  groupByCategory,
} from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  ArrowDownRight,
  Wallet,
  PieChart,
} from "lucide-react";

export default function InsightsSection() {
  const transactions = useTransactionStore((s) => s.transactions);

  const highest = getHighestSpendingCategory(transactions);
  const comparison = getMonthlyComparison(transactions);
  const monthly = getMonthlyTotals(transactions);
  const currentMonth = monthly[monthly.length - 1];
  const categories = groupByCategory(transactions);
  const totalExpenses = getTotalExpenses(transactions);
  const totalIncome = getTotalIncome(transactions);
  const savingsRate =
    totalIncome > 0
      ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
      : 0;

  return (
    <section className="mt-6 mb-10">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Insights</h2>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          Derived from your transaction history
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Top Expense
            </p>
            <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-500/15 flex items-center justify-center">
              <ArrowDownRight size={14} className="text-red-500" />
            </div>
          </div>
          {highest ? (
            <>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{highest.category}</p>
              <p className="text-xs text-red-400 font-medium mt-1">
                {formatCurrency(highest.amount)} total spent
              </p>
              <div className="mt-3 h-1.5 bg-gray-100 dark:bg-[#2a2a2a] rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-400 rounded-full"
                  style={{
                    width: `${Math.min(
                      (highest.amount / totalExpenses) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {Math.round((highest.amount / totalExpenses) * 100)}% of total expenses
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-400">No data</p>
          )}
        </Card>

        <Card>
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Monthly Trend
            </p>
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                comparison && comparison.percentageChange <= 0
                  ? "bg-emerald-50 dark:bg-emerald-500/15"
                  : "bg-orange-50 dark:bg-orange-500/15"
              }`}
            >
              {comparison && comparison.percentageChange <= 0 ? (
                <TrendingDown size={14} className="text-emerald-500" />
              ) : (
                <TrendingUp size={14} className="text-orange-500" />
              )}
            </div>
          </div>
          {comparison ? (
            <>
              <p
                className={`text-xl font-bold ${
                  comparison.percentageChange <= 0
                    ? "text-emerald-500"
                    : "text-orange-500"
                }`}
              >
                {comparison.percentageChange > 0 ? "+" : ""}
                {comparison.percentageChange}%
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Expenses vs {comparison.previousMonth}
              </p>
              <div className="mt-3 flex justify-between text-xs">
                <div>
                  <p className="text-gray-400">{comparison.previousMonth}</p>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    {formatCurrency(comparison.previousExpenses)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400">{comparison.currentMonth}</p>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    {formatCurrency(comparison.currentExpenses)}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-400">Need 2+ months of data</p>
          )}
        </Card>

        <Card>
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Savings Rate
            </p>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center">
              <Wallet size={14} className="text-emerald-500" />
            </div>
          </div>
          <p
            className={`text-xl font-bold ${
              savingsRate >= 20 ? "text-emerald-500" : "text-orange-500"
            }`}
          >
            {savingsRate}%
          </p>
          <p className="text-xs text-gray-400 mt-1">Of total income saved</p>
          <div className="mt-3 h-1.5 bg-gray-100 dark:bg-[#2a2a2a] rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all"
              style={{ width: `${Math.min(savingsRate, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {savingsRate >= 20 ? "✓ Healthy savings" : "Below 20% target"}
          </p>
        </Card>

        <Card>
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              This Month
            </p>
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center">
              <PieChart size={14} className="text-blue-500" />
            </div>
          </div>
          {currentMonth ? (
            <>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(currentMonth.expenses)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Spent in {currentMonth.month}
              </p>
              <div className="mt-3 flex justify-between text-xs">
                <div>
                  <p className="text-gray-400">Income</p>
                  <p className="font-medium text-emerald-500">
                    +{formatCurrency(currentMonth.income)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400">Balance</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(currentMonth.balance)}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-400">No data</p>
          )}
        </Card>
      </div>

      <Card className="mt-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
          Spending by Category
        </p>
        <div className="flex flex-col gap-3">
          {categories.map((c, i) => (
            <div key={c.category} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-4">{i + 1}</span>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 dark:text-gray-200">{c.category}</span>
                  <span className="text-gray-500 dark:text-gray-400">{formatCurrency(c.amount)}</span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-[#2a2a2a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-400 rounded-full transition-all"
                    style={{
                      width: `${Math.round((c.amount / totalExpenses) * 100)}%`,
                    }}
                  />
                </div>
              </div>
              <span className="text-xs text-gray-400 w-8 text-right">
                {Math.round((c.amount / totalExpenses) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}