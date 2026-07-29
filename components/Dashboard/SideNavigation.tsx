"use client";

import React from "react";
import Image from "next/image";

import BrandLogo from "@/assets/SohCahToa-Icon.webp";
import SideNavMenu from "./SideNavMenu";
// import { ChevronRightIcon } from "@/assets/icons";

interface TNavProps {
  currentRole: string;
}

const SideNavigation: React.FC<TNavProps> = ({ currentRole }) => {
  // const [isCollapsed, setIsCollapsed] = useState(false);

  // const toggleCollapse = () => {
  //   setIsCollapsed(!isCollapsed);
  // };
  return (
    <div className="hidden xl:flex xl:flex-col w-full max-w-[260px] min-h-screen h-screen bg-white fixed left-0 top-0 bottom-0 z-[1000] border-r border-gray-200">
      <div className="flex-shrink-0 px-4 py-4 border-b border-gray-200">
        <Image
          src={BrandLogo}
          alt="Logo of the brand"
          className="w-[100px] h-[50px]"
          priority
        />
      </div>

      <div
        className="flex-1 overflow-y-auto px-3 py-4"
        style={{ scrollbarGutter: "stable" }}
      >
        <SideNavMenu currentRole={currentRole} />
      </div>
    </div>
  );
};

export default SideNavigation;

