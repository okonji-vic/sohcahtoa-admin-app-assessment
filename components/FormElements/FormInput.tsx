import React from "react";
import { Input, type InputProps } from "antd";
import { FormInputContainer } from "./styles";

interface ICssProps {
  $backgroundColor?: string;
  $borderColor?: string;
  $height?: string;
}

type TFormInput = {
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  allowClear?: InputProps["allowClear"];
  cssProps?: ICssProps;
  prefix?: React.ReactNode;
  disabled?: boolean;
  defaultValue?: string;
  value?: InputProps["value"];
};

const FormInput: React.FC<TFormInput> = ({
  placeholder,
  onChange,
  allowClear,
  cssProps,
  prefix,
  disabled,
  defaultValue,
  value,
}) => {
  return (
    <FormInputContainer
      $backgroundColor={cssProps?.$backgroundColor}
      $borderColor={cssProps?.$borderColor}
      $height={cssProps?.$height}
    >
      <Input
        placeholder={placeholder}
        onChange={onChange}
        allowClear={allowClear}
        prefix={prefix ?? <span />}
        disabled={disabled}
        defaultValue={defaultValue}
        value={value}
      />
    </FormInputContainer>
  );
};

export default FormInput;
