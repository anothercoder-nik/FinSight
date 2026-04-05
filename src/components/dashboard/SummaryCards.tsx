"use client";

import Card from "@/components/ui/Card";
import { useTransactionStore } from "@/store/useTransactionStore";
import {
  getBalance,
  getTotalIncome,
  getTotalExpenses,
  formatCurrency,
  getMonthlyTotals,
} from "@/lib/utils";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

export default function SummaryCards() {
  const transactions = useTransactionStore((s) => s.transactions);

  const balance = getBalance(transactions);
  const income = getTotalIncome(transactions);
  const expenses = getTotalExpenses(transactions);

  const animatedBalance = useAnimatedCounter(balance);
  const animatedIncome = useAnimatedCounter(income);
  const animatedExpenses = useAnimatedCounter(expenses);

  const monthly = getMonthlyTotals(transactions);
  const lastMonth = monthly[monthly.length - 2];
  const currentMonth = monthly[monthly.length - 1];
  const balanceChange = currentMonth
    ? currentMonth.balance - (lastMonth?.balance ?? 0)
    : 0;
  const balanceChangePositive = balanceChange >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {/* Total Balance */}
      <Card className="col-span-1 animate-fade-up stagger-1" hover>
        <div className="flex items-start justify-between mb-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Total Balance
          </p>
          <div className="w-8 h-8 rounded-xl bg-gray-900 dark:bg-gray-100 flex items-center justify-center">
            <Wallet size={14} className="text-white dark:text-gray-900" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight tabular-nums">
          {formatCurrency(animatedBalance)}
        </p>
        <p
          className={`text-xs mt-2 font-medium flex items-center gap-1 ${
            balanceChangePositive ? "text-emerald-500" : "text-red-500"
          }`}
        >
          {balanceChangePositive ? (
            <TrendingUp size={12} />
          ) : (
            <TrendingDown size={12} />
          )}
          {balanceChangePositive ? "+" : ""}
          {formatCurrency(balanceChange)} vs last month
        </p>
      </Card>

      {/* Total Income */}
      <Card className="col-span-1 bg-orange-500 border-orange-500 animate-fade-up stagger-2" hover>
        <div className="flex items-start justify-between mb-3">
          <p className="text-xs font-medium text-orange-100 uppercase tracking-wider">
            Total Income
          </p>
          <div className="w-8 h-8 rounded-xl bg-orange-400 flex items-center justify-center">
            <TrendingUp size={14} className="text-white" />
          </div>
        </div>
        <p className="text-2xl font-bold text-white tracking-tight tabular-nums">
          {formatCurrency(animatedIncome)}
        </p>
        <p className="text-xs mt-2 font-medium text-orange-100">
          All time income
        </p>
      </Card>

      {/* Total Expenses */}
      <Card className="col-span-1 animate-fade-up stagger-3" hover>
        <div className="flex items-start justify-between mb-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Total Expenses
          </p>
          <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-500/15 flex items-center justify-center">
            <TrendingDown size={14} className="text-red-500" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight tabular-nums">
          {formatCurrency(animatedExpenses)}
        </p>
        <p className="text-xs mt-2 font-medium text-red-400">
          All time expenses
        </p>
      </Card>
    </div>
  );
}