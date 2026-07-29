import styled from "styled-components";

export const TableCompContainer = styled.div`
  position: relative;
  .ant-table-wrapper .ant-table-thead > tr > th {
    font-weight: 500;
    background: 0 0;
    border-top: none;
    font-size: 16px;
  }
  .ant-table-wrapper {
    font-size: 16px;
    border: none;
  }
  .ant-table-wrapper .ant-table-thead > tr > th {
    background: #fff;
    color: #6b7280;
    font-weight: 500;
    border: none;
    font-size: 14px;
  }
  .ant-table-tbody > tr > td {
    border-top: 1px solid #f4f4f4;
    border-bottom: none;
    color: #111010;
    font-size: 15px;
    font-weight: 500;
  }
  .ant-pagination .ant-pagination-item-active {
    background-color: #ff6813 !important;
    border: 1px solid #d0d5dd;
  }
  .ant-pagination .ant-pagination-item-active a {
    color: #fff;
    font-weight: 500;
  }
  .ant-pagination .ant-pagination-item {
    background-color: transparent;
    border: 1px solid transparent;
    border-radius: 6px;
  }
  .ant-pagination .ant-pagination-item:not(.ant-pagination-item-active):hover {
    transition: all 0.2s;
    background-color: rgba(0, 0, 0, 0.06);
  }
`;