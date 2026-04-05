"use client";

import { LayoutDashboard, ArrowLeftRight, Lightbulb } from "lucide-react";
import { useScrollSpy } from "@/hooks/useScrollSpy";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", target: "dashboard" },
  { icon: ArrowLeftRight, label: "Transactions", target: "transactions" },
  { icon: Lightbulb, label: "Insights", target: "insights" },
];

const sectionIds = navItems.map((item) => item.target);

export default function Sidebar() {
  const active = useScrollSpy(sectionIds);

  function scrollTo(index: number) {
    const el = document.getElementById(navItems[index].target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-16 bg-white dark:bg-[#1a1a1a] border-r border-gray-100 dark:border-[#2a2a2a] flex-col items-center py-6 gap-2 z-20 transition-colors">
        <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center mb-6">
          <span className="text-white font-bold text-sm">F</span>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item, i) => (
            <button
              key={item.label}
              onClick={() => scrollTo(i)}
              title={item.label}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 btn-press relative
                ${active === i
                  ? "bg-orange-500 text-white shadow-sm shadow-orange-300/30 dark:shadow-orange-900/30"
                  : "text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] hover:text-gray-600 dark:hover:text-gray-300"
                }`}
            >
              <item.icon size={18} />
              {active === i && (
                <span className="absolute -right-[7px] w-[3px] h-4 bg-orange-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Keyboard shortcuts hint */}
        <div className="mb-2">
          <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-[#222] flex items-center justify-center group relative cursor-default">
            <span className="text-[10px] text-gray-400 font-mono font-bold">?</span>
            <div className="absolute left-12 bottom-0 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] rounded-xl p-3 shadow-lg hidden group-hover:block w-44 z-50 animate-fade-up">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Shortcuts</p>
              <div className="flex flex-col gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Search</span>
                  <kbd className="text-[10px] border border-gray-200 dark:border-[#333] rounded px-1 py-0.5 font-mono text-gray-400">/</kbd>
                </div>
                <div className="flex justify-between">
                  <span>New txn</span>
                  <kbd className="text-[10px] border border-gray-200 dark:border-[#333] rounded px-1 py-0.5 font-mono text-gray-400">N</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Close modal</span>
                  <kbd className="text-[10px] border border-gray-200 dark:border-[#333] rounded px-1 py-0.5 font-mono text-gray-400">Esc</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white dark:bg-[#1a1a1a] border-t border-gray-100 dark:border-[#2a2a2a] flex items-center justify-around z-20 transition-colors">
        {navItems.map((item, i) => (
          <button
            key={item.label}
            onClick={() => scrollTo(i)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all duration-200 btn-press
              ${active === i
                ? "text-orange-500"
                : "text-gray-400"
              }`}
          >
            <item.icon size={18} />
            <span className="text-[10px] font-medium">{item.label}</span>
            {active === i && (
              <span className="absolute bottom-1 w-4 h-0.5 bg-orange-500 rounded-full" />
            )}
          </button>
        ))}
      </nav>
    </>
  );
}