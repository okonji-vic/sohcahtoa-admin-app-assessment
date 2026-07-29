"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ROUTE_PATH } from "@/utils/constants";
import TransactionList from "./TransactionList";
import Minus from "@/assets/wallet-minus.png";
import Plus from "@/assets/wallet-add.png";
import History from "@/assets/history.png"
import Image from "next/image";

export default function FXSection() { 
  const [activeTab, setActiveTab] = useState("All");
  const [activeHeaderTab, setActiveHeaderTab] = useState("FX bought");

  const transactions = [
    {
      id: 1,
      icon: "transfer-out",
      name: "Transfer to Ruth",
      date: "Fri, Apr 18, 2025 • 7:32PM",
      amount: "-$7.64",
      isNegative: true,
    },
    {
      id: 2,
      icon: "transfer-in",
      name: "Transfer from Tobi",
      date: "Sat, Mar 2, 2025 • 6:59AM",
      amount: "+$3.00",
      isNegative: false,
    },
    {
      id: 3,
      icon: "transfer-out",
      name: "Transfer to Esrael",
      date: "Sat, Mar 2, 2025 • 10:08AM",
      amount: "-$200",
      isNegative: true,
    },
    {
      id: 4,
      icon: "wallet",
      name: "Wallet to wallet",
      date: "Mon, Feb 19, 2025 • 4:27PM",
      amount: "-$10.53",
      isNegative: true,
    },
    {
      id: 5,
      icon: "transfer-in",
      name: "Transfer from Tochukwu",
      date: "Tue, Feb 7, 2025 • 11:50PM",
      amount: "+$850.89",
      isNegative: false,
    },
  ];

  const filterTabs = ["All", "FX", "PTA", "BTA", "Medicals"];
  const headerTabs = ["FX bought", "FX sold", "Others"];

  return (
    <div className="space-y-6">
      {/* Header Tabs and Dropdown */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-2">
          {headerTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveHeaderTab(tab)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                activeHeaderTab === tab
                  ? "bg-orange-100 text-orange-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Medicals Dropdown */}
        <div className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-gray-800 transition-colors">
          <span className="text-sm font-medium">Medicals</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      {/* Total FX Units */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-gray-700 font-medium">Total FX units</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-500"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div className="text-4xl font-bold text-gray-900">
          $&nbsp;<span>67,048</span>
          <span className="text-2xl text-gray-500">.00</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-5 gap-1">
        <ActionButton icon="briefcase" label="Buy FX" />
        <ActionButton icon="briefcase-plus" label="Sell FX" />
        <ActionButton icon="history" label="Receive money" />
      </div>

      {/* FX Transactions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">FX transactions</h3>
          <Link
            href={ROUTE_PATH.DASHBOARD.TRANSACTIONS_PATH}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            See all
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "bg-orange-100 text-orange-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  label,
}: {
  icon: string;
  label: string;
}) {
  return (
    <button className="flex flex-col rounded-3xl items-center justify-center gap-3 py-4 border border-gray-200 bg-white hover:bg-gray-50 transition-colors max-w-[100px]">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
        {icon === "briefcase" && (
        <Image
            src={Minus}
            alt="Logo"
            className={`w-6 h-6 transition-opacity`}
          />
              )}
              {icon === "briefcase-plus" && (
        <Image
            src={Plus}
            alt="Logo"
            className={`w-6 h-6 transition-opacity`}
          />
        )}
        {icon === "history" && (
          <Image
          src={History}
          alt="Logo"
          className={`w-6 h-6 transition-opacity`}
        />
        )}
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
}