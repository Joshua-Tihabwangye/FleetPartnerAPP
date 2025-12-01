import React from "react";

export default function Chip({ children, className = "" }) {
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
