import React from "react";
import { Link } from "react-router-dom";

/**
 * PageHeader - A reusable premium header component for app pages
 * 
 * @param {string} title - Main title text
 * @param {string} subtitle - Optional subtitle/description
 * @param {React.ReactNode} actions - Optional action buttons
 * @param {string} backLink - Optional back navigation link
 * @param {string} backLabel - Optional back link label
 * @param {boolean} gradient - Whether to show gradient styling (default: true)
 */
interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
    backLink?: string;
    backLabel?: string;
    gradient?: boolean;
}

export default function PageHeader({
    title,
    subtitle,
    actions,
    backLink,
    backLabel = "Back",
    gradient = true
}: PageHeaderProps) {
    return (
        <div className={`mb-6 ${gradient ? "pb-6 border-b border-slate-200" : ""}`}>
            {backLink && (
                <Link
                    to={backLink}
                    className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-ev-green mb-3 transition group"
                >
                    <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
                    {backLabel}
                </Link>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    {gradient ? (
                        <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 mb-1">
                            {title}
                        </h1>
                    ) : (
                        <h1 className="text-2xl font-semibold text-slate-900 mb-1">
                            {title}
                        </h1>
                    )}
                    {subtitle && (
                        <p className="text-sm text-slate-600">{subtitle}</p>
                    )}
                </div>

                {actions && (
                    <div className="flex flex-wrap items-center gap-2">
                        {actions}
                    </div>
                )}
            </div>

            {gradient && (
                <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-ev-green via-emerald-400 to-orange-400 opacity-80" />
            )}
        </div>
    );
}

/**
 * PageHeaderAction - A styled action button for the header
 */
interface PageHeaderActionProps {
    to?: string;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "outline" | "ghost";
    children: React.ReactNode;
    icon?: React.ReactNode;
}

export function PageHeaderAction({
    to,
    onClick,
    variant = "primary",
    children,
    icon
}: PageHeaderActionProps) {
    const baseStyles = "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover-lift";

    const variantStyles = {
        primary: "bg-gradient-to-r from-ev-green to-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30",
        secondary: "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30",
        outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-ev-green",
        ghost: "text-slate-600 hover:text-ev-green hover:bg-slate-50"
    };

    const classes = `${baseStyles} ${variantStyles[variant]}`;

    if (to) {
        return (
            <Link to={to} className={classes}>
                {icon && <span>{icon}</span>}
                {children}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={classes}>
            {icon && <span>{icon}</span>}
            {children}
        </button>
    );
}
