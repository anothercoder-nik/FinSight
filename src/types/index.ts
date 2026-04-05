export type Category =
  | "Salary"
  | "Freelance"
  | "Grocery"
  | "Travel"
  | "Shopping"
  | "Bills"
  | "Food"
  | "Other";

export type TransactionType = "income" | "expense";

export type Role = "admin" | "viewer";

export type QuickFilter =
  | "all"
  | "this-month"
  | "last-month"
  | "high-value"
  | "income-only"
  | "expense-only";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: Category;
  type: TransactionType;
  note?: string;
}

export interface FilterState {
  search: string;
  category: Category | "All";
  type: TransactionType | "All";
  sortBy: "date" | "amount";
  sortOrder: "asc" | "desc";
  dateFrom: string;
  dateTo: string;
  amountMin: string;
  amountMax: string;
  quickFilter: QuickFilter;
}