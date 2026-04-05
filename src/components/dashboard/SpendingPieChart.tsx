"use client";

import Card from "@/components/ui/Card";
import { useTransactionStore } from "@/store/useTransactionStore";
import { groupByCategory, formatCurrency } from "@/lib/utils";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#f97316", "#fb923c", "#fbbf24",
  "#34d399", "#60a5fa", "#a78bfa", "#f472b6",
];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] rounded-xl p-2.5 shadow-lg text-xs">
      <p className="font-semibold text-gray-700 dark:text-gray-200">{payload[0].name}</p>
      <p className="text-orange-500">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export default function SpendingPieChart() {
  const transactions = useTransactionStore((s) => s.transactions);
  const data = groupByCategory(transactions);

  if (data.length === 0) {
    return (
      <Card>
        <p className="text-xs text-gray-400 text-center py-8">No expense data</p>
      </Card>
    );
  }

  return (
    <Card>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
        Spending Breakdown
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-col gap-1.5 mt-2">
        {data.map((d, i) => (
          <div key={d.category} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">{d.category}</span>
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {formatCurrency(d.amount)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}