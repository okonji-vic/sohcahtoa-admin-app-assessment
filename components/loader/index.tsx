"use client";

import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface LoaderProps {
  color?: string;
  size?: number;
}

const Loader: React.FC<LoaderProps> = ({ color, size }) => {
  return (
    <Spin
      indicator={
        <LoadingOutlined
          style={{ fontSize: size ?? 24, color: color ?? "#1175c0" }}
          spin
        />
      }
    />
  );
};

export default Loader;