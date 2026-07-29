"use client";

import Image from "next/image";

import TransferOut from "@/assets/export.png";
import TransferIn from "@/assets/import.png";
import Wallet from "@/assets/repeat.png"

interface Transaction {
  id: number;
  icon: string;
  name: string;
  date: string;
  amount: string;
  isNegative: boolean;
}

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
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
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              {getIcon(transaction.icon)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{transaction.name}</p>
              <p className="text-xs text-gray-500">{transaction.date}</p>
            </div>
          </div>
          <div
            className={`text-sm font-bold whitespace-nowrap ${
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