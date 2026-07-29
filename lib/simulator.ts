import { createRandomTransaction, updateRandomTransactionStatus } from "./mock-transactions";


declare global {
  var __txnSimulatorStarted: boolean | undefined;
}

// Guarded by a global flag (not module state) so it survives Next.js dev
// hot-reload re-evaluating this module — without it, every HMR reload would
// spin up a duplicate interval and events would double up.
export function ensureSimulatorRunning() {
  if (globalThis.__txnSimulatorStarted) return;
  globalThis.__txnSimulatorStarted = true;

  setInterval(() => {
    if (Math.random() > 0.5) createRandomTransaction();
    else updateRandomTransactionStatus();
  }, 4000);
}