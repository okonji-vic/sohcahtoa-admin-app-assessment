import { device } from "@/utils/devices";
import styled from "styled-components";

interface FormInputContainerProps {
  $backgroundColor?: string;
  $borderColor?: string;
  $height?: string;
}

interface FormInputButtonProps {
  $height?: string;
  $padding?: string;
  $fontSize?: string;
}

interface FormInputUploadProps {
  $backgroundColor?: string;
}

export const FormInputContainer = styled.div<FormInputContainerProps>`
  .ant-input::placeholder {
    font-size: 14px;
    font-family: var(--font-geist-sans);
    font-weight: 400;
  }
  .ant-input {
    color: #212121;
    font-size: 16px;
    font-family: var(--font-geist-sans);
    font-weight: 400;
    border: 1px solid;
    border-color: ${(props) => props.$borderColor ?? "#d0d5dd"};
    background: ${(props) => props.$backgroundColor ?? "white"};
    height: ${(props) => props.$height ?? "30px"};
    border-radius: 8px;
  }
  .ant-input-outlined:focus,
  .ant-input-outlined:focus-within {
    border-color: ${(props) => props.$borderColor ?? "#d0d5dd"};
    box-shadow: none;
    outline: 0;
    background-color: ${(props) => props.$backgroundColor ?? "white"};
  }
  .ant-input-affix-wrapper {
    color: #212121;
    font-size: 16px;
    font-family: var(--font-geist-sans);
    font-weight: 400;
    border: 1px solid;
    border-color: ${(props) => props.$borderColor ?? "#d0d5dd"};
    background: ${(props) => props.$backgroundColor ?? "white"};
    border-radius: 8px;
    /* height: ${(props) => props.$height ?? "38px"}; */
  }
  .ant-input-affix-wrapper:focus,
  .ant-input-affix-wrapper:focus-within {
    box-shadow: none;
    border-color: ${(props) => props.$borderColor ?? "#d0d5dd"};
  }
  .ant-input-outlined.ant-input-disabled,
  .ant-input-outlined[disabled] {
    color: rgba(0, 0, 0, 0.25);
    background-color: rgba(0, 0, 0, 0.04);
    border-color: #d9d9d9;
    box-shadow: none;
    cursor: not-allowed;
    opacity: 1;
  }
  .ant-input-suffix {
    color: #667085;
  }
`;

export const FormInputPasswordContainer = styled.div`
  .ant-input-affix-wrapper {
    color: #212121;
    font-size: 16px;
    font-family: var(--font-libre-franklin);
    font-weight: 400;
    border: 1px solid #d0d5dd;
    background: white;
    height: 48px;
    border-radius: 8px;
  }
  .ant-input-affix-wrapper:focus,
  .ant-input-affix-wrapper:focus-within {
    box-shadow: none;
    border-color: #d0d5dd;
  }
`;

export const FormInputButtonContainer = styled.div<FormInputButtonProps>`
  .ant-btn-variant-solid {
    color: #fff;
    background: #1175c0;
  }
  .ant-btn-color-primary {
    color: #fff;
    box-shadow: none;
  }
  .ant-btn {
    font-size: ${(props) => props.$fontSize ?? "16px"};
    font-weight: 600;
    font-family: var(--font-libre-franklin);
    height: ${(props) => props.$height ?? "56px"};
    padding: ${(props) => props.$padding ?? "0px 16px"};
    border-radius: 10px;
  }
  .ant-btn-variant-solid:not(:disabled):not(.ant-btn-disabled):hover {
    background: #1175c0;
    color: #fff;
  }

  .ant-btn-variant-solid:disabled,
  .ant-btn-variant-solid.ant-btn-disabled {
    cursor: not-allowed;
    border-color: none;
    color: rgba(0, 0, 0, 0.25);
    background: rgba(0, 0, 0, 0.04);
    box-shadow: none;
  }
`;

export const FormInputDropdownContainer = styled.div`
  .ant-select {
    /* min-height: 48px; */
    height: auto;
    .ant-select-selector {
      /* min-height: 48px; */
      height: auto;
      background: #ffffff;
      border-radius: 8px;
      align-items: center;
      border: 1px solid #d0d5dd;
      font-size: 16px;
      font-family: var(--font-libre-franklin);
      &:hover {
        border-color: #d0d5dd !important;
      }
      .ant-select-selection-placeholder {
        font-size: 16px;
        font-family: var(--font-libre-franklin);
      }
    }
    .ant-select-disabled.ant-select:not(.ant-select-customize-input)
      .ant-select-selector {
      color: rgba(0, 0, 0, 0.25);
      border-color: #d9d9d9;
      background-color: rgba(0, 0, 0, 0.04);
    }
  }

  .ant-select-multiple .ant-select-selection-item {
    // height: 38px;
    // line-height: 32px;
    font-size: 14px;
  }
  .ant-select-multiple .ant-select-selection-overflow-item-suffix {
    min-height: 38px !important;
    margin-block: 2px;
  }
  .ant-select-multiple .ant-select-selection-wrap {
    align-self: flex-center !important;
  }
`;

export const FormInputDatePickerContainer = styled.div`
  .ant-picker {
    width: 100%;
    height: 48px;
    font-size: 16px;
    font-family: var(--font-libre-franklin);
    border: 1px solid #d0d5dd;
    border-radius: 8px;
  }
  .ant-picker .ant-picker-input > input {
    color: #344054;
    font-size: 16px;
    font-weight: 500;
    font-family: var(--font-libre-franklin);
    &::placeholder {
      font-weight: 400;
      font-family: var(--font-libre-franklin);
    }
  }
`;

export const FormInputOtpContainer = styled.div`
  .ant-otp {
    align-items: center;
    flex-wrap: nowrap;
    column-gap: 16px;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(6, 80px);
    justify-content: center;
  }
  .ant-input {
    box-sizing: border-box;
    margin: 0;
    color: rgba(0, 0, 0, 0.88);
    font-size: 24px;
    display: inline-block;
    width: 100%;
    height: 70px;
    min-width: 0;
    border-radius: 6px;
    font-family: var(--font-libre-franklin);
  }
  .ant-input-outlined:focus,
  .ant-input-outlined:focus-within {
    border-color: #d0d5dd;
    box-shadow: none;
    outline: 0;
    background-color: #ffffff;
  }
`;

export const FormNestedCardContainer = styled.div`
  .ant-card {
    .ant-card-head {
      padding: 0px 16px;
      @media ${device.mobileL} {
        padding: 0px 14px;
      }
    }
    .ant-card-body {
      padding: 16px;
      @media ${device.mobileL} {
        padding: 14px;
      }
    }
  }
`;

export const FormInputTextAreaContainer = styled.div`
  .ant-input::placeholder {
    font-size: 16px;
    font-family: var(--font-libre-franklin);
    font-weight: 400;
  }
  .ant-input {
    color: #212121;
    font-size: 16px;
    font-family: var(--font-libre-franklin);
    font-weight: 400;
    border: 1px solid;
    border-color: #d0d5dd;
    background: white;
    border-radius: 8px;
  }
  .ant-input-outlined:focus,
  .ant-input-outlined:focus-within {
    border-color: #d0d5dd;
    box-shadow: none;
    outline: 0;
    background-color: white;
  }
  .ant-input-outlined.ant-input-disabled,
  .ant-input-outlined[disabled] {
    color: rgba(0, 0, 0, 0.25);
    background-color: rgba(0, 0, 0, 0.04);
    border-color: #d9d9d9;
    box-shadow: none;
    cursor: not-allowed;
    opacity: 1;
  }
`;

export const FormInputUploadContainer = styled.div<FormInputUploadProps>`
  .ant-upload-wrapper .ant-upload-drag {
    background: ${(props) => props.$backgroundColor ?? "#1010100d"};
    border: 1px solid rgb(16 16 16 / 0.1);
    border-radius: 8px;
  }
  .ant-upload-wrapper .ant-upload-drag:not(.ant-upload-disabled):hover,
  .ant-upload-wrapper .ant-upload-drag-hover:not(.ant-upload-disabled) {
    border-color: #1010101a;
  }
  .ant-upload-wrapper .ant-upload-drag .ant-upload {
    padding: 14px;
  }
  .ant-upload-wrapper .ant-upload-drag:has(.ant-upload-disabled),
  .ant-upload-wrapper .ant-upload-drag-hover:has(.ant-upload-disabled) {
    background: rgba(0, 0, 0, 0.02);
    border: 1px solid #1010101a;
    .click-upload {
      color: #475467;
    }
  }
`;

export const FormInputNumberContainer = styled.div<FormInputContainerProps>`
  .ant-input-number-input::placeholder {
    font-size: 16px;
    font-family: var(--font-libre-franklin);
    font-weight: 400;
  }
  .ant-input-number-input {
    height: ${(props) => props.$height ?? "38px"};
  }
  .ant-input-number-outlined {
    color: #212121;
    font-size: 16px;
    font-family: var(--font-libre-franklin);
    font-weight: 400;
    border: 1px solid;
    border-color: ${(props) => props.$borderColor ?? "#d0d5dd"};
    background: ${(props) => props.$backgroundColor ?? "white"};
    height: ${(props) => props.$height ?? "38px"};
    border-radius: 8px;
    width: 100%;
  }
  .ant-input-number-outlined:focus,
  .ant-input-number-outlined:focus-within {
    border-color: ${(props) => props.$borderColor ?? "#d0d5dd"};
    box-shadow: none;
    outline: 0;
    background-color: ${(props) => props.$backgroundColor ?? "white"};
  }
  .ant-input-number-outlined.ant-input-disabled,
  .ant-input-number-outlined[disabled] {
    color: rgba(0, 0, 0, 0.25);
    background-color: rgba(0, 0, 0, 0.04);
    border-color: #d9d9d9;
    box-shadow: none;
    cursor: not-allowed;
    opacity: 1;
  }
`;

export const FormInputSwitchContainer = styled.div`
  .ant-form-item .ant-form-item-control-input {
    border: 1px solid #d0d0d0;
    height: 48px;
    border-radius: 6px;
    padding: 0px 16px;
  }
  .ant-switch-checked {
    background-color: #1175c0 !important;
    border-color: #1175c0 !important;
  }
`;
