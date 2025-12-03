import React, { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children, size = "md" }) {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-2xl",
        lg: "max-w-4xl",
        xl: "max-w-6xl"
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className={`relative bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} mx-4 max-h-[90vh] overflow-y-auto`}>
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="px-6 py-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
