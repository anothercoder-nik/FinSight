"use client";

import { useEffect, useState } from "react";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useToastStore } from "@/store/useToastStore";
import { Category, Transaction, TransactionType } from "@/types";
import { X } from "lucide-react";

const CATEGORIES: Category[] = [
  "Salary", "Freelance", "Grocery", "Travel",
  "Shopping", "Bills", "Food", "Other",
];

interface Props {
  transaction?: Transaction | null;
  onClose: () => void;
}

export default function TransactionModal({ transaction, onClose }: Props) {
  const { addTransaction, editTransaction } = useTransactionStore();
  const addToast = useToastStore((s) => s.addToast);
  const isEdit = !!transaction;

  const [form, setForm] = useState({
    date: transaction?.date ?? new Date().toISOString().split("T")[0],
    amount: transaction?.amount?.toString() ?? "",
    category: transaction?.category ?? ("Salary" as Category),
    type: transaction?.type ?? ("income" as TransactionType),
    note: transaction?.note ?? "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (transaction) {
      setForm({
        date: transaction.date,
        amount: transaction.amount.toString(),
        category: transaction.category,
        type: transaction.type,
        note: transaction.note ?? "",
      });
    }
  }, [transaction]);

  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    const parsed = Number(form.amount);
    if (!form.amount || isNaN(parsed) || parsed <= 0) {
      setError("Enter a valid amount greater than 0");
      return;
    }
    if (!form.date) {
      setError("Date is required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEdit && transaction) {
        await editTransaction(transaction.id, { ...form, amount: parsed });
        addToast("Transaction updated ✓");
      } else {
        await addTransaction({
          id: crypto.randomUUID(),
          ...form,
          amount: parsed,
        });
        addToast("Transaction added ✓");
      }
      onClose();
    } catch {
      setError("Failed to save transaction");
      addToast("Failed to save", "error");
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdrop}
    >
      <div className="bg-white dark:bg-[#1a1a1a] rounded-t-2xl sm:rounded-2xl p-5 md:p-6 w-full sm:max-w-md shadow-xl animate-fade-up border border-transparent dark:border-[#2a2a2a] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {isEdit ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-[#2a2a2a] flex items-center justify-center text-gray-400 hover:bg-gray-200 dark:hover:bg-[#333] transition btn-press"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-[#2a2a2a]">
            {(["income", "expense"] as TransactionType[]).map((t) => (
              <button
                key={t}
                onClick={() => setForm((f) => ({ ...f, type: t }))}
                className={`flex-1 py-2 text-sm font-medium capitalize transition btn-press ${
                  form.type === t
                    ? t === "income"
                      ? "bg-emerald-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-white dark:bg-[#111] text-gray-400 hover:bg-gray-50 dark:hover:bg-[#222]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs text-gray-400 font-medium mb-1 block">
              Amount (₹)
            </label>
            <input
              type="number"
              placeholder="0"
              min="1"
              value={form.amount}
              onChange={(e) => {
                setError("");
                setForm((f) => ({ ...f, amount: e.target.value }));
              }}
              className="w-full border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 dark:text-gray-200 bg-white dark:bg-[#111]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 font-medium mb-1 block">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value as Category }))
                }
                className="w-full border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 dark:text-gray-200 bg-white dark:bg-[#111]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 font-medium mb-1 block">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => {
                  setError("");
                  setForm((f) => ({ ...f, date: e.target.value }));
                }}
                className="w-full border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 dark:text-gray-200 bg-white dark:bg-[#111]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-medium mb-1 block">
              Note <span className="text-gray-300 dark:text-gray-600">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Monthly salary, electricity bill..."
              value={form.note}
              onChange={(e) =>
                setForm((f) => ({ ...f, note: e.target.value }))
              }
              className="w-full border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 dark:text-gray-200 bg-white dark:bg-[#111] placeholder:text-gray-400 dark:placeholder:text-gray-600"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 font-medium -mt-1">{error}</p>
          )}

          <div className="flex gap-2 mt-1">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 border border-gray-200 dark:border-[#2a2a2a] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#222] font-medium py-2.5 rounded-xl text-sm transition disabled:opacity-50 btn-press"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-xl text-sm transition disabled:opacity-50 flex justify-center items-center gap-2 btn-press"
            >
              {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Add Transaction"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}