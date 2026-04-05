"use client";

import { useTransactionStore } from "@/store/useTransactionStore";
import { useRoleStore } from "@/store/useRoleStore";
import { useToastStore } from "@/store/useToastStore";
import { applyFilters, formatCurrency, getRelativeDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { Pencil, Trash2 } from "lucide-react";
import { Transaction } from "@/types";

const CATEGORY_COLORS: Record<string, string> = {
  Salary: "bg-emerald-500",
  Freelance: "bg-blue-500",
  Grocery: "bg-orange-400",
  Travel: "bg-purple-500",
  Shopping: "bg-red-400",
  Bills: "bg-yellow-500",
  Food: "bg-pink-400",
  Other: "bg-gray-400",
};

interface Props {
  onEdit: (transaction: Transaction) => void;
}

export default function TransactionTable({ onEdit }: Props) {
  const { transactions, filters, deleteTransaction } = useTransactionStore();
  const { role } = useRoleStore();
  const addToast = useToastStore((s) => s.addToast);

  const filtered = applyFilters(transactions, filters);

  async function handleDelete(id: string) {
    await deleteTransaction(id);
    addToast("Transaction deleted", "info");
  }

  if (filtered.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title="No transactions found"
        description="Try adjusting your filters or adding a new transaction"
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 dark:border-[#2a2a2a]">
            {["Date", "Category", "Note", "Amount", "Type", ...(role === "admin" ? ["Actions"] : [])].map(
              (h) => (
                <th
                  key={h}
                  className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 pr-4"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-[#2a2a2a]">
          {filtered.map((t, i) => {
            const relDate = getRelativeDate(t.date);
            return (
              <tr
                key={t.id}
                className={`hover:bg-gray-50 dark:hover:bg-[#222] transition-colors group ${
                  t.type === "income" ? "row-income" : "row-expense"
                }`}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <td className="py-3 pr-4 whitespace-nowrap">
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    {new Date(t.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  {relDate && (
                    <span className="ml-1.5 text-[10px] font-medium text-orange-500 bg-orange-50 dark:bg-orange-500/10 px-1.5 py-0.5 rounded-full">
                      {relDate}
                    </span>
                  )}
                </td>

                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                        CATEGORY_COLORS[t.category] ?? "bg-gray-400"
                      }`}
                    >
                      {t.category[0]}
                    </span>
                    <span className="font-medium text-gray-700 dark:text-gray-200">{t.category}</span>
                  </div>
                </td>

                <td className="py-3 pr-4 text-gray-400 dark:text-gray-500 text-xs max-w-[140px] truncate">
                  {t.note ?? "—"}
                </td>

                <td className={`py-3 pr-4 font-semibold ${
                  t.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-gray-100"
                }`}>
                  {t.type === "expense" ? "−" : "+"}{formatCurrency(t.amount)}
                </td>

                <td className="py-3 pr-4">
                  <Badge type={t.type} />
                </td>

                {role === "admin" && (
                  <td className="py-3">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(t)}
                        className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/15 text-blue-500 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-500/25 transition btn-press"
                        title="Edit"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-500/15 text-red-500 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-500/25 transition btn-press"
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}