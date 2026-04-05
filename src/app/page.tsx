"use client";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import DataProvider from "@/components/layout/DataProvider";
import ToastContainer from "@/components/ui/Toast";
import Greeting from "@/components/dashboard/Greeting";
import SummaryCards from "@/components/dashboard/SummaryCards";
import BalanceTrendChart from "@/components/dashboard/BalanceTrendChart";
import SpendingPieChart from "@/components/dashboard/SpendingPieChart";
import TransactionsSection from "@/components/transactions/TransactionsSection";
import InsightsSection from "@/components/insights/InsightsSection";
import { useTransactionStore } from "@/store/useTransactionStore";

function DashboardContent() {
  const isLoading = useTransactionStore((s) => s.isLoading);

  if (isLoading) {
    return (
      <div className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <div className="h-9 w-72 bg-gray-200 dark:bg-[#2a2a2a] rounded-lg animate-pulse" />
          <div className="h-4 w-56 bg-gray-100 dark:bg-[#222] rounded mt-2 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 dark:bg-[#1a1a1a] rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-64 bg-gray-100 dark:bg-[#1a1a1a] rounded-2xl animate-pulse" />
          <div className="h-64 bg-gray-100 dark:bg-[#1a1a1a] rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
      <section id="dashboard" className="scroll-mt-16">
        <Greeting />
        <SummaryCards />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <BalanceTrendChart />
          </div>
          <div className="lg:col-span-1">
            <SpendingPieChart />
          </div>
        </div>
      </section>
      <section id="transactions" className="scroll-mt-16">
        <TransactionsSection />
      </section>
      <section id="insights" className="scroll-mt-16">
        <InsightsSection />
      </section>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <DataProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 md:ml-16 flex flex-col pb-20 md:pb-0">
          <Topbar />
          <DashboardContent />
        </div>
      </div>
      <ToastContainer />
    </DataProvider>
  );
}