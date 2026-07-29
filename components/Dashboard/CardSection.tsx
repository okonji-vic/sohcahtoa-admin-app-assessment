"use client";

import React from "react";
import Link from "next/link";
import { ROUTE_PATH } from "@/utils/constants";
import CardDisplay from "./CardDisplay";
import CardTransactions from "./CardTransactions";
import CardFlows from "./CardFlows";

export default function CardSection() {
  return (
    <div className="space-y-6">
      {/* Cards Header */}
      <h2 className="text-lg font-bold text-gray-900">Cards</h2>

      {/* Card Display */}
      <CardDisplay />

      {/* Card Transactions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">Card transactions</h3>
          <Link
            href={ROUTE_PATH.DASHBOARD.CARDS_PATH}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            See all
          </Link>
        </div>
        <CardTransactions />
      </div>

      {/* Card Flow Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Card Flows */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900">Card transaction flows</h3>
        <CardFlows />
      </div>
    </div>
  );
}