import type { PaginationProps } from "antd";

export const pageItemRender: PaginationProps["itemRender"] = (_, type, originalElement) => {
  if (type === "prev") return <a href="#link" className="px-4 text-black">Previous</a>;
  if (type === "next") return <a href="#link" className="px-4 text-black">Next</a>;
  return originalElement;
};