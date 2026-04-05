"use client";

import Card from "@/components/ui/Card";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useRoleStore } from "@/store/useRoleStore";
import { getMonthlyTotals, formatCurrency } from "@/lib/utils";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] rounded-xl p-3 shadow-lg text-xs">
      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
      <p className="text-emerald-500">Income: {formatCurrency(payload[0]?.value)}</p>
      <p className="text-red-400">Expenses: {formatCurrency(payload[1]?.value)}</p>
      <p className="text-gray-900 dark:text-gray-100 font-bold">Balance: {formatCurrency(payload[2]?.value)}</p>
    </div>
  );
}

export default function BalanceTrendChart() {
  const transactions = useTransactionStore((s) => s.transactions);
  const isDark = useRoleStore((s) => s.isDark);
  const data = getMonthlyTotals(transactions);

  const gridColor = isDark ? "#2a2a2a" : "#f0f0f0";
  const tickColor = isDark ? "#6b7280" : "#9ca3af";

  return (
    <Card className="mb-4">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
        Balance Trend
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: tickColor }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: tickColor }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${v / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#f87171"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#f97316"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#f97316" }}
          />
        </LineChart>
      </ResponsiveContainer>
      {/* Legend */}
      <div className="flex gap-4 mt-3">
        {[
          { color: "bg-emerald-400", label: "Income" },
          { color: "bg-red-400", label: "Expenses" },
          { color: "bg-orange-500", label: "Balance" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${l.color}`} />
            <span className="text-xs text-gray-400">{l.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}