"use client";

import TransferOut from "@/assets/export.png";
import TransferIn from "@/assets/import.png";
import Wallet from "@/assets/repeat.png"
import Image from "next/image";

interface CardTransaction {
  id: number;
  icon: string;
  name: string;
  date: string;
  amount: string;
  isNegative: boolean;
}

export default function CardTransactions() {
  const transactions: CardTransaction[] = [
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
      icon: "wallet",
      name: "Wallet to wallet",
      date: "Sat, Mar 2, 2025 • 8:12AM",
      amount: "-$14",
      isNegative: true,
    },
    {
      id: 3,
      icon: "transfer-in",
      name: "Transfer from Tochukwu",
      date: "Tue, Feb 7, 2025 • 11:50PM",
      amount: "+$850.89",
      isNegative: false,
    },
  ];

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "transfer-out":
        return (
          <Image
            src={TransferOut}
            alt="Logo"
            className={`w-6 h-6 transition-opacity`}
          />
        );
      case "transfer-in":
        return (
          <Image
            src={TransferIn}
            alt="Logo"
            className={`w-6 h-6 transition-opacity`}
          />
        );
      case "wallet":
        return (
          <Image
            src={Wallet}
            alt="Logo"
            className={`w-6 h-6 transition-opacity`}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              {getIcon(transaction.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">{transaction.name}</p>
              <p className="text-xs text-gray-500 truncate">{transaction.date}</p>
            </div>
          </div>
          <div
            className={`text-xs font-bold whitespace-nowrap ml-2 ${
              transaction.isNegative ? "text-red-600" : "text-green-600"
            }`}
          >
            {transaction.amount}
          </div>
        </div>
      ))}
    </div>
  );
}