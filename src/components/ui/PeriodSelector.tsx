import React from "react";

export type Period = "today" | "week" | "month" | "year";

interface PeriodSelectorProps {
    value: Period;
    onChange: (value: Period) => void;
    className?: string;
}

export default function PeriodSelector({ value, onChange, className = "" }: PeriodSelectorProps) {
    const periods: { id: Period; label: string }[] = [
        { id: "today", label: "Today" },
        { id: "week", label: "This Week" },
        { id: "month", label: "This Month" },
        { id: "year", label: "This Year" },
    ];

    return (
        <div className={`inline-flex max-w-full flex-wrap items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${className}`}>
            {periods.map((period) => (
                <button
                    key={period.id}
                    onClick={() => onChange(period.id)}
                    className={`
            px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap
            ${value === period.id
                            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-600"
                            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                        }
          `}
                >
                    {period.label}
                </button>
            ))}
        </div>
    );
}
