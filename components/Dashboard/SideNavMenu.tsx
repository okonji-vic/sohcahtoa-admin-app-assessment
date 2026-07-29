"use client";

import Link from "next/link";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MenuProps } from "antd";
import Image from "next/image";

import profilePicture from "@/assets/profile-picture.jpg";
import Support from "@/assets/message-question.png";
import { TSideNavProps } from "@/interfaces/general";
import { SideNavData } from "@/utils/sidenav-data";
import { SettingIcon, LogoutIcon, ChevronDown } from "@/assets/icons";
import { useLogout } from "@/hooks/useAuth";
import SohcahtoaDropdown from "../Dropdowns/sohcahtoaDropdown";



type SideNavMenuProps = {
  currentRole: string;
  onNavigate?: () => void;
};

const SideNavMenu: React.FC<SideNavMenuProps> = ({
  currentRole,
  onNavigate,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [user] = useState({
    name: "Emmanuel Israel",
    email: "emmanuel.e.isra...",
    avatar: profilePicture,
  });
  const logout = useLogout();

  const isRouteActive = (basePath: string) =>
    pathname === basePath;

  const handleNavigate = () => {
    onNavigate?.();
  };

  const handleLogout = () => {
    logout.mutate()
    // router.push(ROUTE_PATH.LOGIN);
  };

  const handleSettings = () => {
    router.push("/dashboard/settings");
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "settings",
      label: "Settings",
      icon: <SettingIcon />,
      onClick: handleSettings,
    },
    {
      type: "divider",
      // key: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutIcon />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-1">
        {SideNavData.map((li: TSideNavProps) => {
          if (!li.roles.includes(currentRole)) return null;

          return (
            <Link
              key={li.title}
              href={li.link}
              onClick={() => {
                handleNavigate();
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${isRouteActive(li.link)
                ? "!bg-orange-50 !text-orange-600"
                : "!text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <span className="flex-shrink-0">{li.icon}</span>
              <span>{li.title}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex-shrink-0 space-y-4 border-t border-gray-200 pt-4">
        <Link
          href="/support"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-50 hover:text-gray-900"
        >
          <span className="flex-shrink-0">
            {/* <SupportIcon /> */}
            <Image
              src={Support}
              alt={"support icon"}
              className="h-5 w-5"
              priority
            />
          </span>
          <span>Support</span>
        </Link>

        <SohcahtoaDropdown
          label={
            <div className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors duration-200">

              <Image
                src={user.avatar}
                alt={user.name}
                className="h-8 w-8 rounded-full flex-shrink-0 bg-gray-200"
                priority
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <ChevronDown />
            </div>
          }
          items={userMenuItems}
          placement="topRight"
        />
      </div>
    </div>
  );
};

export default SideNavMenu;


