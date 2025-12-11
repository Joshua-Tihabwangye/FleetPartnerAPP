import React from "react";

interface ChipProps {
  children: React.ReactNode;
  className?: string;
}

export default function Chip({ children, className = "" }: ChipProps) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium " +
        className
      }
    >
      {children}
    </span>
  );
}
