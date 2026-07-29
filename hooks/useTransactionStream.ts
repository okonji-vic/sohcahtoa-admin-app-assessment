"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {Transaction, TransactionQuery, TransactionPage } from "@/interfaces/transactions";
import { registerEventSource } from "@/lib/session-controller";

interface Options {
  params: TransactionQuery;
  enabled?: boolean;
}

export function useTransactionStream({ params, enabled = true }: Options) {
  const queryClient = useQueryClient();
  const paramsRef = useRef(params);
  
  
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    // Effect body only runs client-side, post-mount — SSE never opens during
    // SSR, so there's nothing for the server-rendered HTML to mismatch against.
    if (!enabled) return;

    const source = new EventSource("/api/transactions/stream");
    const unregister = registerEventSource(source)

    source.onmessage = (evt) => {
      const payload: { type: "created" | "updated"; transaction: Transaction } = JSON.parse(evt.data);
      const current = paramsRef.current;
      const queryKey = ["transactions", current] as const;

      queryClient.setQueryData<TransactionPage>(queryKey, (old) => {
        if (!old) return old;

        if (payload.type === "updated") {
          // No-op if the row isn't on this page — every other row keeps its
          // object identity, so antd only re-renders the one changed row.
          if (!old.items.some((t) => t.id === payload.transaction.id)) return old;
          return {
            ...old,
            items: old.items.map((t) => (t.id === payload.transaction.id ? payload.transaction : t)),
          };
        }

        // "created": only splice into view on the page a brand-new row would
        // actually belong on — unfiltered, first page, sorted by newest.
        // Any other page/filter/sort is left untouched; the row is simply
        // there next time that query runs. This is what "preserve pagination
        // + filters" means in practice.
        const isUnfilteredFirstPage =
          current.page === 1 &&
          !current.status &&
          !current.dateFrom &&
          !current.dateTo &&
          (!current.sortField || current.sortField === "createdAt");
        if (!isUnfilteredFirstPage) return old;

        // Dedup guard against reconnect replay or a race with a manual refetch.
        if (old.items.some((t) => t.id === payload.transaction.id)) return old;

        return {
          ...old,
          items: [payload.transaction, ...old.items].slice(0, current.pageSize),
          total: old.total + 1,
        };
      });
    };

    // EventSource auto-reconnects on network blips; explicit close only on unmount.
    return () => {
        unregister();
        source.close();
      };
  }, [enabled, queryClient]);
}