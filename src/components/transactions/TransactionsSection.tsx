"use client";

import { useState, useEffect, useCallback } from "react";
import Card from "@/components/ui/Card";
import TransactionFilters from "./TransactionFilters";
import TransactionTable from "./TransactionTable";
import TransactionModal from "./TransactionModal";
import { useRoleStore } from "@/store/useRoleStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { applyFilters, exportToCSV, exportToJSON } from "@/lib/utils";
import { Transaction } from "@/types";
import { Plus, Download, ChevronDown } from "lucide-react";

export default function TransactionsSection() {
  const { role } = useRoleStore();
  const { transactions, filters } = useTransactionStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  const filtered = applyFilters(transactions, filters);

  function handleEdit(t: Transaction) {
    setEditingTransaction(t);
    setModalOpen(true);
  }

  function handleClose() {
    setModalOpen(false);
    setEditingTransaction(null);
  }

  const openNewModal = useCallback(() => {
    setEditingTransaction(null);
    setModalOpen(true);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "/") {
        e.preventDefault();
        const search = document.getElementById("transaction-search");
        search?.focus();
        search?.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      if (e.key === "n" && role === "admin") {
        e.preventDefault();
        openNewModal();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [role, openNewModal]);

  return (
    <section className="mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Transactions</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {filtered.length} transaction{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export dropdown */}
          <div className="relative">
            <button
              onClick={() => setExportOpen(!exportOpen)}
              className="flex items-center gap-2 border border-gray-200 dark:border-[#2a2a2a] hover:border-gray-300 dark:hover:border-[#3a3a3a] text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 text-sm font-medium px-3 md:px-4 py-2 rounded-xl transition bg-white dark:bg-[#1a1a1a] btn-press"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export</span>
              <ChevronDown size={12} className={`transition-transform duration-200 ${exportOpen ? "rotate-180" : ""}`} />
            </button>

            {exportOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setExportOpen(false)} />
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] rounded-xl shadow-lg z-20 py-1 min-w-[140px] animate-fade-up">
                  <button
                    onClick={() => { exportToCSV(filtered); setExportOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#222] transition"
                  >
                    📄 Export CSV
                  </button>
                  <button
                    onClick={() => { exportToJSON(filtered); setExportOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#222] transition"
                  >
                    📋 Export JSON
                  </button>
                </div>
              </>
            )}
          </div>

          {role === "admin" && (
            <button
              onClick={openNewModal}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-3 md:px-4 py-2 rounded-xl transition btn-press"
              title="Press N to add"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Add Transaction</span>
              <span className="sm:hidden">Add</span>
            </button>
          )}
        </div>
      </div>

      <Card>
        <TransactionFilters />
        <TransactionTable onEdit={handleEdit} />
      </Card>

      {modalOpen && (
        <TransactionModal
          transaction={editingTransaction}
          onClose={handleClose}
        />
      )}
    </section>
  );
}