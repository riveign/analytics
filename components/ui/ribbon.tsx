import React from "react";

interface RibbonProps {
  version: "V1" | "V2" | "V3";
}

export function Ribbon({ version }: RibbonProps) {
  const colorClass = {
    V1: "bg-green-600",
    V2: "bg-blue-600",
    V3: "bg-orange-600",
  }[version];

  return (
    <div className="absolute right-2 top-2 z-10">
      <div
        className={`${colorClass} text-white px-3 py-1 text-xs font-medium shadow-md transform rotate-12 rounded`}
      >
        {version}
      </div>
    </div>
  );
}
