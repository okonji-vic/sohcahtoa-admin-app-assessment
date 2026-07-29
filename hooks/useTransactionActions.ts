"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { flagTransactionApi, addTransactionNoteApi } from "@/services/transactions";
import { Transaction, TransactionPage } from "@/interfaces/transactions";


// Patches every cached transactions page (not just the current one) that
// contains this row — keepPreviousData from Phase 2 means several pages can
// be cached at once, and all of them need to agree once the mutation lands.
function patchAllCachedPages(
  queryClient: ReturnType<typeof useQueryClient>,
  id: string,
  patch: Partial<Transaction>
) {
  const previous = queryClient.getQueriesData<TransactionPage>({ queryKey: ["transactions"] });
  queryClient.setQueriesData<TransactionPage>({ queryKey: ["transactions"] }, (old) => {
    if (!old || !old.items.some((t) => t.id === id)) return old;
    return { ...old, items: old.items.map((t) => (t.id === id ? { ...t, ...patch } : t)) };
  });
  return previous; // snapshot for rollback
}

function reconcile(queryClient: ReturnType<typeof useQueryClient>, updated: Transaction) {
  queryClient.setQueriesData<TransactionPage>({ queryKey: ["transactions"] }, (old) => {
    if (!old || !old.items.some((t) => t.id === updated.id)) return old;
    return { ...old, items: old.items.map((t) => (t.id === updated.id ? updated : t)) };
  });
}

function rollback(queryClient: ReturnType<typeof useQueryClient>, snapshot: ReturnType<typeof patchAllCachedPages>) {
  snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data));
}

export function useFlagTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, flagged }: { id: string; flagged: boolean }) => flagTransactionApi(id, flagged),
    onMutate: async ({ id, flagged }) => {
      await queryClient.cancelQueries({ queryKey: ["transactions"] });
      return { previous: patchAllCachedPages(queryClient, id, { status: flagged ? "flagged" : "pending" }) };
    },
    onError: (_err, _vars, ctx) => ctx && rollback(queryClient, ctx.previous),
    onSuccess: (updated) => reconcile(queryClient, updated), // trust server's final state over the guess
  });
}

export function useAddTransactionNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) => addTransactionNoteApi(id, note),
    onMutate: async ({ id, note }) => {
      await queryClient.cancelQueries({ queryKey: ["transactions"] });
      return { previous: patchAllCachedPages(queryClient, id, { note }) };
    },
    onError: (_err, _vars, ctx) => ctx && rollback(queryClient, ctx.previous),
    onSuccess: (updated) => reconcile(queryClient, updated),
  });
}