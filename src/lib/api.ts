import { Transaction } from "@/types";
import { mockTransactions } from "@/data/mockTransactions";

const DELAY_MS = 400;

function delay(ms = DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let db: Transaction[] = [...mockTransactions];

export async function fetchTransactions(): Promise<Transaction[]> {
  await delay();
  return [...db];
}

export async function createTransaction(
  transaction: Transaction
): Promise<Transaction> {
  await delay(300);
  db = [transaction, ...db];
  return transaction;
}

export async function updateTransaction(
  id: string,
  data: Partial<Transaction>
): Promise<Transaction> {
  await delay(300);
  const index = db.findIndex((t) => t.id === id);
  if (index === -1) throw new Error("Transaction not found");
  db[index] = { ...db[index], ...data };
  return db[index];
}

export async function deleteTransaction(id: string): Promise<void> {
  await delay(200);
  db = db.filter((t) => t.id !== id);
}
