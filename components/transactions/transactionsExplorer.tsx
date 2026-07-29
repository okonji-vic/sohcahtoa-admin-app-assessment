"use client";

import { useMemo, useState } from "react";
import type { TablePaginationConfig } from "antd";
import type { SorterResult } from "antd/es/table/interface";
import SohcahtoaTable from "@/components/Table";
import ErrorState from "@/components/Table/ErrorState";
import { useTransactions } from "@/hooks/useTransactions";
import { getTransactionColumns } from "./columns";
import TransactionFilters from "./transactionFilters";
import { Transaction, TransactionPage, TransactionQuery } from "@/interfaces/transactions";
import { DEFAULT_TRANSACTION_QUERY } from "@/lib/mock-transactions";
import { useTransactionStream } from "@/hooks/useTransactionStream";
import TransactionDetailPanel from "./transactionDetailPanel";
import { JwtClaims } from "@/lib/jwt";


interface Props {
  initialData: TransactionPage;
  session?: JwtClaims;
}

export default function TransactionsExplorer({ initialData, session }: Props) {
  const [params, setParams] = useState<TransactionQuery>(DEFAULT_TRANSACTION_QUERY);
  const [selected, setSelected] = useState<Transaction | null>(null);

  // initialData only seeds the cache for the exact query the server already
  // fetched. Once the user paginates/sorts/filters, params no longer match
  // the default and this becomes undefined — React Query fetches normally,
  // so we never risk showing stale server data under a mismatched query.
  const isDefaultParams = useMemo(
    () => JSON.stringify(params) === JSON.stringify(DEFAULT_TRANSACTION_QUERY),
    [params]
  );

  const { data, isLoading, isFetching, isError, refetch } = useTransactions(
    params,
    isDefaultParams ? initialData : undefined
  );

  const handleStatusChange = (status?: Transaction["status"]) => {
    setParams((p) => ({ ...p, status, page: 1 }));
  };

  const handleDateRangeChange = (dateFrom?: string, dateTo?: string) => {
    setParams((p) => ({ ...p, dateFrom, dateTo, page: 1 }));
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _filters: unknown,
    sorter: SorterResult<Transaction> | SorterResult<Transaction>[]
  ) => {
    const s = Array.isArray(sorter) ? sorter[0] : sorter;
    setParams((p) => ({
      ...p,
      page: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? p.pageSize,
      sortField: s?.order ? (s.field as TransactionQuery["sortField"]) : undefined,
      sortOrder: s?.order ?? undefined,
    }));
  };

  const columns = useMemo(
    () => getTransactionColumns({ sortField: params.sortField, sortOrder: params.sortOrder }),
    [params.sortField, params.sortOrder]
  );

    // patches component cache
    useTransactionStream({ params });

  return (
    <div>
      <TransactionFilters
        status={params.status}
        onStatusChange={handleStatusChange}
        onDateRangeChange={handleDateRangeChange}
      />

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <SohcahtoaTable<Transaction>
          columns={columns}
          dataSource={data?.items ?? []}
          loading={isLoading || isFetching}
          rowKey="id"
          currentPage={params.page}
          pageSize={params.pageSize}
          pageTotal={data?.total ?? 0}
          onTableChange={handleTableChange}
          onRow={(record) => ({ onClick: () => setSelected(record) })}
          emptyMessage="No transactions found"
          emptyDescription="Try adjusting your filters or date range"
        />
      )}
      
      <TransactionDetailPanel
        transaction={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        session={session}
      />
    </div>
  );
}