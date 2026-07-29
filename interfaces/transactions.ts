export interface ITransaction {
    id: string
    reference: string
    timestamp: string
    amount: number
    currency: string
    status: 'completed' | 'pending' | 'failed'
    merchant: string
    category: string
    cardLast4: string
    risk_score?: number
    flagged?: boolean
    fraud_indicator?: string
    notes?: string
}
  
export type TransactionStatus = "pending" | "completed" | "failed" | "flagged";

export interface Transaction {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  counterparty: string;
  cardNumber: string; // already masked at the source — see Section 5.4
  note?: string;
  createdAt: string; // ISO
}


export interface TransactionQuery {
  page: number;
  pageSize: number;
  sortField?: keyof Transaction;
  sortOrder?: "ascend" | "descend";
  status?: TransactionStatus;
  dateFrom?: string;
  dateTo?: string;
}

export interface TransactionPage {
  items: Transaction[];
  total: number;
  page: number;
  pageSize: number;
}