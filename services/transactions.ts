import api from "@/config/api-client";
import { Transaction, TransactionPage, TransactionQuery } from "@/interfaces/transactions";


export async function fetchTransactions(params: TransactionQuery): Promise<TransactionPage> {
  const { data } = await api.get<TransactionPage>("/api/transactions", { params });
  return data;
}

export async function flagTransactionApi(id: string, flagged: boolean) {
    const { data } = await api.patch(`/api/transactions/${id}`, { action: flagged ? "flag" : "unflag" });
    return data.transaction as Transaction;
  }
  
  export async function addTransactionNoteApi(id: string, note: string) {
    const { data } = await api.patch(`/api/transactions/${id}`, { action: "note", note });
    return data.transaction as Transaction;
  }