"use client";

import { ColumnsType } from "antd/es/table";
import { Tag } from "antd";
import { Transaction, TransactionStatus } from "@/interfaces/transactions";


const STATUS_COLOR: Record<TransactionStatus, string> = {
  pending: "gold",
  completed: "green",
  failed: "red",
  flagged: "volcano",
};

interface ColumnOpts {
  sortField?: string;
  sortOrder?: "ascend" | "descend";
}

export function getTransactionColumns({ sortField, sortOrder }: ColumnOpts): ColumnsType<Transaction> {
  const sortOrderFor = (field: string) => (sortField === field ? sortOrder : undefined);

  return [
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
      sorter: true,
      sortOrder: sortOrderFor("reference"),
      // Plain text interpolation — React escapes this automatically, so a
      // counterparty value like "<script>...</script>" renders as inert text,
      // never as markup. This is the Section 5.1 mitigation: never reach for
      // dangerouslySetInnerHTML here, and there's no need to.
      render: (value: string) => <span>{value}</span>,
    },
    {
      title: "Counterparty",
      dataIndex: "counterparty",
      key: "counterparty",
      render: (value: string) => <span>{value}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: true,
      sortOrder: sortOrderFor("amount"),
      render: (value: number, row) => `${row.currency} ${value.toFixed(2)}`,
    },
    {
      title: "Card",
      dataIndex: "cardNumber",
      key: "cardNumber",
      // Already masked server-side (Section 5.4) — never send the full PAN
      // over the wire in the first place, not just hide it in the UI.
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: true,
      sortOrder: sortOrderFor("status"),
      render: (status: TransactionStatus) => <Tag color={STATUS_COLOR[status]}>{status.toUpperCase()}</Tag>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      sortOrder: sortOrderFor("createdAt"),
      defaultSortOrder: "descend",
      render: (value: string) => new Date(value).toLocaleString(),
    },
  ];
}