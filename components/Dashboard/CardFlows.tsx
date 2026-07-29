"use client";

import React from "react";

export default function CardFlows() {
  return (
    <div className="space-y-4">
      {/* Money In */}
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-medium text-gray-600">Money in</p>
            <p className="text-xs font-bold text-gray-900">$4,046.00</p>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-500"
              style={{ width: "85%" }}
            ></div>
          </div>
        </div>
      </div>

      {/* Money Out */}
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-medium text-gray-600">Money out</p>
            <p className="text-xs font-bold text-gray-900">$1,046.00</p>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-orange-500"
              style={{ width: "25%" }}
            ></div>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-200">
        <p className="text-sm font-medium text-gray-900">Total</p>
        <p className="text-sm font-bold text-gray-900">
          +<span className="text-green-600">$3,048.00</span>
        </p>
      </div>
    </div>
  );
}