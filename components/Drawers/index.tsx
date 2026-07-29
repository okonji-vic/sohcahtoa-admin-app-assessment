import React from "react";
import { Drawer, DrawerProps } from "antd";

interface ISohcahtoaDrawerProps {
  placement: DrawerProps["placement"];
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string | number;
  maskClosable?: boolean;
  zIndex?: number;
  title?: string | React.ReactNode;
  rootClassName?: string;
}

const SohcahtoaDrawers: React.FC<ISohcahtoaDrawerProps> = ({
  placement,
  onClose,
  open,
  children,
  width,
  maskClosable,
  zIndex,
  title,
  rootClassName,
}) => {
  return (
    <Drawer
      title={title}
      closable={{ "aria-label": "Close Button" }}
      placement={placement ?? "left"}
      onClose={onClose}
      open={open}
      key={placement}
      size={width ?? "100%"}
      rootClassName={rootClassName}
      zIndex={zIndex ?? 990}
      maskClosable={maskClosable ?? false}
    >
      {children}
    </Drawer>
  );
};

export default SohcahtoaDrawers;
