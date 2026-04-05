"use client";

import { useEffect } from "react";
import { useTransactionStore } from "@/store/useTransactionStore";

export default function DataProvider({ children }: { children: React.ReactNode }) {
  const { fetchTransactions, transactions } = useTransactionStore();

  useEffect(() => {
    if (transactions.length === 0) {
      fetchTransactions();
    }
  }, []);

  return <>{children}</>;
}
