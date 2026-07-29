"use client";

import React, { useMemo } from "react";
import { Table, TablePaginationConfig } from "antd";
import { TableCompContainer } from "./styles";
import { pageItemRender } from "./PageItemRender";
import { ITableProps } from "./table";
import EmptyTable from "./EmptyTable";
import Loader from "../loader";

const LOADING_INDICATOR = (
    <div className="w-full h-auto flex items-center justify-center bg-white">
        <Loader color="#ff6813" />
        {/* <span className="text-sm text-gray-500">Loading…</span> */}
    </div>
);

function SohcahtoaTable<T extends object>({
    columns,
    dataSource,
    loading,
    pageTotal,
    currentPage,
    pageSize,
    rowKey,
    onRow,
    rowClassName,
    showHeader,
    rowSelection,
    scroll,
    onTableChange,
    hasPagination = true,
    emptyMessage = "No records found",
    emptyDescription,
}: Readonly<ITableProps<T>>) {
    const emptyLocale = useMemo(
        () => ({ emptyText: <EmptyTable message={emptyMessage} description={emptyDescription} /> }),
        [emptyMessage, emptyDescription]
    );

    const tableLoading = useMemo(() => ({ spinning: loading, indicator: LOADING_INDICATOR }), [loading]);

    const pagination = useMemo<TablePaginationConfig>(
        () => ({
            itemRender: pageItemRender,
            //   position: ["bottomRight"],
            placement: ["bottomEnd"],
            current: currentPage,
            pageSize,
            total: pageTotal,
            showSizeChanger: false,
        }),
        [currentPage, pageSize, pageTotal]
    );

    return (
        <TableCompContainer>
            <Table<T>
                columns={columns}
                dataSource={dataSource}
                rowKey={rowKey}
                loading={tableLoading}
                pagination={hasPagination ? pagination : false}
                onChange={onTableChange}
                onRow={onRow}
                rowClassName={rowClassName}
                size="large"
                locale={emptyLocale}
                scroll={scroll}
                showHeader={showHeader}
                rowSelection={rowSelection}
            />
        </TableCompContainer>
    );
}

export default React.memo(SohcahtoaTable) as typeof SohcahtoaTable;