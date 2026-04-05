import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Transaction, FilterState } from "@/types";
import * as api from "@/lib/api";

interface TransactionStore {
  transactions: Transaction[];
  filters: FilterState;
  isLoading: boolean;
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Transaction) => Promise<void>;
  editTransaction: (id: string, updated: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  search: "",
  category: "All",
  type: "All",
  sortBy: "date",
  sortOrder: "desc",
  dateFrom: "",
  dateTo: "",
  amountMin: "",
  amountMax: "",
  quickFilter: "all",
};

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set) => ({
      transactions: [],
      filters: defaultFilters,
      isLoading: false,

      fetchTransactions: async () => {
        set({ isLoading: true });
        const data = await api.fetchTransactions();
        set({ transactions: data, isLoading: false });
      },

      addTransaction: async (transaction) => {
        await api.createTransaction(transaction);
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        }));
      },

      editTransaction: async (id, updated) => {
        await api.updateTransaction(id, updated);
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updated } : t
          ),
        }));
      },

      deleteTransaction: async (id) => {
        await api.deleteTransaction(id);
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },

      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),

      resetFilters: () => set({ filters: defaultFilters }),
    }),
    {
      name: "finflow-transactions",
      partialize: (state) => ({ transactions: state.transactions }),
    }
  )
);