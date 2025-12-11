import React, { useEffect } from "react";
import { ToastType, Toast as ToastData } from "../../utils/toastManager";

interface ToastProps {
    message: string;
    type?: ToastType;
    onClose: () => void;
    duration?: number;
}

interface ToastContainerProps {
    toasts: ToastData[];
    removeToast: (id: number) => void;
}

export default function Toast({ message, type = "success", onClose, duration = 3000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const typeStyles: Record<ToastType, string> = {
        success: "bg-emerald-50 border-emerald-200 text-emerald-800",
        error: "bg-red-50 border-red-200 text-red-800",
        warning: "bg-orange-50 border-orange-200 text-orange-800",
        info: "bg-blue-50 border-blue-200 text-blue-800"
    };

    const icons: Record<ToastType, string> = {
        success: "✓",
        error: "✕",
        warning: "⚠",
        info: "ℹ"
    };

    return (
        <div className={`fixed top-4 right-4 z-50 min-w-[300px] max-w-md rounded-lg border shadow-lg p-4 flex items-start gap-3 animate-slide-in ${typeStyles[type]}`}>
            <span className="text-lg font-semibold">{icons[type]}</span>
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={onClose}
                className="text-lg leading-none hover:opacity-70 transition-opacity"
            >
                ×
            </button>
        </div>
    );
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}
