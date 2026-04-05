"use client";

import { useToastStore } from "@/store/useToastStore";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const colors = {
  success: "bg-emerald-500",
  error: "bg-red-500",
  info: "bg-blue-500",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className="flex items-center gap-3 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] rounded-xl px-4 py-3 shadow-lg animate-slide-in min-w-[260px] max-w-[340px]"
          >
            <div
              className={`w-6 h-6 rounded-full ${colors[toast.type]} flex items-center justify-center flex-shrink-0`}
            >
              <Icon size={12} className="text-white" />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-200 flex-1">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-300 transition flex-shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
