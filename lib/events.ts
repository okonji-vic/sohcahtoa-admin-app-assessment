import { Transaction } from "@/interfaces/transactions";
import { EventEmitter } from "events";


// Node-only in-memory pub/sub simulating live transaction events across SSE
// connections within a single server process. Not multi-instance safe — call
// this out in README as a scope cut (prod would use Redis pub/sub or similar).
export const transactionEvents = new EventEmitter();
transactionEvents.setMaxListeners(50);

export type TransactionEvent =
  | { type: "created"; transaction: Transaction }
  | { type: "updated"; transaction: Transaction };