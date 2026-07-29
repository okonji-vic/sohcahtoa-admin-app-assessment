"use client";

import React from "react";
import {
  Dropdown,
  type DropdownProps,
  type MenuProps,
} from "antd";

interface SohcahtoaDropdownProps {
  label: React.ReactNode;
  items: MenuProps["items"];
  placement?: DropdownProps["placement"];
  onOpenChange?: DropdownProps["onOpenChange"];
  popupRender?: DropdownProps["popupRender"];
}

const SohcahtoaDropdown: React.FC<SohcahtoaDropdownProps> = ({
  label,
  items,
  placement = "bottomLeft",
  onOpenChange,
  popupRender,
}) => {
  return (
    <Dropdown
      menu={{
        items,
      }}
      trigger={["click"]}
      placement={placement}
      onOpenChange={onOpenChange}
      popupRender={popupRender}
    >
      {label}
    </Dropdown>
  );
};

export default SohcahtoaDropdown;

