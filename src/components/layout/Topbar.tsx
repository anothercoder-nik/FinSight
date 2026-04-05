"use client";

import { Bell, Moon, Sun } from "lucide-react";
import { useRoleStore } from "@/store/useRoleStore";
import { Role } from "@/types";

export default function Topbar() {
  const { role, setRole, isDark, toggleDark } = useRoleStore();

  return (
    <header className="h-14 md:h-16 bg-white dark:bg-[#1a1a1a] border-b border-gray-100 dark:border-[#2a2a2a] flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 transition-colors">
      <div className="flex items-center gap-3">
        <div className="md:hidden w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center">
          <span className="text-white font-bold text-xs">F</span>
        </div>
        <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Finance Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Role Selector */}
        <div className="relative">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="text-xs font-medium border border-gray-200 dark:border-[#2a2a2a] rounded-lg px-2 md:px-3 py-1.5 bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400 appearance-none pr-6"
          >
            <option value="viewer">👁 Viewer</option>
            <option value="admin">🛡 Admin</option>
          </select>
          {role === "admin" && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full notif-pulse" />
          )}
        </div>

        {/* Dark Mode */}
        <button
          onClick={toggleDark}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition btn-press"
          title={isDark ? "Light mode" : "Dark mode"}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition relative btn-press">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full notif-pulse" />
        </button>

        {/* Avatar */}
        <div className="hidden sm:flex w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-500/15 items-center justify-center">
          <span className="text-orange-600 dark:text-orange-400 text-xs font-bold">N</span>
        </div>
      </div>
    </header>
  );
}