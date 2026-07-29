"use client";

import { TransactionStatus } from "@/interfaces/transactions";
import { Select, DatePicker } from "antd";


const { RangePicker } = DatePicker;

interface Props {
  status?: TransactionStatus;
  dateFrom?: string;
  dateTo?: string;
  onStatusChange: (status?: TransactionStatus) => void;
  onDateRangeChange: (from?: string, to?: string) => void;
}

const STATUS_OPTIONS: { label: string; value: TransactionStatus }[] = [
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
  { label: "Flagged", value: "flagged" },
];

export default function TransactionFilters({ status, onStatusChange, onDateRangeChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <Select
        allowClear
        placeholder="Filter by status"
        style={{ width: 180 }}
        value={status}
        options={STATUS_OPTIONS}
        onChange={(val) => onStatusChange(val)}
      />
      <RangePicker
        onChange={(_, dateStrings) => {
          const [from, to] = dateStrings;
          onDateRangeChange(from || undefined, to || undefined);
        }}
      />
    </div>
  );
}