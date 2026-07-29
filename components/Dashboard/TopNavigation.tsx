"use client";

import React, { useState } from "react";
import Image from "next/image";

import MenuSideNav from "./MenuSideNav";
import BrandLogo from "@/assets/SohCahToa-Icon.webp";
import { formatFullName } from "@/utils/getInitials";
import profilePicture from "@/assets/profile-picture.jpg";
import FormInput from "../FormElements/FormInput";
import { SearchIcon } from "@/assets/icons";
import { BellOutlined } from "@ant-design/icons";
import SohcahtoaDropdown from "../Dropdowns/sohcahtoaDropdown";
// import { MockUser } from "@/lib/mock-users";
import { useAuthStore } from "@/store/auth";

interface TopNavigationProps {
  currentRole: string;
  // session?: MockUser;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ currentRole }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const [stateUser] = useState({
    avatar: profilePicture,
  });



  const handleMenuDrawer = () => {
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };





  const fullName = formatFullName(`${user?.firstName} ${user?.lastName}`);

  return (
    <div className="w-full xl:w-[calc(100%-260px)] max-w-full fixed top-0 left-0 right-0 ml-0 xl:ml-[260px] bg-white border-b border-solid border-sofia_dark/10 z-[1000]">
      <div className="flex items-center h-20 p-3.5 md:p-4 lg:p-6">
        <Image
          src={BrandLogo}
          alt="Logo of the brand"
          className="w-[50px] h-auto block xl:hidden"
          priority
        />
        <SohcahtoaDropdown
          label={
            <div className="hidden md:flex w-full items-center gap-2 rounded-lg px-3 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors duration-200">

              <Image
                src={stateUser.avatar}
                alt={user?.name ?? "user avatar"}
                className="h-8 w-8 rounded-full flex-shrink-0 bg-gray-200"
                priority
              />
              <div className="flex-1 min-w-0">

                <p className="text-xs text-gray-500 truncate">Good evening ✨☁️</p>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name}
                </p>
              </div>
            </div>
          }
          items={[]}
          placement="topRight"
        />

        <div className="w-full max-w-[50%] sm:max-w-[35%]">
          <FormInput prefix={<SearchIcon />} placeholder="Search" />
        </div>
        <div className="m-4 flex items-center gap-5">

          <div
            // type="button"
            // aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-md border border-solid border-[var(--primary)] bg-[var(--bg-secondary)] text-[color:var(--text-secondary)] transition-colors hover:border-[var(--primary)]"
          // className="flex items-center justify-center gap-2 bg-[#EFF1F3CC] border border-solid rounded-lg py-1 px-1"
          >
            <BellOutlined className="text-lg !text-[#101010]" />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--destructive)] px-1 text-[11px] font-bold text-white">
              1
            </span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-5">


          {isMenuOpen ? (
            <button
              className="close-menu border-none block xl:hidden"
              onClick={handleMenuClose}
              aria-label="Close menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          ) : (
            <button
              className="open-menu border-none block xl:hidden"
              onClick={handleMenuDrawer}
              aria-label="Open menu"
            >
              <span></span>
              <span></span>
            </button>
          )}
        </div>
      </div>

      <MenuSideNav
        isMenuOpen={isMenuOpen}
        handleMenuClose={handleMenuClose}
        menuPlacement="left"
        currentRole={currentRole}
        userName={fullName}
      // onSignOutClick={handleOpenLogoutModal}
      />

    </div>
  );
};

export default TopNavigation;
