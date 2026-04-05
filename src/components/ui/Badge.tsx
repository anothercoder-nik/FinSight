import { cn } from "@/lib/cn";
import { TransactionType } from "@/types";

const Badge = ({ type }: { type: TransactionType }) => (
  <span
    className={cn(
      "text-xs font-medium px-2.5 py-1 rounded-full",
      type === "income"
        ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
        : "bg-red-50 dark:bg-red-500/15 text-red-500 dark:text-red-400"
    )}
  >
    {type === "income" ? "Income" : "Expense"}
  </span>
);

export default Badge;