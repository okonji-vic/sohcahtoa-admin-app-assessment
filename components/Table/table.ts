import type { TablePaginationConfig } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";

export interface ITableProps<T> {
  columns: ColumnsType<T>;
  dataSource: T[];
  loading: boolean;
  pageTotal: number;
  currentPage: number;
  pageSize: number;
  rowKey?: TableProps<T>["rowKey"];
  onRow?: TableProps<T>["onRow"];
  rowClassName?: TableProps<T>["rowClassName"];
  showHeader?: boolean;
  rowSelection?: TableProps<T>["rowSelection"];
  scroll?: { x?: string | number; y?: string | number };
  hasPagination?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  // Full antd Table onChange — page, pageSize, sort AND filters in one
  // callback, so server-side sort/paginate/filter share one code path.
  onTableChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[]
  ) => void;
}