
"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchTransactions } from "@/services/transactions";
import { TransactionPage, TransactionQuery } from "@/interfaces/transactions";


export function useTransactions(params: TransactionQuery, initialData?: TransactionPage) {
  return useQuery({
    queryKey: ["transactions", params] as const,
    queryFn: () => fetchTransactions(params),
    // Keep last page's rows visible while the next page/sort/filter loads,
    // instead of flashing to the loading/empty state on every interaction.
    placeholderData: keepPreviousData,
    initialData,
    staleTime: 15_000,
  });
}