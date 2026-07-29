"use client";

import React from "react";
import Image from "next/image";
import { LogoutOutlined } from "@ant-design/icons";

import { IMenuSideNavProps } from "./types";
import BrandLogo from "@/assets/SohCahToa-Icon.webp";
import SideNavMenu from "./SideNavMenu";
import SohcahtoaDrawers from "../Drawers";

const MenuSideNav: React.FC<IMenuSideNavProps> = ({
  menuPlacement,
  handleMenuClose,
  isMenuOpen,
  currentRole,
  onSignOutClick,
  userName,
}) => {
  return (
    <SohcahtoaDrawers
      placement={menuPlacement}
      open={isMenuOpen}
      onClose={handleMenuClose}
      width={280}
      maskClosable
      rootClassName="mobile-side-nav"
      title={
        <Image
          src={BrandLogo}
          alt="Logo of the brand"
          className="h-[50px] w-[50px]"
          priority
        />
      }
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto pb-4">
          <SideNavMenu currentRole={currentRole} onNavigate={handleMenuClose} />
        </div>

        {onSignOutClick ? (
          <div className="border-t border-white/10 pt-4">
            {userName ? (
              <p className="mb-3 truncate px-[10px] text-sm font-medium text-white/70">
                {userName}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => {
                handleMenuClose();
                onSignOutClick();
              }}
              className="flex w-full items-center gap-2 rounded px-[10px] py-3 text-sm font-semibold text-[#F97066] transition-colors hover:bg-[#00000020]"
            >
              <LogoutOutlined />
              Sign Out
            </button>
          </div>
        ) : null}
      </div>
    </SohcahtoaDrawers>
  );
};

export default MenuSideNav;
