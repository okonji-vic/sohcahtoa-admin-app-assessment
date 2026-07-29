"use client";

import React from "react";

export default function CardDisplay() {
  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-2">
      {/* Prepaid Card - Main */}
      <div
        className="flex-shrink-0 w-80 h-48 rounded-3xl p-6 flex flex-col justify-between text-white shadow-xl relative overflow-hidden"
        style={{
          // Matches the Figma reference: warm orange top-left fading to a
          // deep brown bottom-right. A CSS gradient always fills the box
          // exactly — no cropping, no blank spots, regardless of card size.
          background:
            "linear-gradient(135deg, #FF8A3D 0%, #F4632A 28%, #C9451F 55%, #7A2E16 85%, #4A1D0F 100%)",
        }}
      >
        {/* Diagonal stripe overlay — recreates the subtle light bands from
            the Figma design using plain CSS, so there's no separate image
            asset that can fail to load or fail to cover. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "repeating-linear-gradient(115deg, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.10) 40px, transparent 40px, transparent 90px)",
          }}
        />
        {/* Soft radial highlight, top-right, like the design's circular glow */}
        <div
          className="absolute -top-10 -right-10 w-56 h-56 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Top Section - Chip and Label */}
          <div className="flex items-start justify-between">
            <div>
              {/* Chip - solid gold plate with etched contact lines, matching
                  a real EMV chip rather than a dot grid */}
              <div className="w-11 h-8 rounded-md bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 shadow-md mb-2 relative overflow-hidden border border-yellow-700/40">
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="border border-yellow-700/30" />
                  ))}
                </div>
              </div>
              <p className="text-xs font-semibold tracking-wide" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.35)" }}>
                Prepaid card
              </p>
            </div>

            {/* VISA Logo */}
            <div
              className="text-white text-2xl font-bold tracking-widest italic"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.35)" }}
            >
              VISA
            </div>
          </div>

          {/* Bottom Section - Card Details */}
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs font-medium mb-0.5" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>
                •••• 7093
              </p>
              <p className="text-[10px] font-medium opacity-90" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>
                Valid Thru 08/27
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold leading-tight" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
                $3,048.00
              </p>
              <p className="text-xs" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>
                Emmanuel Israel
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Card Button */}
      <div className="flex-shrink-0 w-20 h-48 rounded-3xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors cursor-pointer group">
        <button className="w-12 h-12 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center justify-center shadow-lg group-hover:shadow-xl">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}




// "use client";

// import React from "react";
// import Image from "next/image";

// export default function CardDisplay() {
//   return (
//     <div className="flex items-center gap-4 overflow-x-auto pb-2">
//       {/* Prepaid Card - Main */}
//       <div className="flex-shrink-0 w-80 h-48 rounded-3xl overflow-hidden relative shadow-xl text-white">
//         {/* Background layer — fills the box exactly, no CSS background math */}
//         <Image
//           src="/Horizontal-Design.png"
//           alt=""
//           fill
//           style={{ objectFit: "cover" }}
//           priority
//         />

//         {/* Content Container */}
//         <div className="relative z-10 flex flex-col justify-between h-full p-6">
//           <div className="flex items-start justify-between">
//             <div>
//               <div className="w-11 h-8 rounded-md bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 shadow-md mb-2 relative overflow-hidden border border-yellow-700/40">
//                 <div className="absolute inset-0 grid grid-cols-3 grid-rows-2">
//                   {Array.from({ length: 6 }).map((_, i) => (
//                     <div key={i} className="border border-yellow-700/30" />
//                   ))}
//                 </div>
//               </div>
//               <p className="text-xs font-semibold tracking-wide" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.35)" }}>
//                 Prepaid card
//               </p>
//             </div>
//             <div className="text-white text-2xl font-bold tracking-widest italic" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.35)" }}>
//               VISA
//             </div>
//           </div>

//           <div className="flex justify-between items-end">
//             <div>
//               <p className="text-xs font-medium mb-0.5" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>
//                 •••• 7093
//               </p>
//               <p className="text-[10px] font-medium opacity-90" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>
//                 Valid Thru 08/27
//               </p>
//             </div>
//             <div className="text-right">
//               <p className="text-xl font-bold leading-tight" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
//                 $3,048.00
//               </p>
//               <p className="text-xs" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>
//                 Emmanuel Israel
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Add Card Button */}
//       <div className="flex-shrink-0 w-20 h-48 rounded-3xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors cursor-pointer group">
//         <button className="w-12 h-12 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center justify-center shadow-lg group-hover:shadow-xl">
//           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
//             <line x1="12" y1="5" x2="12" y2="19"></line>
//             <line x1="5" y1="12" x2="19" y2="12"></line>
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// }