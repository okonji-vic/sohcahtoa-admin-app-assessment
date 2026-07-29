import { Transaction, TransactionPage, TransactionQuery, TransactionStatus } from "@/interfaces/transactions";
import { maskCardNumber } from "@/utils/maskdetails";
import { transactionEvents } from "./events";

const STATUSES: TransactionStatus[] = ["pending", "completed", "failed", "flagged"];


function seedTransactions(count: number): Transaction[] {
  const out: Transaction[] = [];
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    out.push({
      id: `txn_${i.toString().padStart(5, "0")}`,
      reference: `REF-${100000 + i}`,
      amount: Math.round((Math.random() * 5000 + 10) * 100) / 100,
      currency: "USD",
      status: STATUSES[i % STATUSES.length],
      // deliberately seeded once, to exercise the Section 5.1 XSS requirement
      counterparty: i % 11 === 0 ? '<script>alert("xss")</script>' : `Counterparty ${i % 50}`,
      cardNumber: maskCardNumber((4000000000000000 + i).toString()),
      createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
    });
  }
  return out;
}

// Module-level, in-memory. Survives across requests in dev; resets on cold
// start in serverless — acceptable for an assessment mock, called out in README.
const ALL_TRANSACTIONS: Transaction[] = seedTransactions(237);


export const DEFAULT_TRANSACTION_QUERY: TransactionQuery = { page: 1, pageSize: 10 };

// Single source of truth for the query logic — called directly by the Server
// Component AND by the Route Handler, so there's exactly one implementation
// of pagination/sort/filter, not two that can drift apart.
export async function getTransactions(query: TransactionQuery): Promise<TransactionPage> {
  await new Promise((r) => setTimeout(r, 350)); // visible latency for loading states

  let rows = ALL_TRANSACTIONS;

  if (query.status) rows = rows.filter((t) => t.status === query.status);
  if (query.dateFrom) {
    const from = new Date(query.dateFrom).getTime();
    rows = rows.filter((t) => new Date(t.createdAt).getTime() >= from);
  }
  if (query.dateTo) {
    const to = new Date(query.dateTo).getTime();
    rows = rows.filter((t) => new Date(t.createdAt).getTime() <= to);
  }

  if (query.sortField) {
    const field = query.sortField;
    const dir = query.sortOrder === "ascend" ? 1 : -1;
    rows = [...rows].sort((a, b) => {
      const av = a[field]!, bv = b[field]!;
      if (av === bv) return 0;
      return av > bv ? dir : -dir;
    });
  }

  const total = rows.length;
  const start = (query.page - 1) * query.pageSize;
  return { items: rows.slice(start, start + query.pageSize), total, page: query.page, pageSize: query.pageSize };
}


export function getTransactionById(id: string): Transaction | undefined {
  return ALL_TRANSACTIONS.find((t) => t.id === id);
}

function emitUpdate(t: Transaction) {
  transactionEvents.emit("transaction", { type: "updated", transaction: t });
}

// Used by Phase 4 mutations (flag / note) AND by the Phase 3 simulator —
// one code path, so every state change is broadcast the same way regardless
// of source.
export function flagTransaction(id: string, flagged: boolean): Transaction {
  const idx = ALL_TRANSACTIONS.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error("Transaction not found");
  ALL_TRANSACTIONS[idx] = { ...ALL_TRANSACTIONS[idx], status: flagged ? "flagged" : "pending" };
  emitUpdate(ALL_TRANSACTIONS[idx]);
  return ALL_TRANSACTIONS[idx];
}

export function addTransactionNote(id: string, note: string): Transaction {
  const idx = ALL_TRANSACTIONS.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error("Transaction not found");
  ALL_TRANSACTIONS[idx] = { ...ALL_TRANSACTIONS[idx], note };
  emitUpdate(ALL_TRANSACTIONS[idx]);
  return ALL_TRANSACTIONS[idx];
}

// Simulator helpers (Phase 3 only)

export function createRandomTransaction(): Transaction {
  const id = `txn_${Date.now()}`;
  const t: Transaction = {
    id,
    reference: `REF-${Math.floor(Math.random() * 900000 + 100000)}`,
    amount: Math.round((Math.random() * 5000 + 10) * 100) / 100,
    currency: "USD",
    status: "pending",
    counterparty: `Counterparty ${Math.floor(Math.random() * 50)}`,
    cardNumber: `**** **** **** ${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
  };
  ALL_TRANSACTIONS.unshift(t);
  transactionEvents.emit("transaction", { type: "created", transaction: t });
  return t;
}

export function updateRandomTransactionStatus(): Transaction | null {
  if (ALL_TRANSACTIONS.length === 0) return null;
  const idx = Math.floor(Math.random() * Math.min(ALL_TRANSACTIONS.length, 30)); // bias toward recent rows
  const statuses: Transaction["status"][] = ["pending", "completed", "failed"];
  const next = statuses[Math.floor(Math.random() * statuses.length)];
  ALL_TRANSACTIONS[idx] = { ...ALL_TRANSACTIONS[idx], status: next };
  emitUpdate(ALL_TRANSACTIONS[idx]);
  return ALL_TRANSACTIONS[idx];
}