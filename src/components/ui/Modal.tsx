import React, { useEffect, ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'square';
}

export default function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
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

    const sizeClasses: Record<string, string> = {
        sm: "max-w-md",
        md: "max-w-2xl",
        lg: "max-w-4xl",
        xl: "max-w-6xl",
        square: "w-full max-w-2xl sm:max-w-[600px]"
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className={`relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl ${sizeClasses[size]} ${size === 'square' ? 'h-[75vh] sm:h-[600px] max-h-[92vh]' : 'w-full max-h-[92vh]'} overflow-y-auto flex flex-col`}>
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-2xl leading-none"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className={`px-4 sm:px-6 py-4 ${size === 'square' ? 'flex-1 flex flex-col' : ''}`}>
                    {children}
                </div>
            </div>
        </div>
    );
}
