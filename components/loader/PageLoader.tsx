"use client";

import Image from "next/image";

import BrandLogo from "@/assets/SohCahToa-Icon.webp";

const SohCahToaPageLoader = () => {
  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 z-[9999] ml-0 xl:ml-[260px] bg-white min-h-screen h-auto">
      <div className="flex items-center justify-center h-screen w-full bg-white overflow-hidden">
        <div className="relative w-[60px] h-[60px] mb-3 flex items-center justify-center">
          {/* <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-[2.5px] border-gray-300 border-t-[#1175c0] rounded-full animate-spin" />
          </div> */}

          <Image
            src={BrandLogo}
            alt="Logo"
            className={`w-[60px] h-[60px] transition-opacity`}
          />
        </div>
      </div>
    </div>
  );
};

export default SohCahToaPageLoader;
