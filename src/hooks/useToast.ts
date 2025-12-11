import { useState, useEffect } from "react";
import { toastManager, Toast } from "../utils/toastManager";

interface UseToastReturn {
    toasts: Toast[];
    removeToast: (id: number) => void;
}

export function useToast(): UseToastReturn {
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        const unsubscribe = toastManager.subscribe((toast: Toast) => {
            setToasts(prev => [...prev, toast]);
        });

        return unsubscribe;
    }, []);

    const removeToast = (id: number): void => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return { toasts, removeToast };
}
