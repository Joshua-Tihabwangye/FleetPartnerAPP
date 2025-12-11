import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function PrimaryButton({ children, className = "", ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={
        "inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-medium " +
        "bg-ev-green text-ev-slate hover:bg-ev-green-dark focus:outline-none focus:ring-2 " +
        "focus:ring-emerald-500/60 transition " +
        className
      }
      {...rest}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, className = "", ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={
        "inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-medium " +
        "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 focus:outline-none " +
        "focus:ring-2 focus:ring-emerald-500/40 transition " +
        className
      }
      {...rest}
    >
      {children}
    </button>
  );
}
